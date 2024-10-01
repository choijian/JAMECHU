from django.urls import path
from .views import PopRecView, RecipeDetailView

urlpatterns = [
    path('poprec', PopRecView.as_view(), name='poprec'),
    path('recipe-detail', RecipeDetailView.as_view(), name='detail'),
]