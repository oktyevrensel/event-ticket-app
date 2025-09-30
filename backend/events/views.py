from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from .models import Category, Event, Ticket
from .serializers import CategorySerializer, EventListSerializer, EventDetailSerializer, TicketSerializer, TicketPurchaseSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.filter(is_active=True)
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'date', 'location']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['date', 'time', 'price']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EventDetailSerializer
        return EventListSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TicketPurchaseSerializer
        return TicketSerializer
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        ticket = self.get_object()
        if ticket.status != 'active':
            return Response(
                {"detail": "Bu bilet iptal edilemez."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ticket.cancel()
        return Response({"detail": "Bilet başarıyla iptal edildi."})
    
    @action(detail=True, methods=['post'])
    def validate(self, request, pk=None):
        ticket = self.get_object()
        if ticket.status != 'active':
            return Response(
                {"detail": "Bu bilet geçersiz."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ticket.mark_as_used()
        return Response({"detail": "Bilet başarıyla doğrulandı."})