import stripe
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Event, Ticket
import json

# Stripe API key'i ayarla
stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', 'sk_test_...')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    """Stripe Payment Intent oluştur"""
    try:
        data = request.data
        event_id = data.get('event_id')
        quantity = int(data.get('quantity', 1))
        
        # Event'i al
        event = get_object_or_404(Event, id=event_id)
        
        # Bilet yeterli mi kontrol et
        if event.remaining_tickets < quantity:
            return Response(
                {'error': 'Yeterli bilet yok'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Toplam fiyatı hesapla
        total_amount = int(event.price * quantity * 100)  # Kuruş cinsinden
        
        # Payment Intent oluştur
        intent = stripe.PaymentIntent.create(
            amount=total_amount,
            currency='try',
            metadata={
                'event_id': event_id,
                'user_id': request.user.id,
                'quantity': quantity
            }
        )
        
        return Response({
            'client_secret': intent.client_secret,
            'amount': total_amount,
            'currency': 'try'
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_payment(request):
    """Ödeme onaylandıktan sonra bilet oluştur"""
    try:
        data = request.data
        payment_intent_id = data.get('payment_intent_id')
        event_id = data.get('event_id')
        quantity = int(data.get('quantity', 1))
        
        # Payment Intent'i doğrula
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if intent.status != 'succeeded':
            return Response(
                {'error': 'Ödeme başarısız'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Event'i al
        event = get_object_or_404(Event, id=event_id)
        
        # Bilet oluştur
        ticket = Ticket.objects.create(
            user=request.user,
            event=event,
            quantity=quantity,
            total_price=event.price * quantity,
            status='active'
        )
        
        return Response({
            'success': True,
            'ticket_id': ticket.id,
            'ticket_number': ticket.ticket_number,
            'message': 'Bilet başarıyla oluşturuldu'
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_methods(request):
    """Kullanıcının kayıtlı ödeme yöntemlerini getir"""
    try:
        # Stripe Customer oluştur veya al
        customer = stripe.Customer.list(
            email=request.user.email,
            limit=1
        )
        
        if not customer.data:
            customer = stripe.Customer.create(
                email=request.user.email,
                name=f"{request.user.first_name} {request.user.last_name}"
            )
        else:
            customer = customer.data[0]
        
        # Payment methods'ları al
        payment_methods = stripe.PaymentMethod.list(
            customer=customer.id,
            type='card'
        )
        
        return Response({
            'payment_methods': payment_methods.data,
            'customer_id': customer.id
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_setup_intent(request):
    """Kart kaydetmek için Setup Intent oluştur"""
    try:
        # Stripe Customer oluştur veya al
        customer = stripe.Customer.list(
            email=request.user.email,
            limit=1
        )
        
        if not customer.data:
            customer = stripe.Customer.create(
                email=request.user.email,
                name=f"{request.user.first_name} {request.user.last_name}"
            )
        else:
            customer = customer.data[0]
        
        # Setup Intent oluştur
        setup_intent = stripe.SetupIntent.create(
            customer=customer.id,
            payment_method_types=['card']
        )
        
        return Response({
            'client_secret': setup_intent.client_secret,
            'customer_id': customer.id
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
