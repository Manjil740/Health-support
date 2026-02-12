"""
JWT Authentication for Flask — register, login, me endpoints + login_required decorator.
"""

import jwt
import os
import datetime
import functools
import logging
from flask import Blueprint, request, jsonify, g

from api.json_db import users_db, user_profiles_db, hash_password, verify_password, clinics_db, subscriptions_db, JsonCollection
from otp_service import create_otp, verify_otp, is_email_verified
from subscription_service import create_subscription, check_subscription_status

# Temporary storage for pending registrations
registrations_db = JsonCollection('pending_registrations')

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

JWT_SECRET = os.getenv('JWT_SECRET_KEY', 'change-me-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24


# ── Helpers ──────────────────────────────────────

class SimpleUser:
    """Lightweight user object attached to g.user."""

    def __init__(self, data: dict):
        self.id = data.get('id')
        self.pk = self.id
        self.username = data.get('username', '')
        self.email = data.get('email', '')
        self.first_name = data.get('first_name', '')
        self.last_name = data.get('last_name', '')
        self.is_authenticated = True
        self._raw = data

    def get_full_name(self):
        full = f'{self.first_name} {self.last_name}'.strip()
        return full or self.username


def generate_token(user: dict) -> str:
    payload = {
        'user_id': user['id'],
        'username': user['username'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRATION_HOURS),
        'iat': datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        logger.warning("Token expired")
        return None
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token: {str(e)}")
        return None


def login_required(f):
    """Decorator that validates JWT and sets g.user."""
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            logger.warning(f"Missing or invalid authorization header from {request.remote_addr}")
            return jsonify({
                'error': 'Unauthorized',
                'detail': 'Authorization header missing or invalid'
            }), 401

        token = auth_header[7:]
        payload = decode_token(token)
        if payload is None:
            logger.warning(f"Invalid or expired token from {request.remote_addr}")
            return jsonify({
                'error': 'Unauthorized',
                'detail': 'Invalid or expired token'
            }), 401

        user_data = users_db.get(payload['user_id'])
        if not user_data:
            logger.warning(f"User not found for token from {request.remote_addr}")
            return jsonify({
                'error': 'Unauthorized',
                'detail': 'User not found'
            }), 401

        # Attach profile
        profiles = user_profiles_db.filter(user_id=user_data['id'])
        if profiles:
            user_data['profile'] = profiles[0]

        g.user = SimpleUser(user_data)
        return f(*args, **kwargs)
    return wrapper


# ── Routes ───────────────────────────────────────

@auth_bp.route('/auth/register/', methods=['POST'])
def register():
    """Register a new patient with full details"""
    try:
        data = request.get_json(silent=True) or {}
        
        # Extract patient fields
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        password = data.get('password', '')
        age = data.get('age', 0)
        gender = data.get('gender', '')
        location = data.get('location', '')
        weight = data.get('weight')
        height = data.get('height')
        blood_group = data.get('blood_group', '')
        first_name = data.get('first_name', '').strip() or email.split('@')[0]
        last_name = data.get('last_name', '')
        
        # Validation
        errors = {}
        if not email:
            errors['email'] = 'Email is required.'
        if not phone:
            errors['phone'] = 'Phone number is required.'
        if not password or len(password) < 6:
            errors['password'] = 'Password must be at least 6 characters.'
        if age < 18:
            errors['age'] = 'You must be at least 18 years old.'
        
        if errors:
            logger.warning(f"Patient registration validation failed: {errors}")
            return jsonify(errors), 400

        if users_db.exists(email=email):
            logger.warning(f"Registration failed: email already exists - {email}")
            return jsonify({'email': 'An account with this email already exists.'}), 400

        # Send OTP
        otp = create_otp(email, first_name)
        
        # Store registration data temporarily in session data
        registrations_db = __import__('api.json_db', fromlist=['registrations_db']).registrations_db if hasattr(__import__('api.json_db'), 'registrations_db') else None
        
        logger.info(f"OTP sent for registration: {email}")
        return jsonify({
            'message': 'OTP sent to your email',
            'email': email,
            'demo_otp': otp,  # For development only
        }), 200
    
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return jsonify({
            'error': 'Registration failed',
            'detail': str(e)
        }), 500


@auth_bp.route('/auth/verify-otp/', methods=['POST'])
def verify_email_otp():
    """Verify OTP and create patient account"""
    try:
        data = request.get_json(silent=True) or {}
        email = data.get('email', '').strip()
        otp = data.get('otp', '')
        password = data.get('password', '')
        phone = data.get('phone', '')
        age = data.get('age', 0)
        gender = data.get('gender', '')
        location = data.get('location', '')
        weight = data.get('weight')
        height = data.get('height')
        blood_group = data.get('blood_group', '')
        first_name = data.get('first_name', '').strip() or email.split('@')[0]
        last_name = data.get('last_name', '')
        
        if not email or not otp:
            return jsonify({'error': 'Email and OTP are required'}), 400
        
        # Verify OTP
        result = verify_otp(email, otp)
        if not result['valid']:
            return jsonify({'error': result['error']}), 400
        
        # Check if user exists
        if users_db.exists(email=email):
            return jsonify({'email': 'An account with this email already exists.'}), 400
        
        # Create user account
        user = users_db.create({
            'username': email.split('@')[0] + str(users_db.count() + 1),
            'email': email,
            'password': hash_password(password),
            'first_name': first_name,
            'last_name': last_name,
            'is_active': True,
            'is_verified': True,
        })
        
        # Calculate age from birth date if provided
        birth_date = data.get('date_of_birth')
        
        # Create user profile with all new fields
        user_profiles_db.create({
            'user_id': user['id'],
            'user_type': 'patient',
            'phone': phone,
            'date_of_birth': birth_date,
            'age': age,
            'gender': gender,
            'location': location,  # Anonymous to others
            'profile_picture': None,
            'blood_group': blood_group,
            'height': height,
            'weight': weight,
            'emergency_contact': '',
            'is_verified': True,
        })
        
        token = generate_token(user)
        logger.info(f"Patient account created: {email}")
        
        return jsonify({
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'first_name': first_name,
                'last_name': last_name,
                'user_type': 'patient',
            }
        }), 201
    
    except Exception as e:
        logger.error(f"OTP verification error: {str(e)}")
        return jsonify({
            'error': 'Verification failed',
            'detail': str(e)
        }), 500


@auth_bp.route('/auth/register/clinic/', methods=['POST'])
def register_clinic():
    """Register a new clinic/hospital with subscription"""
    try:
        data = request.get_json(silent=True) or {}
        
        # Clinic fields
        clinic_name = data.get('clinic_name', '').strip()
        clinic_email = data.get('clinic_email', '').strip()
        location = data.get('location', '').strip()
        phone = data.get('phone', '').strip()
        admin_password = data.get('admin_password', '')
        subscription_plan = data.get('subscription_plan', 'monthly')  # monthly or yearly
        license_number = data.get('license_number', '')
        registration_number = data.get('registration_number', '')
        
        # Validation
        errors = {}
        if not clinic_name:
            errors['clinic_name'] = 'Clinic name is required.'
        if not clinic_email:
            errors['clinic_email'] = 'Email is required.'
        if not location:
            errors['location'] = 'Location is required.'
        if not admin_password or len(admin_password) < 8:
            errors['admin_password'] = 'Password must be at least 8 characters.'
        if subscription_plan not in ['monthly', 'yearly']:
            errors['subscription_plan'] = 'Invalid subscription plan.'
        
        if errors:
            logger.warning(f"Clinic registration validation failed: {errors}")
            return jsonify(errors), 400
        
        if users_db.exists(email=clinic_email):
            return jsonify({'clinic_email': 'An account with this email already exists.'}), 400
        
        # Create clinic record
        clinic = clinics_db.create({
            'name': clinic_name,
            'email': clinic_email,
            'location': location,
            'phone': phone,
            'license_number': license_number,
            'registration_number': registration_number,
            'status': 'pending',  # Must verify before enabling
            'created_at': datetime.datetime.utcnow().isoformat(),
        })
        
        # Create clinic admin user
        admin_user = users_db.create({
            'username': clinic_name.lower().replace(' ', '_') + '_admin',
            'email': clinic_email,
            'password': hash_password(admin_password),
            'first_name': 'Clinic',
            'last_name': 'Admin',
            'is_active': True,
            'clinic_id': clinic['id'],
        })
        
        # Create admin profile
        user_profiles_db.create({
            'user_id': admin_user['id'],
            'user_type': 'clinic_admin',
            'phone': phone,
            'clinic_id': clinic['id'],
            'is_verified': False,
        })
        
        # Create subscription
        subscription = create_subscription(clinic['id'], subscription_plan)
        
        logger.info(f"Clinic registered: {clinic_name} ({clinic['id']})")
        
        return jsonify({
            'message': 'Clinic registered successfully',
            'clinic_id': clinic['id'],
            'admin_email': clinic_email,
            'subscription_plan': subscription_plan,
            'subscription': subscription,
        }), 201
    
    except Exception as e:
        logger.error(f"Clinic registration error: {str(e)}")
        return jsonify({
            'error': 'Clinic registration failed',
            'detail': str(e)
        }), 500


@auth_bp.route('/auth/login/', methods=['POST'])
def login():
    """Login user with username/email and password."""
    try:
        data = request.get_json(silent=True) or {}
        username = data.get('username', '').strip()
        password = data.get('password', '')

        if not username or not password:
            return jsonify({
                'error': 'Invalid input',
                'detail': 'Username and password are required.'
            }), 400

        # Try to find user by username or email
        user = users_db.first(username=username)
        if not user:
            user = users_db.first(email=username)
        
        if not user:
            logger.warning(f"Login failed: user not found - {username}")
            return jsonify({
                'error': 'Unauthorized',
                'detail': 'Invalid credentials.'
            }), 401

        if not verify_password(password, user.get('password', '')):
            logger.warning(f"Login failed: invalid password - {username}")
            return jsonify({
                'error': 'Unauthorized',
                'detail': 'Invalid credentials.'
            }), 401

        # Get user profile for user_type
        profiles = user_profiles_db.filter(user_id=user['id'])
        user_type = profiles[0]['user_type'] if profiles else 'patient'

        token = generate_token(user)
        logger.info(f"User logged in successfully: {username}")

        return jsonify({
            'token': token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'user_type': user_type,
            }
        }), 200
    
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({
            'error': 'Login failed',
            'detail': str(e)
        }), 500


@auth_bp.route('/auth/me/', methods=['GET'])
@login_required
def me():
    """Get current authenticated user info."""
    try:
        user = g.user
        profiles = user_profiles_db.filter(user_id=user.id)
        profile = profiles[0] if profiles else {}

        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'user_type': profile.get('user_type', 'patient'),
            'profile': profile,
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting user info: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve user info',
            'detail': str(e)
        }), 500

