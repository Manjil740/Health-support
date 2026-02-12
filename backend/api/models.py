from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


class UserProfile(models.Model):
    """Extended user profile for patients and doctors"""
    USER_TYPE_CHOICES = [
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('healthcare_worker', 'Healthcare Worker'),
        ('clinic_admin', 'Clinic Admin'),
        ('platform_admin', 'Platform Admin'),
    ]
    
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='patient')
    phone = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    address = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Patient-specific fields
    blood_group = models.CharField(max_length=5, blank=True)
    height = models.FloatField(null=True, blank=True, help_text="Height in cm")
    weight = models.FloatField(null=True, blank=True, help_text="Weight in kg")
    emergency_contact = models.CharField(max_length=15, blank=True)
    
    # Doctor-specific fields
    specialization = models.CharField(max_length=100, blank=True)
    license_number = models.CharField(max_length=50, blank=True)
    years_of_experience = models.IntegerField(null=True, blank=True)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    class Meta:
        db_table = 'user_profiles'
    
    def __str__(self):
        return f"{self.user.username} - {self.user_type}"


class MedicalRecord(models.Model):
    """Patient medical records"""
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medical_records')
    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='recorded_medical_records')
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    diagnosis = models.TextField(blank=True)
    symptoms = models.TextField(blank=True)
    
    record_date = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    attachments = models.FileField(upload_to='medical_records/', null=True, blank=True)
    
    class Meta:
        db_table = 'medical_records'
        ordering = ['-record_date']
    
    def __str__(self):
        return f"{self.patient.username} - {self.title}"


class Prescription(models.Model):
    """Doctor prescriptions"""
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions')
    doctor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='issued_prescriptions')
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.SET_NULL, null=True, blank=True)
    
    diagnosis = models.TextField()
    notes = models.TextField(blank=True)
    
    prescription_date = models.DateTimeField(default=timezone.now)
    valid_until = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'prescriptions'
        ordering = ['-prescription_date']
    
    def __str__(self):
        return f"Prescription for {self.patient.username} by Dr. {self.doctor.username if self.doctor else 'Unknown'}"


class Medication(models.Model):
    """Medications in a prescription"""
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='medications')
    
    name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100, help_text="e.g., Twice daily, Three times a day")
    duration = models.CharField(max_length=100, help_text="e.g., 7 days, 2 weeks")
    instructions = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'medications'
    
    def __str__(self):
        return f"{self.name} - {self.dosage}"


class MedicineReminder(models.Model):
    """Medicine reminders for patients"""
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medicine_reminders')
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE, null=True, blank=True)
    
    medicine_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    
    start_date = models.DateField()
    end_date = models.DateField()
    
    reminder_times = models.JSONField(help_text="List of times in HH:MM format")
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'medicine_reminders'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.medicine_name} reminder for {self.patient.username}"


class Appointment(models.Model):
    """Doctor appointments"""
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]
    
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_appointments')
    
    appointment_date = models.DateTimeField()
    duration = models.IntegerField(default=30, help_text="Duration in minutes")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    
    reason = models.TextField()
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'appointments'
        ordering = ['-appointment_date']
    
    def __str__(self):
        return f"Appointment: {self.patient.username} with Dr. {self.doctor.username}"


class HealthMetric(models.Model):
    """Track patient health metrics"""
    METRIC_TYPE_CHOICES = [
        ('blood_pressure', 'Blood Pressure'),
        ('blood_sugar', 'Blood Sugar'),
        ('heart_rate', 'Heart Rate'),
        ('temperature', 'Temperature'),
        ('weight', 'Weight'),
        ('oxygen_saturation', 'Oxygen Saturation'),
        ('other', 'Other'),
    ]
    
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='health_metrics')
    metric_type = models.CharField(max_length=30, choices=METRIC_TYPE_CHOICES)
    value = models.CharField(max_length=100)
    unit = models.CharField(max_length=50)
    notes = models.TextField(blank=True)
    
    recorded_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'health_metrics'
        ordering = ['-recorded_at']
    
    def __str__(self):
        return f"{self.patient.username} - {self.metric_type}: {self.value}"


class DietPlan(models.Model):
    """Nutrition and diet plans"""
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='diet_plans')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_diet_plans')
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    goal = models.CharField(max_length=200, blank=True)
    
    daily_calories = models.IntegerField(null=True, blank=True)
    plan_details = models.JSONField(help_text="Detailed meal plan structure")
    
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'diet_plans'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Diet Plan: {self.title} for {self.patient.username}"


class AIConsultation(models.Model):
    """AI-powered consultations using Gemini"""
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_consultations')
    
    symptoms = models.TextField()
    patient_message = models.TextField()
    ai_response = models.TextField()
    
    confidence_score = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(1.0)], null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ai_consultations'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"AI Consultation for {self.patient.username} on {self.created_at.strftime('%Y-%m-%d')}"


class EmergencyContact(models.Model):
    """Emergency contacts for patients"""
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emergency_contacts')
    
    name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=50)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True)
    is_primary = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'emergency_contacts'
    
    def __str__(self):
        return f"{self.name} - {self.relationship} (Emergency contact for {self.patient.username})"


class DoctorReview(models.Model):
    """Patient reviews for doctors"""
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_reviews')
    
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    review = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'doctor_reviews'
        ordering = ['-created_at']
        unique_together = ['doctor', 'patient']
    
    def __str__(self):
        return f"Review for Dr. {self.doctor.username} by {self.patient.username} - {self.rating} stars"