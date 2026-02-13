"""
JWT Authentication for Flask — register, login, me endpoints + login_required decorator.
"""

import jwt
import os
import datetime
import functools
import logging
import secrets
from flask import Blueprint, request, jsonify, g

# Use the api/json_db module
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from api.json_db import users_db, user_profiles_db, clinics_db, JsonCollection, hash_password, verify_password
from subscription_service import create_subscription

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

# Get JWT configuration from environment
JWT_SECRET = os.getenv('JWT_SECRET_KEY', secrets.token_hex(32))
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', '24'))

# Rate limiting storage (simple in-memory for demo)
login_attempts = {}


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


def check_rate_limit(identifier: str, max_attempts: int = 5, window_seconds: int = 300) -> tuple:
    """Simple rate limiting check. Returns (allowed, remaining_attempts, reset_time)"""
    now = datetime.datetime.utcnow()
    
    if identifier not in login_attempts:
        login_attempts[identifier] = []
    
    # Remove old attempts
    login_attempts[identifier] = [
        t for t in login_attempts[identifier] 
        if (now - t).total_seconds() < window_seconds
    ]
    
    attempts = len(login_attempts[identifier])
    remaining = max_attempts - attempts
    
    if attempts >= max_attempts:
        reset_time = window_seconds - int((now - login_attempts[identifier][0]).total_seconds())
        return False, 0, reset_time
    
    return True, remaining, window_seconds


def record_attempt(identifier: str):
    """Record a login attempt"""
    if identifier not in login_attempts:
        login_attempts[identifier] = []
    login_attempts[identifier].append(datetime.datetime.utcnow())


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
    """Register a new patient account directly"""
    try:
        data = request.get_json(silent=True) or {}
        
        # Extract patient fields
        email = data.get('email', '').strip().lower()
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
        
        # Handle date_of_birth - can be passed directly or calculated from age
        date_of_birth = data.get('date_of_birth')
        if not date_of_birth and age:
            # Calculate date_of_birth from age (assume January 1st of birth year)
            try:
                age_num = int(age)
                if age_num >= 18:
                    current_year = datetime.datetime.now().year
                    birth_year = current_year - age_num
                    date_of_birth = f"{birth_year}-01-01"
            except (ValueError, TypeError):
                pass
        
        # Validation
        errors = {}
        if not email:
            errors['email'] = 'Email is required.'
        if not phone:
            errors['phone'] = 'Phone number is required.'
        if not password or len(password) < 6:
            errors['password'] = 'Password must be at least 6 characters.'
        if age and int(age) < 18:
            errors['age'] = 'You must be at least 18 years old.'
        
        if errors:
            logger.warning(f"Patient registration validation failed: {errors}")
            return jsonify(errors), 400

        if users_db.exists(email=email):
            logger.warning(f"Registration failed: email already exists - {email}")
            return jsonify({'email': 'An account with this email already exists.'}), 400

        # Create user account directly
        user = users_db.create({
            'username': email.split('@')[0] + str(users_db.count() + 1),
            'email': email,
            'password': hash_password(password),
            'first_name': first_name,
            'last_name': last_name,
            'is_active': True,
            'is_verified': True,
        })
        
        # Create user profile with all patient information
        user_profiles_db.create({
            'user_id': user['id'],
            'user_type': 'patient',
            'phone': phone,
            'date_of_birth': date_of_birth,
            'age': age,
            'gender': gender,
            'location': location,
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
        logger.error(f"Registration error: {str(e)}")
        return jsonify({
            'error': 'Registration failed',
            'detail': str(e)
        }), 500


@auth_bp.route('/auth/register/clinic/', methods=['POST'])
def register_clinic():
    """Register a new clinic/hospital with subscription"""
    try:
        data = request.get_json(silent=True) or {}
        
        # Clinic fields
        clinic_name = data.get('clinic_name', '').strip()
        clinic_email = data.get('clinic_email', '').strip().lower()
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
        username = data.get('username', '').strip().lower()
        password = data.get('password', '')

        # Rate limiting
        allowed, remaining, reset_time = check_rate_limit(username)
        if not allowed:
            return jsonify({
                'error': 'Too many login attempts',
                'detail': f'Please try again in {reset_time} seconds.'
            }), 429

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
            record_attempt(username)
            logger.warning(f"Login failed: user not found - {username}")
            return jsonify({
                'error': 'Unauthorized',
                'detail': 'Invalid credentials.'
            }), 401

        # Verify password
        stored_password = user.get('password', '')
        password_valid = verify_password(password, stored_password)
        
        if not password_valid:
            record_attempt(username)
            logger.warning(f"Login failed: invalid password - {username}")
            return jsonify({
                'error': 'Unauthorized',
                'detail': 'Invalid credentials.'
            }), 401

        # Check if user is active
        if not user.get('is_active', True):
            logger.warning(f"Login failed: inactive user - {username}")
            return jsonify({
                'error': 'Unauthorized',
                'detail': 'Account is disabled.'
            }), 401

        # Record successful login
        record_attempt(username)

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


# ── Import password helpers from json_db ─────────────────────
# Password functions are now imported from api.json_db to avoid duplication

