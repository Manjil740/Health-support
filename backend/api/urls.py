from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileViewSet, MedicalRecordViewSet, PrescriptionViewSet,
    MedicineReminderViewSet, AppointmentViewSet, HealthMetricViewSet,
    DietPlanViewSet, AIConsultationViewSet, EmergencyContactViewSet,
    DoctorReviewViewSet, dashboard_stats, health_education
)

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'medical-records', MedicalRecordViewSet, basename='medical-record')
router.register(r'prescriptions', PrescriptionViewSet, basename='prescription')
router.register(r'medicine-reminders', MedicineReminderViewSet, basename='medicine-reminder')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'health-metrics', HealthMetricViewSet, basename='health-metric')
router.register(r'diet-plans', DietPlanViewSet, basename='diet-plan')
router.register(r'ai-consultations', AIConsultationViewSet, basename='ai-consultation')
router.register(r'emergency-contacts', EmergencyContactViewSet, basename='emergency-contact')
router.register(r'doctor-reviews', DoctorReviewViewSet, basename='doctor-review')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    path('health-education/', health_education, name='health-education'),
    path('auth/', include('rest_framework.urls')),
]