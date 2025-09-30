from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import Category, Event, Ticket
from decimal import Decimal
import json

class EventViewSetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category',
            description='Test description'
        )
        
        self.event = Event.objects.create(
            title='Test Event',
            slug='test-event',
            description='Test description',
            date='2024-12-31',
            time='20:00:00',
            location='Test Location',
            category=self.category,
            price=Decimal('100.00'),
            available_tickets=100
        )

    def test_list_events(self):
        """Test listing events"""
        url = reverse('event-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Event')

    def test_retrieve_event(self):
        """Test retrieving a specific event"""
        url = reverse('event-detail', kwargs={'pk': self.event.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Event')

    def test_search_events(self):
        """Test searching events"""
        url = reverse('event-search')
        response = self.client.get(url, {'q': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_filter_events_by_category(self):
        """Test filtering events by category"""
        url = reverse('event-list')
        response = self.client.get(url, {'category': self.category.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_filter_events_by_location(self):
        """Test filtering events by location"""
        url = reverse('event-list')
        response = self.client.get(url, {'location': 'Test Location'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class TicketViewSetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        
        self.event = Event.objects.create(
            title='Test Event',
            slug='test-event',
            description='Test description',
            date='2024-12-31',
            time='20:00:00',
            location='Test Location',
            category=self.category,
            price=Decimal('100.00'),
            available_tickets=100
        )

    def test_list_tickets_authenticated(self):
        """Test listing tickets for authenticated user"""
        # Create a ticket
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            quantity=2,
            total_price=Decimal('200.00')
        )
        
        url = reverse('ticket-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_list_tickets_unauthenticated(self):
        """Test listing tickets without authentication"""
        url = reverse('ticket-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_ticket(self):
        """Test creating a ticket"""
        url = reverse('ticket-list')
        data = {
            'event': self.event.id,
            'quantity': 2,
            'total_price': 200.00
        }
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Ticket.objects.count(), 1)

    def test_cancel_ticket(self):
        """Test canceling a ticket"""
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            quantity=2,
            total_price=Decimal('200.00')
        )
        
        url = reverse('ticket-cancel', kwargs={'pk': ticket.pk})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        ticket.refresh_from_db()
        self.assertTrue(ticket.is_cancelled)
        self.assertEqual(ticket.status, 'cancelled')

    def test_mark_ticket_as_used(self):
        """Test marking a ticket as used"""
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            quantity=2,
            total_price=Decimal('200.00')
        )
        
        url = reverse('ticket-mark-as-used', kwargs={'pk': ticket.pk})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        ticket.refresh_from_db()
        self.assertEqual(ticket.status, 'used')

class AdminDashboardTest(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        self.admin_token = Token.objects.create(user=self.admin_user)
        
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )
        
        self.event = Event.objects.create(
            title='Test Event',
            slug='test-event',
            description='Test description',
            date='2024-12-31',
            time='20:00:00',
            location='Test Location',
            category=self.category,
            price=Decimal('100.00'),
            available_tickets=100
        )
        
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            quantity=2,
            total_price=Decimal('200.00')
        )

    def test_admin_stats(self):
        """Test admin dashboard stats"""
        url = reverse('admin-stats')
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.admin_token.key}')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.data
        self.assertEqual(data['overview']['total_events'], 1)
        self.assertEqual(data['overview']['total_tickets_sold'], 1)
        self.assertEqual(data['overview']['total_revenue'], 200.0)

    def test_admin_stats_non_admin(self):
        """Test admin stats access for non-admin user"""
        regular_user = User.objects.create_user(
            username='regular',
            email='regular@example.com',
            password='regularpass123'
        )
        regular_token = Token.objects.create(user=regular_user)
        
        url = reverse('admin-stats')
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {regular_token.key}')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_events_management(self):
        """Test events management endpoint"""
        url = reverse('admin-events-management')
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.admin_token.key}')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_users_management(self):
        """Test users management endpoint"""
        url = reverse('admin-users-management')
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.admin_token.key}')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # admin + testuser

    def test_tickets_management(self):
        """Test tickets management endpoint"""
        url = reverse('admin-tickets-management')
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.admin_token.key}')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
