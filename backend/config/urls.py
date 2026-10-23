"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        "status": "healthy",
        "service": "DevLens AI API",
        "endpoints": {
            "reviews": "/api/reviews/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path('', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    path('api/reviews/', include('reviews.urls')),
    path('reviews/', include('reviews.urls')),
]
