from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.db.models import Q, Avg
from datetime import datetime, timedelta

from .models import (
    UserProfile, MedicalRecord, Prescription, Medication,
    MedicineReminder, Appointment, HealthMetric, DietPlan,
    AIConsultation, EmergencyContact, DoctorReview
)
from .serializers import (
    UserProfileSerializer, MedicalRecordSerializer, PrescriptionSerializer,
    MedicationSerializer, MedicineReminderSerializer, AppointmentSerializer,
    HealthMetricSerializer, DietPlanSerializer, AIConsultationSerializer,
    EmergencyContactSerializer, DoctorReviewSerializer,
    AIConsultationRequestSerializer, PrescriptionAnalysisRequestSerializer
)
from .gemini_service import gemini_service


class UserProfileViewSet(viewsets.ModelViewSet):
    """User profile management"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)


class MedicalRecordViewSet(viewsets.ModelViewSet):
    """Medical records management"""
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.user_type == 'doctor':
            # Doctors can see records they created
            return MedicalRecord.objects.filter(recorded_by=user)
        else:
            # Patients see their own records
            return MedicalRecord.objects.filter(patient=user)
    
    def perform_create(self, serializer):
        serializer.save(recorded_by=self.request.user)


class PrescriptionViewSet(viewsets.ModelViewSet):
    """Prescription management"""
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.user_type == 'doctor':
            return Prescription.objects.filter(doctor=user)
        else:
            return Prescription.objects.filter(patient=user)
    
    @action(detail=True, methods=['post'])
    def analyze(self, request, pk=None):
        """Analyze prescription using Gemini AI"""
        prescription = self.get_object()
        
        # Build prescription text
        prescription_text = f"""
Diagnosis: {prescription.diagnosis}
Date: {prescription.prescription_date.strftime('%Y-%m-%d')}

Medications:
"""
        for med in prescription.medications.all():
            prescription_text += f"""
- {med.name}
  Dosage: {med.dosage}
  Frequency: {med.frequency}
  Duration: {med.duration}
  Instructions: {med.instructions}
"""
        
        # Get patient age
        patient_age = None
        if hasattr(prescription.patient, 'profile') and prescription.patient.profile.date_of_birth:
            from datetime import date
            today = date.today()
            dob = prescription.patient.profile.date_of_birth
            patient_age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        
        # Analyze with Gemini
        result = gemini_service.analyze_prescription(prescription_text, patient_age)
        
        return Response(result)


class MedicineReminderViewSet(viewsets.ModelViewSet):
    """Medicine reminder management"""
    serializer_class = MedicineReminderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return MedicineReminder.objects.filter(patient=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)


class AppointmentViewSet(viewsets.ModelViewSet):
    """Appointment management"""
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.user_type == 'doctor':
            return Appointment.objects.filter(doctor=user)
        else:
            return Appointment.objects.filter(patient=user)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming appointments"""
        queryset = self.get_queryset().filter(
            appointment_date__gte=datetime.now(),
            status__in=['scheduled', 'confirmed']
        ).order_by('appointment_date')
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class HealthMetricViewSet(viewsets.ModelViewSet):
    """Health metrics tracking"""
    serializer_class = HealthMetricSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return HealthMetric.objects.filter(patient=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)
    
    @action(detail=False, methods=['get'])
    def trends(self, request):
        """Get health metric trends"""
        metric_type = request.query_params.get('type')
        days = int(request.query_params.get('days', 30))
        
        start_date = datetime.now() - timedelta(days=days)
        
        queryset = self.get_queryset().filter(
            recorded_at__gte=start_date
        )
        
        if metric_type:
            queryset = queryset.filter(metric_type=metric_type)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class DietPlanViewSet(viewsets.ModelViewSet):
    """Diet plan management"""
    serializer_class = DietPlanSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.user_type in ['doctor', 'healthcare_worker']:
            return DietPlan.objects.filter(created_by=user)
        else:
            return DietPlan.objects.filter(patient=user)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get active diet plans"""
        queryset = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AIConsultationViewSet(viewsets.ModelViewSet):
    """AI consultation management"""
    serializer_class = AIConsultationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return AIConsultation.objects.filter(patient=self.request.user)
    
    def create(self, request):
        """Create new AI consultation"""
        request_serializer = AIConsultationRequestSerializer(data=request.data)
        
        if not request_serializer.is_valid():
            return Response(
                request_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = request_serializer.validated_data
        
        # Build patient context
        patient_context = {}
        if hasattr(request.user, 'profile'):
            profile = request.user.profile
            if profile.date_of_birth:
                from datetime import date
                today = date.today()
                dob = profile.date_of_birth
                patient_context['age'] = today.year - dob.year - (
                    (today.month, today.day) < (dob.month, dob.day)
                )
            if profile.gender:
                patient_context['gender'] = profile.get_gender_display()
        
        if data.get('medical_history'):
            patient_context['medical_history'] = data['medical_history']
        
        if data.get('current_medications'):
            patient_context['current_medications'] = data['current_medications']
        
        # Get AI response
        result = gemini_service.analyze_symptoms(
            symptoms=data['symptoms'],
            patient_context=patient_context
        )
        
        if not result['success']:
            return Response(
                {'error': result['error']},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Save consultation
        consultation = AIConsultation.objects.create(
            patient=request.user,
            symptoms=data['symptoms'],
            patient_message=data['patient_message'],
            ai_response=result['response'],
            confidence_score=result['confidence_score']
        )
        
        serializer = self.get_serializer(consultation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """Get consultation history"""
        limit = int(request.query_params.get('limit', 10))
        queryset = self.get_queryset().order_by('-created_at')[:limit]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class EmergencyContactViewSet(viewsets.ModelViewSet):
    """Emergency contact management"""
    serializer_class = EmergencyContactSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return EmergencyContact.objects.filter(patient=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)


class DoctorReviewViewSet(viewsets.ModelViewSet):
    """Doctor review management"""
    serializer_class = DoctorReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.user_type == 'doctor':
            return DoctorReview.objects.filter(doctor=user)
        else:
            return DoctorReview.objects.filter(patient=user)
    
    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics for current user"""
    user = request.user
    
    stats = {
        'upcoming_appointments': Appointment.objects.filter(
            patient=user,
            appointment_date__gte=datetime.now(),
            status__in=['scheduled', 'confirmed']
        ).count(),
        'active_prescriptions': Prescription.objects.filter(
            patient=user,
            valid_until__gte=datetime.now().date()
        ).count() if Prescription.objects.filter(patient=user).exists() else 0,
        'active_reminders': MedicineReminder.objects.filter(
            patient=user,
            is_active=True,
            end_date__gte=datetime.now().date()
        ).count(),
        'total_consultations': AIConsultation.objects.filter(patient=user).count(),
    }
    
    # Get recent health metrics
    recent_metrics = HealthMetric.objects.filter(
        patient=user
    ).order_by('-recorded_at')[:5]
    
    stats['recent_metrics'] = HealthMetricSerializer(recent_metrics, many=True).data
    
    return Response(stats)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def health_education(request):
    """Get health education content using Gemini AI"""
    topic = request.data.get('topic')
    
    if not topic:
        return Response(
            {'error': 'Topic is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    result = gemini_service.get_health_education(topic)
    return Response(result)