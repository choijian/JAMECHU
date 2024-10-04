from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import InteractionInfo, RecipeInfo
from .recommendations import get_recipe_details
from .recommendations import run_fm_model, run_knn_model, run_cbf_model

# 추천 모델 선택 API
class RecommendModelView(APIView):
    def post(self, request):
        model_id = request.data.get('model_id')
        recipe_ids = request.data.get('recipe_ids')

        if not recipe_ids or len(recipe_ids) < 3:
            return Response({"error": "Not enough recipe data"}, status=status.HTTP_400_BAD_REQUEST)

        if model_id == "FM":
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