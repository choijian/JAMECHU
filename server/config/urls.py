from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('recommendation/', include('recommendation.urls')),  # 추천 관련
]