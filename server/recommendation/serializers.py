from rest_framework import serializers
from .models import InteractionInfo, RecipeInfo

class InteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InteractionInfo
        fields = '__all__'
        
class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeInfo
        fields = '__all__'