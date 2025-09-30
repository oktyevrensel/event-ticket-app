from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, EventViewSet, TicketViewSet
from .admin_views import AdminDashboardViewSet
from .payment_views import (
    create_payment_intent, 
    confirm_payment, 
    payment_methods, 
    create_setup_intent
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'tickets', TicketViewSet)
router.register(r'admin', AdminDashboardViewSet, basename='admin')
router.register(r'', EventViewSet)  # Ana events endpoint'i

urlpatterns = [
    path('', include(router.urls)),
    # Payment endpoints
    path('payment/create-intent/', create_payment_intent, name='create_payment_intent'),
    path('payment/confirm/', confirm_payment, name='confirm_payment'),
    path('payment/methods/', payment_methods, name='payment_methods'),
    path('payment/setup-intent/', create_setup_intent, name='create_setup_intent'),
]
