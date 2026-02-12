from django.contrib import admin
from .models import (
    UserProfile, MedicalRecord, Prescription, Medication,
    MedicineReminder, Appointment, HealthMetric, DietPlan,
    AIConsultation, EmergencyContact, DoctorReview
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'user_type', 'phone', 'gender', 'created_at']
    list_filter = ['user_type', 'gender', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ['patient', 'title', 'recorded_by', 'record_date', 'created_at']
    list_filter = ['record_date', 'created_at']
    search_fields = ['patient__username', 'title', 'diagnosis']
    readonly_fields = ['created_at', 'updated_at']


class MedicationInline(admin.TabularInline):
    model = Medication
    extra = 1


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'prescription_date', 'valid_until']
    list_filter = ['prescription_date', 'created_at']
    search_fields = ['patient__username', 'doctor__username', 'diagnosis']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [MedicationInline]


@admin.register(MedicineReminder)
class MedicineReminderAdmin(admin.ModelAdmin):
    list_display = ['patient', 'medicine_name', 'start_date', 'end_date', 'is_active']
    list_filter = ['is_active', 'start_date', 'end_date']
    search_fields = ['patient__username', 'medicine_name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'appointment_date', 'status', 'duration']
    list_filter = ['status', 'appointment_date', 'created_at']
    search_fields = ['patient__username', 'doctor__username', 'reason']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(HealthMetric)
class HealthMetricAdmin(admin.ModelAdmin):
    list_display = ['patient', 'metric_type', 'value', 'unit', 'recorded_at']
    list_filter = ['metric_type', 'recorded_at']
    search_fields = ['patient__username']
    readonly_fields = ['created_at']


@admin.register(DietPlan)
class DietPlanAdmin(admin.ModelAdmin):
    list_display = ['patient', 'title', 'created_by', 'start_date', 'end_date', 'is_active']
    list_filter = ['is_active', 'start_date', 'created_at']
    search_fields = ['patient__username', 'title']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(AIConsultation)
class AIConsultationAdmin(admin.ModelAdmin):
    list_display = ['patient', 'confidence_score', 'created_at']
    list_filter = ['created_at']
    search_fields = ['patient__username', 'symptoms']
    readonly_fields = ['created_at']


@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ['patient', 'name', 'relationship', 'phone', 'is_primary']
    list_filter = ['is_primary', 'relationship']
    search_fields = ['patient__username', 'name', 'phone']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(DoctorReview)
class DoctorReviewAdmin(admin.ModelAdmin):
    list_display = ['doctor', 'patient', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['doctor__username', 'patient__username', 'review']
    readonly_fields = ['created_at', 'updated_at']