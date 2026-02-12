from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import datetime, timedelta
from .models import MedicineReminder, Appointment
import logging

logger = logging.getLogger(__name__)


@shared_task
def send_medicine_reminders():
    """Send medicine reminders to patients"""
    logger.info("Running medicine reminder task")
    
    now = timezone.now()
    current_time = now.strftime("%H:%M")
    today = now.date()
    
    # Get active reminders for today
    active_reminders = MedicineReminder.objects.filter(
        is_active=True,
        start_date__lte=today,
        end_date__gte=today
    )
    
    reminders_sent = 0
    
    for reminder in active_reminders:
        # Check if current time matches any reminder time
        if current_time in reminder.reminder_times:
            try:
                # Send email notification
                subject = f"Medicine Reminder: {reminder.medicine_name}"
                message = f"""
Hello {reminder.patient.get_full_name()},

This is a reminder to take your medicine:

Medicine: {reminder.medicine_name}
Dosage: {reminder.dosage}
Frequency: {reminder.frequency}

Please take your medicine as prescribed.

Best regards,
Healthcare Support Team
                """
                
                send_mail(
                    subject,
                    message,
                    settings.EMAIL_HOST_USER,
                    [reminder.patient.email],
                    fail_silently=False,
                )
                
                reminders_sent += 1
                logger.info(f"Sent reminder for {reminder.medicine_name} to {reminder.patient.email}")
                
            except Exception as e:
                logger.error(f"Error sending reminder: {str(e)}")
    
    logger.info(f"Total reminders sent: {reminders_sent}")
    return f"Sent {reminders_sent} medicine reminders"


@shared_task
def check_appointment_reminders():
    """Send appointment reminders 24 hours before"""
    logger.info("Running appointment reminder task")
    
    now = timezone.now()
    tomorrow = now + timedelta(hours=24)
    
    # Get appointments in the next 24 hours
    upcoming_appointments = Appointment.objects.filter(
        appointment_date__gte=now,
        appointment_date__lte=tomorrow,
        status__in=['scheduled', 'confirmed']
    )
    
    reminders_sent = 0
    
    for appointment in upcoming_appointments:
        try:
            # Send email to patient
            subject = f"Appointment Reminder - Tomorrow"
            message = f"""
Hello {appointment.patient.get_full_name()},

This is a reminder about your upcoming appointment:

Doctor: Dr. {appointment.doctor.get_full_name()}
Date & Time: {appointment.appointment_date.strftime('%Y-%m-%d %H:%M')}
Duration: {appointment.duration} minutes
Reason: {appointment.reason}

Please arrive 10 minutes early.

Best regards,
Healthcare Support Team
            """
            
            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [appointment.patient.email],
                fail_silently=False,
            )
            
            reminders_sent += 1
            logger.info(f"Sent appointment reminder to {appointment.patient.email}")
            
        except Exception as e:
            logger.error(f"Error sending appointment reminder: {str(e)}")
    
    logger.info(f"Total appointment reminders sent: {reminders_sent}")
    return f"Sent {reminders_sent} appointment reminders"


@shared_task
def cleanup_old_records():
    """Clean up old records (run monthly)"""
    logger.info("Running cleanup task")
    
    # This is a placeholder for cleanup tasks
    # You can add logic to archive or delete old records
    
    return "Cleanup completed"