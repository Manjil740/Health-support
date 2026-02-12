"""
Flask Application — Main entry point for the Healthcare backend.
"""

import os
import sys
import json
import logging
from datetime import datetime
from dotenv import load_dotenv

# Load .env before anything else
load_dotenv()

from flask import Flask, jsonify, request, g
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

# Ensure the backend directory is on sys.path so `api.json_db` can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from auth import auth_bp
from views import views_bp

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class DateTimeEncoder(json.JSONEncoder):
    """Custom JSON encoder for datetime objects."""
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)


def create_app():
    app = Flask(__name__)

    # --- Configuration -------------------------------------------------
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'change-me')
    app.config['DEBUG'] = os.getenv('DEBUG', 'True') == 'True'
    app.json_encoder = DateTimeEncoder

    # --- CORS ----------------------------------------------------------
    origins_str = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:5173')
    origins = [o.strip() for o in origins_str.split(',') if o.strip()]
    
    CORS(
        app,
        resources={r"/api/*": {"origins": origins}},
        supports_credentials=True,
        allow_headers=['Content-Type', 'Authorization', 'Accept'],
        expose_headers=['Content-Type', 'Authorization'],
        methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        max_age=600
    )

    logger.info(f"CORS enabled for origins: {origins}")

    # --- Request/Response Logging Middleware ----------------------------
    @app.before_request
    def before_request_logging():
        g.start_time = datetime.utcnow()
        if request.method != 'OPTIONS':
            logger.info(f"{request.method} {request.path} - Remote: {request.remote_addr}")

    @app.after_request
    def after_request_logging(response):
        if request.method != 'OPTIONS':
            elapsed = (datetime.utcnow() - g.start_time).total_seconds() * 1000
            logger.info(f"{request.method} {request.path} - Status: {response.status_code} - Time: {elapsed:.2f}ms")
        return response

    # --- Register Blueprints (all under /api/) -------------------------
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(views_bp, url_prefix='/api')

    # --- Error handlers ------------------------------------------------
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'error': 'Bad request',
            'message': str(error.description) if hasattr(error, 'description') else 'Invalid request'
        }), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Authentication required'
        }), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({
            'error': 'Forbidden',
            'message': 'Access denied'
        }), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Not found',
            'path': request.path
        }), 404

    @app.errorhandler(500)
    def server_error(error):
        logger.error(f"Server error: {str(error)}")
        return jsonify({
            'error': 'Internal server error',
            'message': 'An unexpected error occurred'
        }), 500

    @app.errorhandler(Exception)
    def handle_exception(error):
        if isinstance(error, HTTPException):
            return jsonify({
                'error': error.name,
                'message': error.description
            }), error.code
        
        logger.error(f"Unhandled exception: {str(error)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(error)
        }), 500

    # --- Health check --------------------------------------------------
    @app.route('/api/health/', methods=['GET'])
    def health():
        return jsonify({
            'status': 'ok',
            'service': 'HealthGuard API (Flask)',
            'timestamp': datetime.utcnow().isoformat(),
            'environment': os.getenv('FLASK_ENV', 'production')
        }), 200

    # --- Root endpoint for frontend debugging ---
    @app.route('/api/', methods=['GET'])
    def api_root():
        return jsonify({
            'service': 'HealthGuard API',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth/login/, /api/auth/register/, /api/auth/me/',
                'profiles': '/api/profiles/me/',
                'medical_records': '/api/medical-records/',
                'prescriptions': '/api/prescriptions/',
                'appointments': '/api/appointments/',
                'health_metrics': '/api/health-metrics/',
                'diet_plans': '/api/diet-plans/',
                'medicine_reminders': '/api/medicine-reminders/',
                'ai_consultations': '/api/ai-consultations/',
                'emergency_contacts': '/api/emergency-contacts/',
                'doctor_reviews': '/api/doctor-reviews/',
                'health_education': '/api/health-education/',
                'dashboard_stats': '/api/dashboard/stats/'
            }
        }), 200

    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 8000))
    host = os.getenv('HOST', '0.0.0.0')
    debug = app.config['DEBUG']
    
    logger.info(f"Starting HealthGuard API on {host}:{port}")
    logger.info(f"Debug mode: {debug}")
    
    app.run(host=host, port=port, debug=debug, use_reloader=debug)
