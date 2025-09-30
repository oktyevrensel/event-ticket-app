from django.core.management.base import BaseCommand
from events.models import Category, Event

class Command(BaseCommand):
    help = 'Create sample categories and events'

    def handle(self, *args, **options):
        # Create categories
        categories_data = [
            {'name': 'Muzik', 'slug': 'muzik', 'description': 'Muzik etkinlikleri'},
            {'name': 'Spor', 'slug': 'spor', 'description': 'Spor etkinlikleri'},
            {'name': 'Teknoloji', 'slug': 'teknoloji', 'description': 'Teknoloji etkinlikleri'},
            {'name': 'Egitim', 'slug': 'egitim', 'description': 'Egitim etkinlikleri'},
        ]

        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            if created:
                self.stdout.write(f'Created category: {category.name}')

        # Create events
        events_data = [
            {
                'title': 'Rock Konseri 2024',
                'slug': 'rock-konseri-2024',
                'description': 'Harika bir rock konseri!',
                'date': '2024-12-15',
                'time': '20:00:00',
                'location': 'Istanbul Arena',
                'category_slug': 'muzik',
                'price': 150.00,
                'available_tickets': 1000,
            },
            {
                'title': 'Futbol Maci',
                'slug': 'futbol-maci',
                'description': 'Galatasaray vs Fenerbahce',
                'date': '2024-12-20',
                'time': '19:00:00',
                'location': 'Turk Telekom Stadyumu',
                'category_slug': 'spor',
                'price': 200.00,
                'available_tickets': 50000,
            },
            {
                'title': 'Tech Conference 2024',
                'slug': 'tech-conference-2024',
                'description': 'Yapay zeka ve teknoloji konferansi',
                'date': '2024-12-25',
                'time': '09:00:00',
                'location': 'Istanbul Kongre Merkezi',
                'category_slug': 'teknoloji',
                'price': 300.00,
                'available_tickets': 500,
            },
        ]

        for event_data in events_data:
            category_slug = event_data.pop('category_slug')
            category = Category.objects.get(slug=category_slug)
            
            event, created = Event.objects.get_or_create(
                slug=event_data['slug'],
                defaults={
                    **event_data,
                    'category': category
                }
            )
            if created:
                self.stdout.write(f'Created event: {event.title}')

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        )
