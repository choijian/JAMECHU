import os
import json
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import InteractionInfo, RecipeInfo
from .serializers import InteractionSerializer, RecipeSerializer

class PopRecView(APIView):
    def get(self, request):
        recipes = RecipeInfo.objects.values('recipe_id', 'name', 'minutes', 'mean_rating', 'recipe_count')

        # 각 레시피의 mean_rating과 recipe_count의 곱을 계산
        item_popularity = {}
        for recipe in recipes:
            item_popularity[recipe['recipe_id']] = {
                'name': recipe['name'],
                'minutes': recipe['minutes'],
                'mean_rating' : recipe['mean_rating'],
                'recipe_count' : recipe['recipe_count'],
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
                'ingredients': recipe.ingredients,  # 필요시 추가
                'steps': recipe.steps,  # gpt로 요약
                'calories' : recipe.calories,
                'total_fat' : recipe.total_fat,
                'sugar' : recipe.sugar,
                'sodium' : recipe.sodium,
                'protein' : recipe.protein,
                'saturated_fat' : recipe.saturated_fat,
                'carbohydrates' : recipe.carbohydrates                
            }
            return Response(recipe_data, status=status.HTTP_200_OK)
        
        except RecipeInfo.DoesNotExist:
            return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)
        