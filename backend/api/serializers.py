from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile, MedicalRecord, Prescription, Medication,
    MedicineReminder, Appointment, HealthMetric, DietPlan,
    AIConsultation, EmergencyContact, DoctorReview
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    age = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def get_age(self, obj):
        if obj.date_of_birth:
            from datetime import date
            today = date.today()
            return today.year - obj.date_of_birth.year - (
                (today.month, today.day) < (obj.date_of_birth.month, obj.date_of_birth.day)
            )
        return None


class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = '__all__'
        read_only_fields = ['created_at']


class PrescriptionSerializer(serializers.ModelSerializer):
    medications = MedicationSerializer(many=True, read_only=True)
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)
    
    class Meta:
        model = Prescription
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class MedicalRecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    recorded_by_name = serializers.CharField(source='recorded_by.get_full_name', read_only=True)
    
    class Meta:
        model = MedicalRecord
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class MedicineReminderSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    
    class Meta:
        model = MedicineReminder
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)
    
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class HealthMetricSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    
    class Meta:
        model = HealthMetric
        fields = '__all__'
        read_only_fields = ['created_at']


class DietPlanSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = DietPlan
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class AIConsultationSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    
    class Meta:
        model = AIConsultation
        fields = '__all__'
        read_only_fields = ['created_at', 'ai_response', 'confidence_score']


class EmergencyContactSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    
    class Meta:
        model = EmergencyContact
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class DoctorReviewSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)
    
    class Meta:
        model = DoctorReview
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


# Request/Response serializers for AI consultations
class AIConsultationRequestSerializer(serializers.Serializer):
    symptoms = serializers.CharField(required=True)
    patient_message = serializers.CharField(required=True)
    medical_history = serializers.CharField(required=False, allow_blank=True)
    current_medications = serializers.CharField(required=False, allow_blank=True)


class PrescriptionAnalysisRequestSerializer(serializers.Serializer):
    prescription_text = serializers.CharField(required=True)