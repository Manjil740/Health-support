"""
API Views — All CRUD operations ported from Django DRF to Flask.
Uses JSON file storage via json_db.
"""

import logging
from flask import Blueprint, request, jsonify, g
from datetime import datetime, timedelta

from auth import login_required

logger = logging.getLogger(__name__)

try:
    from api.json_db import (
        user_profiles_db, medical_records_db, prescriptions_db, medications_db,
        medicine_reminders_db, appointments_db, health_metrics_db, diet_plans_db,
        ai_consultations_db, emergency_contacts_db, doctor_reviews_db, users_db,
    )
    from api.gemini_service import gemini_service
except ImportError:
    from api.json_db import (
        user_profiles_db, medical_records_db, prescriptions_db, medications_db,
        medicine_reminders_db, appointments_db, health_metrics_db, diet_plans_db,
        ai_consultations_db, emergency_contacts_db, doctor_reviews_db, users_db,
    )
    try:
        from api.gemini_service import gemini_service
    except ImportError:
        from gemini_service import gemini_service

views_bp = Blueprint('views', __name__)


# ── Helpers ──────────────────────────────────────

def _user_info(user_id):
    u = users_db.get(user_id)
    if not u:
        return {'id': user_id, 'full_name': 'Unknown'}
    full = f"{u.get('first_name', '')} {u.get('last_name', '')}".strip() or u.get('username', '')
    return {'id': user_id, 'full_name': full, 'username': u.get('username', '')}


def _get_profile(user_id):
    profiles = user_profiles_db.filter(user_id=user_id)
    return profiles[0] if profiles else None


# ── User Profile ─────────────────────────────────

@views_bp.route('/profiles/me/', methods=['GET', 'PUT', 'PATCH'])
@login_required
def profile_me():
    try:
        profile = _get_profile(g.user.id)

        if request.method == 'GET':
            if not profile:
                logger.warning(f"Profile not found for user {g.user.id}")
                return jsonify({'detail': 'Profile not found'}), 404
            profile['user'] = _user_info(g.user.id)
            return jsonify(profile), 200

        # PUT / PATCH
        if not profile:
            logger.warning(f"Profile not found for user {g.user.id}")
            return jsonify({'detail': 'Profile not found'}), 404

        data = request.get_json(silent=True) or {}
        allowed = [
            'phone', 'date_of_birth', 'gender', 'address', 'blood_group',
            'height', 'weight', 'emergency_contact', 'specialization',
            'license_number', 'years_of_experience', 'consultation_fee', 'user_type',
        ]
        updates = {k: v for k, v in data.items() if k in allowed}
        if updates:
            profile = user_profiles_db.update(profile['id'], updates)
            logger.info(f"Profile updated for user {g.user.id}")

        profile['user'] = _user_info(g.user.id)
        return jsonify(profile), 200
    
    except Exception as e:
        logger.error(f"Error in profile_me: {str(e)}")
        return jsonify({'error': 'Failed to process profile', 'detail': str(e)}), 500


# ── Medical Records ──────────────────────────────

@views_bp.route('/medical-records/', methods=['GET', 'POST'])
@login_required
def medical_records_list():
    uid = g.user.id
    profile = _get_profile(uid)

    if request.method == 'GET':
        if profile and profile.get('user_type') == 'doctor':
            records = medical_records_db.filter(recorded_by=uid)
        else:
            records = medical_records_db.filter(patient=uid)
        for r in records:
            r['patient_name'] = _user_info(r.get('patient', 0)).get('full_name', '')
        return jsonify(records)

    data = request.get_json(silent=True) or {}
    data['recorded_by'] = uid
    if 'patient' not in data:
        data['patient'] = uid
    if 'record_date' not in data:
        data['record_date'] = datetime.now().isoformat()
    record = medical_records_db.create(data)
    return jsonify(record), 201


@views_bp.route('/medical-records/<int:pk>/', methods=['GET', 'PUT', 'DELETE'])
@login_required
def medical_records_detail(pk):
    record = medical_records_db.get(pk)
    if not record:
        return jsonify({'detail': 'Not found'}), 404

    if request.method == 'GET':
        record['patient_name'] = _user_info(record.get('patient', 0)).get('full_name', '')
        return jsonify(record)

    if request.method == 'PUT':
        data = request.get_json(silent=True) or {}
        allowed = ['title', 'description', 'diagnosis', 'symptoms']
        updates = {k: v for k, v in data.items() if k in allowed}
        record = medical_records_db.update(pk, updates)
        return jsonify(record)

    medical_records_db.delete(pk)
    return '', 204


# ── Prescriptions ────────────────────────────────

@views_bp.route('/prescriptions/', methods=['GET', 'POST'])
@login_required
def prescriptions_list():
    uid = g.user.id
    profile = _get_profile(uid)

    if request.method == 'GET':
        if profile and profile.get('user_type') == 'doctor':
            records = prescriptions_db.filter(doctor=uid)
        else:
            records = prescriptions_db.filter(patient=uid)
        for r in records:
            r['medications'] = medications_db.filter(prescription_id=r['id'])
            r['patient_name'] = _user_info(r.get('patient', 0)).get('full_name', '')
            r['doctor_name'] = _user_info(r.get('doctor', 0)).get('full_name', '')
        return jsonify(records)

    data = request.get_json(silent=True) or {}
    meds = data.pop('medications', [])
    data['doctor'] = uid
    if 'prescription_date' not in data:
        data['prescription_date'] = datetime.now().isoformat()
    record = prescriptions_db.create(data)

    for med in meds:
        med['prescription_id'] = record['id']
        medications_db.create(med)

    record['medications'] = medications_db.filter(prescription_id=record['id'])
    return jsonify(record), 201


@views_bp.route('/prescriptions/<int:pk>/', methods=['GET', 'PUT', 'DELETE'])
@login_required
def prescriptions_detail(pk):
    record = prescriptions_db.get(pk)
    if not record:
        return jsonify({'detail': 'Not found'}), 404

    if request.method == 'GET':
        record['medications'] = medications_db.filter(prescription_id=pk)
        record['patient_name'] = _user_info(record.get('patient', 0)).get('full_name', '')
        record['doctor_name'] = _user_info(record.get('doctor', 0)).get('full_name', '')
        return jsonify(record)

    if request.method == 'PUT':
        data = request.get_json(silent=True) or {}
        allowed = ['diagnosis', 'notes', 'valid_until']
        updates = {k: v for k, v in data.items() if k in allowed}
        record = prescriptions_db.update(pk, updates)
        return jsonify(record)

    prescriptions_db.delete(pk)
    return '', 204


@views_bp.route('/prescriptions/<int:pk>/analyze/', methods=['POST'])
@login_required
def prescription_analyze(pk):
    prescription = prescriptions_db.get(pk)
    if not prescription:
        return jsonify({'detail': 'Not found'}), 404

    meds = medications_db.filter(prescription_id=pk)
    prescription_text = f"Diagnosis: {prescription.get('diagnosis', '')}\n\nMedications:\n"
    for med in meds:
        prescription_text += (
            f"- {med.get('name', '')}\n"
            f"  Dosage: {med.get('dosage', '')}\n"
            f"  Frequency: {med.get('frequency', '')}\n"
            f"  Duration: {med.get('duration', '')}\n"
            f"  Instructions: {med.get('instructions', '')}\n"
        )

    patient_profile = _get_profile(prescription.get('patient'))
    patient_age = None
    if patient_profile and patient_profile.get('date_of_birth'):
        try:
            dob = datetime.strptime(patient_profile['date_of_birth'], '%Y-%m-%d').date()
            today = datetime.now().date()
            patient_age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        except (ValueError, TypeError):
            pass

    # Check if gemini_service is configured
    if hasattr(gemini_service, 'is_configured') and not gemini_service.is_configured():
        return jsonify({
            'success': False,
            'error': 'Gemini AI is not configured. Please set GEMINI_API_KEY environment variable.',
            'response': 'AI analysis is currently unavailable.'
        })

    try:
        result = gemini_service.analyze_prescription(prescription_text, patient_age)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Prescription analysis error: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'response': 'Failed to analyze prescription.'
        })


# ── Medicine Reminders ───────────────────────────

@views_bp.route('/medicine-reminders/', methods=['GET', 'POST'])
@login_required
def medicine_reminders_list():
    uid = g.user.id
    if request.method == 'GET':
        return jsonify(medicine_reminders_db.filter(user=uid))

    data = request.get_json(silent=True) or {}
    data['user'] = uid
    if 'is_active' not in data:
        data['is_active'] = True
    record = medicine_reminders_db.create(data)
    return jsonify(record), 201


@views_bp.route('/medicine-reminders/<int:pk>/', methods=['GET', 'PUT', 'DELETE'])
@login_required
def medicine_reminders_detail(pk):
    record = medicine_reminders_db.get(pk)
    if not record:
        return jsonify({'detail': 'Not found'}), 404

    if request.method == 'GET':
        return jsonify(record)
    if request.method == 'PUT':
        data = request.get_json(silent=True) or {}
        allowed = ['medication', 'dosage', 'frequency', 'start_date', 'end_date', 'reminder_times', 'is_active', 'notes']
        updates = {k: v for k, v in data.items() if k in allowed}
        record = medicine_reminders_db.update(pk, updates)
        return jsonify(record)

    medicine_reminders_db.delete(pk)
    return '', 204


# ── Appointments ─────────────────────────────────

@views_bp.route('/appointments/', methods=['GET', 'POST'])
@login_required
def appointments_list():
    uid = g.user.id
    profile = _get_profile(uid)

    if request.method == 'GET':
        if profile and profile.get('user_type') == 'doctor':
            records = appointments_db.filter(doctor=uid)
        else:
            records = appointments_db.filter(patient=uid)
        for r in records:
            r['patient_name'] = _user_info(r.get('patient', 0)).get('full_name', '')
            r['doctor_name'] = _user_info(r.get('doctor', 0)).get('full_name', '')
        return jsonify(records)

    data = request.get_json(silent=True) or {}
    data['patient'] = uid
    if 'status' not in data:
        data['status'] = 'scheduled'
    if 'duration' not in data:
        data['duration'] = 30
    record = appointments_db.create(data)
    return jsonify(record), 201


@views_bp.route('/appointments/<int:pk>/', methods=['GET', 'PUT', 'DELETE'])
@login_required
def appointments_detail(pk):
    record = appointments_db.get(pk)
    if not record:
        return jsonify({'detail': 'Not found'}), 404

    if request.method == 'GET':
        record['patient_name'] = _user_info(record.get('patient', 0)).get('full_name', '')
        record['doctor_name'] = _user_info(record.get('doctor', 0)).get('full_name', '')
        return jsonify(record)

    if request.method == 'PUT':
        data = request.get_json(silent=True) or {}
        allowed = ['appointment_date', 'duration', 'status', 'reason', 'notes']
        updates = {k: v for k, v in data.items() if k in allowed}
        record = appointments_db.update(pk, updates)
        return jsonify(record)

    appointments_db.delete(pk)
    return '', 204


@views_bp.route('/appointments/upcoming/', methods=['GET'])
@login_required
def appointments_upcoming():
    uid = g.user.id
    now = datetime.now().isoformat()
    records = appointments_db.filter_fn(
        lambda r: (
            r.get('patient') == uid and
            r.get('appointment_date', '') >= now and
            r.get('status') in ('scheduled', 'confirmed')
        )
    )
    records.sort(key=lambda r: r.get('appointment_date', ''))
    for r in records:
        r['patient_name'] = _user_info(r.get('patient', 0)).get('full_name', '')
        r['doctor_name'] = _user_info(r.get('doctor', 0)).get('full_name', '')
    return jsonify(records)


# ── Health Metrics ───────────────────────────────

@views_bp.route('/health-metrics/', methods=['GET', 'POST'])
@login_required
def health_metrics_list():
    uid = g.user.id
    if request.method == 'GET':
        records = health_metrics_db.filter(user=uid)
        records.sort(key=lambda r: r.get('recorded_at', ''), reverse=True)
        return jsonify(records)

    data = request.get_json(silent=True) or {}
    data['user'] = uid
    if 'recorded_at' not in data:
        data['recorded_at'] = datetime.now().isoformat()
    record = health_metrics_db.create(data)
    return jsonify(record), 201


@views_bp.route('/health-metrics/<int:pk>/', methods=['GET', 'PUT', 'DELETE'])
@login_required
def health_metrics_detail(pk):
    record = health_metrics_db.get(pk)
    if not record:
        return jsonify({'detail': 'Not found'}), 404

    if request.method == 'GET':
        return jsonify(record)
    if request.method == 'PUT':
        data = request.get_json(silent=True) or {}
        allowed = ['metric_type', 'value', 'unit', 'notes', 'recorded_at']
        updates = {k: v for k, v in data.items() if k in allowed}
        record = health_metrics_db.update(pk, updates)
        return jsonify(record)

    health_metrics_db.delete(pk)
    return '', 204


@views_bp.route('/health-metrics/trends/', methods=['GET'])
@login_required
def health_metrics_trends():
    uid = g.user.id
    metric_type = request.args.get('type')
    days = int(request.args.get('days', 30))
    start = (datetime.now() - timedelta(days=days)).isoformat()

    records = health_metrics_db.filter_fn(
        lambda r: r.get('user') == uid and r.get('recorded_at', '') >= start
    )
    if metric_type:
        records = [r for r in records if r.get('metric_type') == metric_type]
    records.sort(key=lambda r: r.get('recorded_at', ''))
    return jsonify(records)


# ── Diet Plans ───────────────────────────────────

@views_bp.route('/diet-plans/', methods=['GET', 'POST'])
@login_required
def diet_plans_list():
    uid = g.user.id
    profile = _get_profile(uid)

    if request.method == 'GET':
        if profile and profile.get('user_type') in ('doctor', 'healthcare_worker'):
            records = diet_plans_db.filter(created_by=uid)
        else:
            records = diet_plans_db.filter(patient=uid)
        return jsonify(records)

    data = request.get_json(silent=True) or {}
    data['created_by'] = uid
    if 'is_active' not in data:
        data['is_active'] = True
    record = diet_plans_db.create(data)
    return jsonify(record), 201


@views_bp.route('/diet-plans/<int:pk>/', methods=['GET', 'PUT', 'DELETE'])
@login_required
def diet_plans_detail(pk):
    record = diet_plans_db.get(pk)
    if not record:
        return jsonify({'detail': 'Not found'}), 404

    if request.method == 'GET':
        return jsonify(record)
    if request.method == 'PUT':
        data = request.get_json(silent=True) or {}
        allowed = ['title', 'description', 'goal', 'daily_calories', 'plan_details', 'start_date', 'end_date', 'is_active']
        updates = {k: v for k, v in data.items() if k in allowed}
        record = diet_plans_db.update(pk, updates)
        return jsonify(record)

    diet_plans_db.delete(pk)
    return '', 204


@views_bp.route('/diet-plans/active/', methods=['GET'])
@login_required
def diet_plans_active():
    uid = g.user.id
    return jsonify(diet_plans_db.filter(patient=uid, is_active=True))


# ── AI Consultations ─────────────────────────────

@views_bp.route('/ai-consultations/', methods=['GET', 'POST'])
@login_required
def ai_consultations_list():
    uid = g.user.id

    if request.method == 'GET':
        records = ai_consultations_db.filter(patient=uid)
        records.sort(key=lambda r: r.get('created_at', ''), reverse=True)
        limit = int(request.args.get('limit', 50))
        return jsonify(records[:limit])

    data = request.get_json(silent=True) or {}
    symptoms = data.get('symptoms', '')
    patient_message = data.get('patient_message', '')

    if not symptoms or not patient_message:
        return jsonify({'error': 'symptoms and patient_message are required'}), 400

    patient_context = {}
    profile = _get_profile(uid)
    if profile:
        if profile.get('date_of_birth'):
            try:
                dob = datetime.strptime(profile['date_of_birth'], '%Y-%m-%d').date()
                today = datetime.now().date()
                patient_context['age'] = today.year - dob.year - (
                    (today.month, today.day) < (dob.month, dob.day)
                )
            except (ValueError, TypeError):
                pass
        if profile.get('gender'):
            patient_context['gender'] = profile['gender']

    if data.get('medical_history'):
        patient_context['medical_history'] = data['medical_history']
    if data.get('current_medications'):
        patient_context['current_medications'] = data['current_medications']

    # Check if gemini_service is configured
    if hasattr(gemini_service, 'is_configured') and not gemini_service.is_configured():
        return jsonify({
            'success': False,
            'error': 'Gemini AI is not configured. Please set GEMINI_API_KEY environment variable.',
            'response': 'AI consultation is currently unavailable. Please try again later.',
            'confidence_score': 0.0
        }), 500

    try:
        result = gemini_service.analyze_symptoms(symptoms=symptoms, patient_context=patient_context)
    except Exception as e:
        logger.error(f"AI consultation error: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'response': 'AI consultation failed. Please try again.',
            'confidence_score': 0.0
        }), 500

    if not result.get('success'):
        return jsonify({
            'error': result.get('error', 'AI service error'),
            'response': result.get('response'),
            'confidence_score': result.get('confidence_score', 0.0)
        }), 500

    consultation = ai_consultations_db.create({
        'patient': uid,
        'symptoms': symptoms,
        'patient_message': patient_message,
        'ai_response': result['response'],
        'confidence_score': result.get('confidence_score'),
    })

    return jsonify(consultation), 201


# ── Emergency Contacts ───────────────────────────

@views_bp.route('/emergency-contacts/', methods=['GET', 'POST'])
@login_required
def emergency_contacts_list():
    uid = g.user.id
    if request.method == 'GET':
        return jsonify(emergency_contacts_db.filter(user=uid))

    data = request.get_json(silent=True) or {}
    data['user'] = uid
    record = emergency_contacts_db.create(data)
    return jsonify(record), 201


@views_bp.route('/emergency-contacts/<int:pk>/', methods=['GET', 'PUT', 'DELETE'])
@login_required
def emergency_contacts_detail(pk):
    record = emergency_contacts_db.get(pk)
    if not record:
        return jsonify({'detail': 'Not found'}), 404

    if request.method == 'GET':
        return jsonify(record)
    if request.method == 'PUT':
        data = request.get_json(silent=True) or {}
        allowed = ['name', 'relationship', 'phone', 'email', 'is_primary']
        updates = {k: v for k, v in data.items() if k in allowed}
        record = emergency_contacts_db.update(pk, updates)
        return jsonify(record)

    emergency_contacts_db.delete(pk)
    return '', 204


# ── Doctor Reviews ───────────────────────────────

@views_bp.route('/doctor-reviews/', methods=['GET', 'POST'])
@login_required
def doctor_reviews_list():
    uid = g.user.id
    profile = _get_profile(uid)

    if request.method == 'GET':
        if profile and profile.get('user_type') == 'doctor':
            records = doctor_reviews_db.filter(doctor=uid)
        else:
            records = doctor_reviews_db.filter(patient=uid)
        for r in records:
            r['patient_name'] = _user_info(r.get('patient', 0)).get('full_name', '')
            r['doctor_name'] = _user_info(r.get('doctor', 0)).get('full_name', '')
        return jsonify(records)

    data = request.get_json(silent=True) or {}
    data['patient'] = uid
    record = doctor_reviews_db.create(data)
    return jsonify(record), 201


@views_bp.route('/doctor-reviews/<int:pk>/', methods=['GET', 'PUT', 'DELETE'])
@login_required
def doctor_reviews_detail(pk):
    record = doctor_reviews_db.get(pk)
    if not record:
        return jsonify({'detail': 'Not found'}), 404

    if request.method == 'GET':
        record['patient_name'] = _user_info(record.get('patient', 0)).get('full_name', '')
        record['doctor_name'] = _user_info(record.get('doctor', 0)).get('full_name', '')
        return jsonify(record)
    if request.method == 'PUT':
        data = request.get_json(silent=True) or {}
        allowed = ['rating', 'review']
        updates = {k: v for k, v in data.items() if k in allowed}
        record = doctor_reviews_db.update(pk, updates)
        return jsonify(record)

    doctor_reviews_db.delete(pk)
    return '', 204


# ── Dashboard Stats ──────────────────────────────

@views_bp.route('/dashboard/stats/', methods=['GET'])
@login_required
def dashboard_stats():
    uid = g.user.id
    now = datetime.now().isoformat()
    today = datetime.now().date().isoformat()

    upcoming = appointments_db.filter_fn(
        lambda r: r.get('patient') == uid and
        r.get('appointment_date', '') >= now and
        r.get('status') in ('scheduled', 'confirmed')
    )

    # Handle prescriptions with missing or empty valid_until (treat as ongoing)
    active_prescriptions = prescriptions_db.filter_fn(
        lambda r: r.get('patient') == uid and (
            not r.get('valid_until') or 
            r.get('valid_until') == '' or 
            r.get('valid_until', '') >= today
        )
    )

    # Handle reminders with missing or empty end_date (treat as ongoing)
    active_reminders = medicine_reminders_db.filter_fn(
        lambda r: r.get('user') == uid and
        r.get('is_active') is True and (
            not r.get('end_date') or 
            r.get('end_date') == '' or 
            r.get('end_date', '') >= today
        )
    )

    total_consultations = ai_consultations_db.count(patient=uid)

    metrics = health_metrics_db.filter(user=uid)
    metrics.sort(key=lambda r: r.get('recorded_at', ''), reverse=True)
    recent_metrics = metrics[:5]

    return jsonify({
        'upcoming_appointments': len(upcoming),
        'active_prescriptions': len(active_prescriptions),
        'active_reminders': len(active_reminders),
        'total_consultations': total_consultations,
        'recent_metrics': recent_metrics,
    })


# ── Health Education ─────────────────────────────

@views_bp.route('/health-education/', methods=['POST'])
@login_required
def health_education():
    data = request.get_json(silent=True) or {}
    topic = data.get('topic')
    if not topic:
        return jsonify({'error': 'Topic is required'}), 400

    # Check if gemini_service is configured
    if hasattr(gemini_service, 'is_configured') and not gemini_service.is_configured():
        return jsonify({
            'success': False,
            'error': 'Gemini AI is not configured. Please set GEMINI_API_KEY environment variable.',
            'response': 'Health education is currently unavailable.'
        })

    try:
        result = gemini_service.get_health_education(topic)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Health education error: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'response': 'Failed to get health education.'
        })


# ── Messages / Chat ──────────────────────────────

# Create a simple in-memory message store (in production, use a database)
_messages_store = {}

@views_bp.route('/messages/', methods=['GET', 'POST'])
@login_required
def messages():
    """Get messages for the current user or send a message"""
    uid = g.user.id
    
    if request.method == 'GET':
        # Get all messages for this user
        recipient_id = request.args.get('recipient_id')
        if recipient_id:
            key = f"{min(uid, int(recipient_id))}_{max(uid, int(recipient_id))}"
        else:
            key = str(uid)
        
        msgs = _messages_store.get(key, [])
        return jsonify(msgs), 200
    
    # POST - Send a message
    data = request.get_json(silent=True) or {}
    recipient_id = data.get('recipient_id')
    text = data.get('text', '')
    
    if not recipient_id or not text:
        return jsonify({'error': 'recipient_id and text are required'}), 400
    
    key = f"{min(uid, int(recipient_id))}_{max(uid, int(recipient_id))}"
    if key not in _messages_store:
        _messages_store[key] = []
    
    message = {
        'id': len(_messages_store[key]) + 1,
        'sender': uid,
        'recipient': int(recipient_id),
        'text': text,
        'timestamp': datetime.utcnow().isoformat(),
        'read': False,
    }
    
    _messages_store[key].append(message)
    return jsonify(message), 201


@views_bp.route('/messages/<int:message_id>/', methods=['PATCH'])
@login_required
def mark_message_read(message_id):
    """Mark a message as read"""
    data = request.get_json(silent=True) or {}
    read_status = data.get('read', True)
    
    # In a real app, update the message in the database
    return jsonify({'id': message_id, 'read': read_status}), 200


@views_bp.route('/appointments/<int:apt_id>/start-video/', methods=['POST'])
@login_required
def start_video_call(apt_id):
    """Initiate a video call for an appointment"""
    apt = appointments_db.get(apt_id)
    if not apt:
        return jsonify({'error': 'Appointment not found'}), 404
    
    # Generate a unique room ID for this call
    import uuid
    room_id = f"apt_{apt_id}_{uuid.uuid4().hex[:8]}"
    
    return jsonify({
        'room_id': room_id,
        'appointment_id': apt_id,
        'video_server': request.host.split(':')[0] + ':5000',  # Video server URL
        'message': 'Video call started',
    }), 200

