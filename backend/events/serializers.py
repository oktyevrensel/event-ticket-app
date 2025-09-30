from rest_framework import serializers
from .models import Category, Event, Ticket

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class EventListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    remaining_tickets = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'slug', 'description', 'image', 'date', 'time', 
                 'location', 'category', 'price', 'available_tickets', 
                 'remaining_tickets', 'is_active']

class EventDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    remaining_tickets = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'slug', 'description', 'image', 'date', 'time', 
                 'location', 'category', 'price', 'available_tickets', 
                 'remaining_tickets', 'is_active', 'created_at', 'updated_at']

class TicketSerializer(serializers.ModelSerializer):
    event = EventListSerializer(read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'ticket_number', 'event', 'purchase_date', 'quantity', 
                 'total_price', 'status', 'is_cancelled']

class TicketPurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['event', 'quantity']
    
    def create(self, validated_data):
        event = validated_data['event']
        quantity = validated_data['quantity']
        user = self.context['request'].user
        
        # Calculate total price
        total_price = event.price * quantity
        
        # Create ticket
        ticket = Ticket.objects.create(
            event=event,
            user=user,
            quantity=quantity,
            total_price=total_price
        )
        
        return ticket
