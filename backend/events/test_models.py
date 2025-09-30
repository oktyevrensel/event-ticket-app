from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .models import Category, Event, Ticket
from decimal import Decimal

class CategoryModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category',
            description='Test description'
        )

    def test_category_creation(self):
        self.assertEqual(self.category.name, 'Test Category')
        self.assertEqual(self.category.slug, 'test-category')
        self.assertEqual(self.category.description, 'Test description')

    def test_category_str(self):
        self.assertEqual(str(self.category), 'Test Category')

    def test_category_verbose_name_plural(self):
        self.assertEqual(Category._meta.verbose_name_plural, 'Categories')

class EventModelTest(TestCase):
    def setUp(self):
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

    def test_event_creation(self):
        self.assertEqual(self.event.title, 'Test Event')
        self.assertEqual(self.event.price, Decimal('100.00'))
        self.assertEqual(self.event.available_tickets, 100)
        self.assertTrue(self.event.is_active)

    def test_event_str(self):
        self.assertEqual(str(self.event), 'Test Event')

    def test_remaining_tickets_property(self):
        # Initially, no tickets sold
        self.assertEqual(self.event.remaining_tickets, 100)
        
        # Create a user and ticket
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        ticket = Ticket.objects.create(
            event=self.event,
            user=user,
            quantity=5,
            total_price=Decimal('500.00')
        )
        
        # Check remaining tickets
        self.assertEqual(self.event.remaining_tickets, 95)

    def test_event_ordering(self):
        # Create another event with different date
        event2 = Event.objects.create(
            title='Test Event 2',
            slug='test-event-2',
            description='Test description 2',
            date='2024-12-30',  # Earlier date
            time='19:00:00',
            location='Test Location 2',
            category=self.category,
            price=Decimal('50.00'),
            available_tickets=50
        )
        
        events = Event.objects.all()
        # Should be ordered by date descending, then time
        self.assertEqual(events[0], self.event)  # Later date first
        self.assertEqual(events[1], event2)

class TicketModelTest(TestCase):
    def setUp(self):
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

    def test_ticket_creation(self):
        self.assertEqual(self.ticket.event, self.event)
        self.assertEqual(self.ticket.user, self.user)
        self.assertEqual(self.ticket.quantity, 2)
        self.assertEqual(self.ticket.total_price, Decimal('200.00'))
        self.assertEqual(self.ticket.status, 'active')
        self.assertFalse(self.ticket.is_cancelled)

    def test_ticket_str(self):
        expected = f"{self.ticket.ticket_number} - {self.event.title} - {self.user.email}"
        self.assertEqual(str(self.ticket), expected)

    def test_ticket_cancel(self):
        self.ticket.cancel()
        self.assertTrue(self.ticket.is_cancelled)
        self.assertEqual(self.ticket.status, 'cancelled')

    def test_ticket_mark_as_used(self):
        self.ticket.mark_as_used()
        self.assertEqual(self.ticket.status, 'used')

    def test_ticket_ordering(self):
        # Create another ticket
        user2 = User.objects.create_user(
            username='testuser2',
            email='test2@example.com',
            password='testpass123'
        )
        ticket2 = Ticket.objects.create(
            event=self.event,
            user=user2,
            quantity=1,
            total_price=Decimal('100.00')
        )
        
        tickets = Ticket.objects.all()
        # Should be ordered by purchase_date descending
        self.assertEqual(tickets[0], ticket2)  # More recent first
        self.assertEqual(tickets[1], self.ticket)
