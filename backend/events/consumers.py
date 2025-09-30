import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Event, Ticket
from django.contrib.auth.models import User

class EventConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.event_id = self.scope['url_route']['kwargs']['event_id']
        self.event_group_name = f'event_{self.event_id}'
        
        # Join event group
        await self.channel_layer.group_add(
            self.event_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send current ticket count
        await self.send_ticket_count()

    async def disconnect(self, close_code):
        # Leave event group
        await self.channel_layer.group_discard(
            self.event_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        
        if message_type == 'get_ticket_count':
            await self.send_ticket_count()
        elif message_type == 'join_event':
            await self.send_event_info()

    async def send_ticket_count(self):
        ticket_count = await self.get_ticket_count()
        remaining_tickets = await self.get_remaining_tickets()
        
        await self.send(text_data=json.dumps({
            'type': 'ticket_count',
            'ticket_count': ticket_count,
            'remaining_tickets': remaining_tickets
        }))

    async def send_event_info(self):
        event_info = await self.get_event_info()
        await self.send(text_data=json.dumps({
            'type': 'event_info',
            'event': event_info
        }))

    async def ticket_purchased(self, event):
        # Send message to event group
        await self.channel_layer.group_send(
            self.event_group_name,
            {
                'type': 'ticket_purchased',
                'ticket_count': event['ticket_count'],
                'remaining_tickets': event['remaining_tickets'],
                'user': event['user']
            }
        )

    async def ticket_purchased(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'ticket_purchased',
            'ticket_count': event['ticket_count'],
            'remaining_tickets': event['remaining_tickets'],
            'user': event['user']
        }))

    @database_sync_to_async
    def get_ticket_count(self):
        try:
            event = Event.objects.get(id=self.event_id)
            return event.tickets.filter(is_cancelled=False).count()
        except Event.DoesNotExist:
            return 0

    @database_sync_to_async
    def get_remaining_tickets(self):
        try:
            event = Event.objects.get(id=self.event_id)
            return event.remaining_tickets
        except Event.DoesNotExist:
            return 0

    @database_sync_to_async
    def get_event_info(self):
        try:
            event = Event.objects.get(id=self.event_id)
            return {
                'id': event.id,
                'title': event.title,
                'price': float(event.price),
                'available_tickets': event.available_tickets,
                'remaining_tickets': event.remaining_tickets
            }
        except Event.DoesNotExist:
            return None

class AdminConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.admin_group_name = 'admin_dashboard'
        
        # Join admin group
        await self.channel_layer.group_add(
            self.admin_group_name,
            self.channel_name
        )
        
        await self.accept()

    async def disconnect(self, close_code):
        # Leave admin group
        await self.channel_layer.group_discard(
            self.admin_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        
        if message_type == 'get_stats':
            await self.send_stats()

    async def send_stats(self):
        stats = await self.get_dashboard_stats()
        await self.send(text_data=json.dumps({
            'type': 'dashboard_stats',
            'stats': stats
        }))

    async def stats_updated(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'stats_updated',
            'stats': event['stats']
        }))

    @database_sync_to_async
    def get_dashboard_stats(self):
        from django.db.models import Count, Sum
        from datetime import timedelta
        from django.utils import timezone
        
        today = timezone.now().date()
        thirty_days_ago = today - timedelta(days=30)
        
        total_events = Event.objects.count()
        active_events = Event.objects.filter(is_active=True).count()
        total_tickets_sold = Ticket.objects.filter(is_cancelled=False).count()
        total_revenue = Ticket.objects.filter(is_cancelled=False).aggregate(
            total=Sum('total_price')
        )['total'] or 0
        
        recent_tickets = Ticket.objects.filter(
            purchase_date__gte=thirty_days_ago,
            is_cancelled=False
        ).count()
        recent_revenue = Ticket.objects.filter(
            purchase_date__gte=thirty_days_ago,
            is_cancelled=False
        ).aggregate(total=Sum('total_price'))['total'] or 0
        
        return {
            'total_events': total_events,
            'active_events': active_events,
            'total_tickets_sold': total_tickets_sold,
            'total_revenue': float(total_revenue),
            'recent_tickets': recent_tickets,
            'recent_revenue': float(recent_revenue)
        }
