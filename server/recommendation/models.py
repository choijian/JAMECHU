from django.db import models

class InteractionInfo(models.Model):
    user_id = models.CharField(max_length=20)
    recipe_id = models.CharField(max_length=20)
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    
class RecipeInfo(models.Model):
    name = models.CharField(max_length=100)
    recipe_id = models.CharField(max_length=20)
    minutes = models.IntegerField(default=0)
    n_steps = models.IntegerField(default=0)
    steps = models.TextField()
    ingredients = models.TextField()
    n_ingredients = models.IntegerField()
    calories = models.DecimalField(max_digits=7, decimal_places=1)
    total_fat = models.IntegerField()
    sugar = models.IntegerField()
    sodium = models.IntegerField()
    protein = models.IntegerField()
    saturated_fat = models.IntegerField()
    carbohydrates = models.IntegerField()
    recipe_count = models.IntegerField()
    mean_rating = models.DecimalField(max_digits=2, decimal_places=1)