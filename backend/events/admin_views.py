from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Event, Ticket, Category
from .serializers import EventSerializer, TicketSerializer, CategorySerializer
from accounts.models import User

class AdminDashboardViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        return Event.objects.all()
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Admin dashboard için istatistikler"""
        today = timezone.now().date()
        thirty_days_ago = today - timedelta(days=30)
        
        # Genel istatistikler
        total_events = Event.objects.count()
        active_events = Event.objects.filter(is_active=True).count()
        total_tickets_sold = Ticket.objects.filter(is_cancelled=False).count()
        total_revenue = Ticket.objects.filter(is_cancelled=False).aggregate(
            total=Sum('total_price')
        )['total'] or 0
        
        # Son 30 gün istatistikleri
        recent_events = Event.objects.filter(created_at__gte=thirty_days_ago).count()
        recent_tickets = Ticket.objects.filter(
            purchase_date__gte=thirty_days_ago,
            is_cancelled=False
        ).count()
        recent_revenue = Ticket.objects.filter(
            purchase_date__gte=thirty_days_ago,
            is_cancelled=False
        ).aggregate(total=Sum('total_price'))['total'] or 0
        
        # Kategori bazında istatistikler
        category_stats = Category.objects.annotate(
            event_count=Count('events'),
            ticket_count=Count('events__tickets', filter=Q(events__tickets__is_cancelled=False))
        ).values('name', 'event_count', 'ticket_count')
        
        # En popüler etkinlikler
        popular_events = Event.objects.annotate(
            ticket_count=Count('tickets', filter=Q(tickets__is_cancelled=False))
        ).order_by('-ticket_count')[:5]
        
        # Aylık gelir grafiği için veri
        monthly_revenue = []
        for i in range(12):
            month_start = today.replace(day=1) - timedelta(days=30*i)
            month_end = month_start + timedelta(days=30)
            month_revenue = Ticket.objects.filter(
                purchase_date__gte=month_start,
                purchase_date__lt=month_end,
                is_cancelled=False
            ).aggregate(total=Sum('total_price'))['total'] or 0
            monthly_revenue.append({
                'month': month_start.strftime('%Y-%m'),
                'revenue': float(month_revenue)
            })
        
        return Response({
            'overview': {
                'total_events': total_events,
                'active_events': active_events,
                'total_tickets_sold': total_tickets_sold,
                'total_revenue': float(total_revenue)
            },
            'recent_stats': {
                'events_last_30_days': recent_events,
                'tickets_last_30_days': recent_tickets,
                'revenue_last_30_days': float(recent_revenue)
            },
            'category_stats': list(category_stats),
            'popular_events': EventSerializer(popular_events, many=True).data,
            'monthly_revenue': monthly_revenue
        })
    
    @action(detail=False, methods=['get'])
    def events_management(self, request):
        """Etkinlik yönetimi"""
        events = Event.objects.all().order_by('-created_at')
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def users_management(self, request):
        """Kullanıcı yönetimi"""
        users = User.objects.all().order_by('-date_joined')
        user_data = []
        for user in users:
            ticket_count = Ticket.objects.filter(user=user, is_cancelled=False).count()
            total_spent = Ticket.objects.filter(
                user=user, 
                is_cancelled=False
            ).aggregate(total=Sum('total_price'))['total'] or 0
            
            user_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'date_joined': user.date_joined,
                'is_active': user.is_active,
                'ticket_count': ticket_count,
                'total_spent': float(total_spent)
            })
        
        return Response(user_data)
    
    @action(detail=False, methods=['get'])
    def tickets_management(self, request):
        """Bilet yönetimi"""
        tickets = Ticket.objects.select_related('event', 'user').all().order_by('-purchase_date')
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)
