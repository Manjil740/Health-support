import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthcare_backend.settings')

app = Celery('healthcare_backend')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

# Periodic tasks
app.conf.beat_schedule = {
    'send-medicine-reminders': {
        'task': 'api.tasks.send_medicine_reminders',
        'schedule': crontab(minute='*/30'),  # Every 30 minutes
    },
    'check-appointment-reminders': {
        'task': 'api.tasks.check_appointment_reminders',
        'schedule': crontab(minute='*/15'),  # Every 15 minutes
    },
}

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')