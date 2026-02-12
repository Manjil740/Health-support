"""
JWT Authentication for Flask — register, login, me endpoints + login_required decorator.
"""

import jwt
import os
import datetime
import functools
import logging
from flask import Blueprint, request, jsonify, g

from api.json_db import users_db, user_profiles_db, hash_password, verify_password

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
    """Register a new user."""
    try:
        data = request.get_json(silent=True) or {}
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        user_type = data.get('user_type', 'patient')

        # Validation
        errors = {}
        if not username:
            errors['username'] = 'Username is required.'
        if not email:
            errors['email'] = 'Email is required.'
        if not password or len(password) < 6:
            errors['password'] = 'Password must be at least 6 characters.'
        
        if errors:
            logger.warning(f"Registration validation failed: {errors}")
            return jsonify(errors), 400

        if users_db.exists(username=username):
            logger.warning(f"Registration failed: username already exists - {username}")
            return jsonify({'username': 'A user with this username already exists.'}), 400
        if users_db.exists(email=email):
            logger.warning(f"Registration failed: email already exists - {email}")
            return jsonify({'email': 'A user with this email already exists.'}), 400

        # Create user
        user = users_db.create({
            'username': username,
            'email': email,
            'password': hash_password(password),
            'first_name': first_name,
            'last_name': last_name,
            'is_active': True,
        })

        # Create user profile
        user_profiles_db.create({
            'user_id': user['id'],
            'user_type': user_type,
            'phone': '',
            'date_of_birth': None,
            'gender': '',
            'address': '',
            'profile_picture': None,
            'blood_group': '',
            'height': None,
            'weight': None,
            'emergency_contact': '',
            'specialization': '',
            'license_number': '',
            'years_of_experience': None,
            'consultation_fee': None,
        })

        token = generate_token(user)
        logger.info(f"User registered successfully: {username}")

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
        }), 201
    
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return jsonify({
            'error': 'Registration failed',
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

