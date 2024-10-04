import os
import numpy as np
import lightfm
import joblib
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import InteractionInfo, RecipeInfo

def get_recipe_details(recipe_ids):
    # recipe_ids를 문자열로 변환하여 필터링
    recipe_ids_str = list(map(str, recipe_ids))  # recipe_ids를 문자열 리스트로 변환

    # RecipeInfo에서 필요한 정보를 필터링하여 가져옵니다.
    recipes = RecipeInfo.objects.filter(recipe_id__in=recipe_ids_str).values('recipe_id', 'name', 'minutes', 'mean_rating', 'recipe_count')

    # response_data 생성
    response_data = [
        {
            'recipe_id': recipe['recipe_id'],
            'name': recipe['name'],
            'minutes': recipe['minutes'],
            'mean_rating': recipe['mean_rating'],
            'recipe_count': recipe['recipe_count']
        }
        for recipe in recipes  # 필터링된 결과에서 직접 정보를 가져옴
    ]

    return response_data

# 선택된 아이템을 기준으로 가장 적합한 유저를 찾는 함수
def find_best_user(selected_item_ids):
    interactions = InteractionInfo.objects.filter(recipe_id__in=selected_item_ids)
    
    # 유저별 평점 정보 수집
    user_ratings = {}
    
    for interaction in interactions:
        user_id = interaction.user_id
        rating = interaction.rating
        
        if user_id not in user_ratings:
            user_ratings[user_id] = {'count': 0, 'sum': 0}
        
        user_ratings[user_id]['count'] += 1
        user_ratings[user_id]['sum'] += rating
    
    # 두 개 이상의 아이템에 평점을 준 유저 중 가장 높은 평점을 가진 유저 선택
    best_user = None
    best_rating_sum = -1
    
    for user_id, data in user_ratings.items():
        if data['count'] >= 2 and data['sum'] > best_rating_sum:
            best_user = user_id
            best_rating_sum = data['sum']
    
    # 만약 두 개 이상의 평점을 준 유저가 없다면 1개 이상의 평점을 준 유저 찾기
    if not best_user:
        for user_id, data in user_ratings.items():
            if data['count'] >= 1 and data['sum'] > best_rating_sum:
                best_user = user_id
                best_rating_sum = data['sum']
    return best_user


# FM 모델을 불러와서 실행하는 함수
def run_fm_model(recipe_ids):
    best_user = find_best_user(recipe_ids)  # FM 모델에서만 적합한 유저 찾기
    
    if best_user is None:
        return {"error": "No suitable user found"}
    
    model_path = os.path.join(settings.STATICFILES_DIRS[0], 'lightfm_model.pkl')  # 모델 경로 설정
    
    # LightFM 모델 로드
    try:
        model = joblib.load(model_path)
    except FileNotFoundError:
        return {"error": "LightFM model not found"}
    
    # 예측할 아이템 리스트 (recipe_ids)
    n_items = RecipeInfo.objects.count()  # 총 레시피(아이템) 개수
    best_user = int(best_user)
    item_ids = np.arange(n_items)

    # 유저 ID와 아이템 ID를 사용해 예측
    scores = model.predict(best_user, item_ids, user_features=None, item_features=None)
    
    # 점수에 따라 아이템을 정렬하고 상위 5개 선택
    top_items = np.argsort(-scores)[:5]

    # 추천된 item_id 리스트 반환
    print(top_items.tolist())
    return top_items.tolist()  # 리스트 반환

# MF 모델의 추천을 실행하는 함수
def run_mf_model(recipe_ids):    
    best_user = find_best_user(recipe_ids)  # MF 모델에서도 적합한 유저 찾기
    
    if best_user is None:
        return {"error": "No suitable user found"}
    
    # MF 추천 로직 추가
    return {"mf_recommendations": ["recipe_a", "recipe_b", "recipe_c"]}


# KNN 모델의 추천을 실행하는 함수
def run_knn_model(recipe_ids):
    return {"knn_recommendations": ["recipe_g", "recipe_h", "recipe_i"]}

# CBF 모델의 추천을 실행하는 함수
def run_cbf_model(recipe_ids):
    return {"cbf_recommendations": ["recipe_j", "recipe_k", "recipe_l"]}

# 추천 모델 선택 API
class RecommendModelView(APIView):
    def post(self, request):
        model_id = request.data.get('model_id')
        recipe_ids = request.data.get('recipe_ids')

        if not recipe_ids or len(recipe_ids) < 3:
            return Response({"error": "Not enough recipe data"}, status=status.HTTP_400_BAD_REQUEST)

        # 모델에 맞게 함수를 호출
        if model_id == "MF":
            recommended_recipe_ids = run_mf_model(recipe_ids)
        elif model_id == "FM":
            recommended_recipe_ids = run_fm_model(recipe_ids)
        elif model_id == "KNN":
            recommended_recipe_ids = run_knn_model(recipe_ids)
        elif model_id == "CBF":
            recommended_recipe_ids = run_cbf_model(recipe_ids)
        else:
            return Response({"error": "Invalid model_id"}, status=status.HTTP_400_BAD_REQUEST)

        # 추천된 레시피에 대한 상세 정보를 가져오기
        response_data = get_recipe_details(recommended_recipe_ids)

        # 최종 결과 반환
        return Response(response_data, status=status.HTTP_200_OK)


# 인기 레시피 조회 API
class PopRecView(APIView):
    def get(self, request):
        recipes = RecipeInfo.objects.values('recipe_id', 'name', 'minutes', 'mean_rating', 'recipe_count')

        # 각 레시피의 mean_rating과 recipe_count의 곱을 계산
        item_popularity = {}
        for recipe in recipes:
            item_popularity[recipe['recipe_id']] = {
                'name': recipe['name'],
                'minutes': recipe['minutes'],
                'mean_rating': recipe['mean_rating'],
                'recipe_count': recipe['recipe_count'],
                'popularity_score': recipe['mean_rating'] * recipe['recipe_count']
            }

        # 상위 5개의 레시피 찾기
        top_5_recipes = sorted(item_popularity.items(), key=lambda x: x[1]['popularity_score'], reverse=True)[:5]

        # 반환할 데이터 형식 설정
        response_data = [
            {
                'recipe_id': recipe_id,
                'name': details['name'],
                'minutes': details['minutes'],
                'mean_rating': details['mean_rating'],
                'recipe_count': details['recipe_count']
            }
            for recipe_id, details in top_5_recipes
        ]

        return Response(response_data, status=status.HTTP_200_OK)


# 레시피 상세 정보 조회 API
class RecipeDetailView(APIView):
    def post(self, request):
        recipe_id = request.data.get('recipe_id')
        
        if not recipe_id:
            return Response({'error': 'recipe_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            recipe = RecipeInfo.objects.get(recipe_id=recipe_id)
            recipe_data = {
                'recipe_id': recipe.recipe_id,
                'name': recipe.name,
                'minutes': recipe.minutes,
                'mean_rating': recipe.mean_rating,
                'recipe_count': recipe.recipe_count,
                'ingredients': recipe.ingredients,
                'steps': recipe.steps,  # gpt로 요약
                'calories': recipe.calories,
                'total_fat': recipe.total_fat,
                'sugar': recipe.sugar,
                'sodium': recipe.sodium,
                'protein': recipe.protein,
                'saturated_fat': recipe.saturated_fat,
                'carbohydrates': recipe.carbohydrates                
            }
            return Response(recipe_data, status=status.HTTP_200_OK)
        
        except RecipeInfo.DoesNotExist:
            return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)