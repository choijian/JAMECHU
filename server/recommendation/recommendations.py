import os
import numpy as np
import lightfm
import joblib
import ast
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from django.conf import settings
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
    return top_items.tolist()  # 리스트 반환

# MF 모델의 추천을 실행하는 함수
def run_mf_model(recipe_ids):    
    best_user = find_best_user(recipe_ids)  # MF 모델에서도 적합한 유저 찾기
    
    if best_user is None:
        return {"error": "No suitable user found"}
    
    # MF 추천 로직 추가
    return {"mf_recommendations": ["recipe_a", "recipe_b", "recipe_c"]}

# MF 모델의 추천을 실행하는 함수
def run_knn_model(recipe_ids):    
    best_user = find_best_user(recipe_ids)  # MF 모델에서도 적합한 유저 찾기
    
    if best_user is None:
        return {"error": "No suitable user found"}
    
    # MF 추천 로직 추가
    return {"mf_recommendations": ["recipe_a", "recipe_b", "recipe_c"]}

def run_cbf_model(recipe_ids):
    # RecipeInfo의 모든 레시피 가져오기
    recipes = RecipeInfo.objects.all()
    recipes_df = pd.DataFrame(list(recipes.values()))

    # TF-IDF 계산 준비 (레시피의 요리 과정 text)
    text_data = recipes_df['steps'].tolist()
    tfidf = TfidfVectorizer()
    tfidf_matrix = tfidf.fit_transform(text_data)

    recommended_recipe_ids = []

    # 입력된 각 recipe_id에 대해 2개의 추천 레시피를 구함
    for recipe_id in recipe_ids:
        # 선택된 recipe_id에 해당하는 레시피의 재료 정보 가져오기
        recipe = recipes_df.loc[recipes_df['recipe_id'] == recipe_id]
        ingredients = recipe['ingredients'].values[0]
        
        # 만약 재료가 문자열 형태라면, 안전하게 split으로 처리
        if isinstance(ingredients, str):
            ingredients = ingredients.split(', ')  # 쉼표로 구분된 재료를 리스트로 변환

        # 리스트가 문자열로 변환될 수 있도록 재료를 하나의 문자열로 합침
        ingredients_str = ', '.join(ingredients)

        # 입력된 레시피의 재료를 새로운 쿼리로 변환
        new_query_vector = tfidf.transform([ingredients_str])

        # 코사인 유사도 계산
        cosine_sim = pd.DataFrame(cosine_similarity(tfidf_matrix, new_query_vector), columns=['cosine_similarity_score'], index=recipes_df.index)
        cosine_sim = cosine_sim.sort_values(by='cosine_similarity_score', ascending=False)

        # 유사도가 높은 레시피 2개 추천 (자기 자신은 제외)
        top_recommendations = recipes_df.loc[cosine_sim.index[1:3], 'recipe_id'].tolist()
        recommended_recipe_ids.extend(top_recommendations)

    # 중복 제거 후 최대 6개의 추천 레시피 반환
    return list(set(recommended_recipe_ids))[:6]