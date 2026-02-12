from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile
from datetime import date


class Command(BaseCommand):
    help = 'Create sample users for testing'

    def handle(self, *args, **kwargs):
        # Create patient
        patient, created = User.objects.get_or_create(
            username='patient_demo',
            defaults={
                'email': 'patient@example.com',
                'first_name': 'John',
                'last_name': 'Doe'
            }
        )
        if created:
            patient.set_password('demo123')
            patient.save()
            
            profile = patient.profile
            profile.user_type = 'patient'
            profile.phone = '+1234567890'
            profile.date_of_birth = date(1990, 1, 1)
            profile.gender = 'M'
            profile.blood_group = 'O+'
            profile.height = 175
            profile.weight = 70
            profile.save()
            
            self.stdout.write(self.style.SUCCESS('Created patient user: patient_demo / demo123'))
        
        # Create doctor
        doctor, created = User.objects.get_or_create(
            username='doctor_demo',
            defaults={
                'email': 'doctor@example.com',
                'first_name': 'Jane',
                'last_name': 'Smith'
            }
        )
        if created:
            doctor.set_password('demo123')
            doctor.save()
            
            profile = doctor.profile
            profile.user_type = 'doctor'
            profile.phone = '+1234567891'
            profile.date_of_birth = date(1980, 5, 15)
            profile.gender = 'F'
            profile.specialization = 'General Medicine'
            profile.license_number = 'MD12345'
            profile.years_of_experience = 10
            profile.consultation_fee = 100.00
            profile.save()
            
            self.stdout.write(self.style.SUCCESS('Created doctor user: doctor_demo / demo123'))
        
        self.stdout.write(self.style.SUCCESS('Sample users created successfully!'))