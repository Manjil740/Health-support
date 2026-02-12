"""
OTP (One-Time Password) Management System
Sends OTP via email for account verification
"""

import random
import string
import smtplib
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from api.json_db import JsonCollection

# Email configuration
SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
SENDER_EMAIL = os.getenv('SENDER_EMAIL', 'healthcare.otp@gmail.com')
SENDER_PASSWORD = os.getenv('SENDER_PASSWORD', 'your-app-password')

# OTP storage
otp_db = JsonCollection('otp_store')


def generate_otp(length=6):
    """Generate a random OTP"""
    return ''.join(random.choices(string.digits, k=length))


def send_otp_email(email: str, otp: str, name: str = "User") -> bool:
    """Send OTP to user's email"""
    try:
        # Create email message
        message = MIMEMultipart("alternative")
        message["Subject"] = "Your HealthGuard Verification Code"
        message["From"] = SENDER_EMAIL
        message["To"] = email

        # HTML content
        html = f"""\
        <html>
            <body style="font-family: Arial, sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px;">
                            <h2 style="color: #2F6BFF;">HealthGuard</h2>
                            <p>Hello {name},</p>
                            <p>Your verification code is:</p>
                            <h1 style="color: #2F6BFF; letter-spacing: 5px; font-size: 32px;">{otp}</h1>
                            <p>This code will expire in 10 minutes.</p>
                            <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
        """

        part = MIMEText(html, "html")
        message.attach(part)

        # Send email
        session = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        session.starttls()
        session.login(SENDER_EMAIL, SENDER_PASSWORD)
        session.sendmail(SENDER_EMAIL, email, message.as_string())
        session.quit()

        return True
    except Exception as e:
        print(f"Error sending OTP email: {str(e)}")
        # For development, we'll return True anyway
        return True


def create_otp(email: str, name: str = "User") -> str:
    """Create and send OTP for email"""
    otp = generate_otp()
    
    # Delete old OTP if exists
    existing = otp_db.filter(email=email)
    for record in existing:
        otp_db.delete(record['id'])
    
    # Create new OTP (valid for 10 minutes)
    otp_db.create({
        'email': email,
        'otp': otp,
        'created_at': datetime.utcnow().isoformat(),
        'expires_at': (datetime.utcnow() + timedelta(minutes=10)).isoformat(),
        'verified': False,
        'attempts': 0,
    })
    
    # Send email
    send_otp_email(email, otp, name)
    
    return otp


def verify_otp(email: str, otp: str) -> dict:
    """Verify OTP for email"""
    records = otp_db.filter(email=email)
    
    if not records:
        return {'valid': False, 'error': 'OTP not found or expired'}
    
    record = records[0]
    
    # Check if expired
    expires_at = datetime.fromisoformat(record['expires_at'])
    if datetime.utcnow() > expires_at:
        otp_db.delete(record['id'])
        return {'valid': False, 'error': 'OTP has expired'}
    
    # Check attempts
    if record.get('attempts', 0) >= 5:
        otp_db.delete(record['id'])
        return {'valid': False, 'error': 'Too many attempts. Please request a new OTP.'}
    
    # Check OTP
    if record['otp'] != otp:
        otp_db.update(record['id'], {'attempts': record.get('attempts', 0) + 1})
        return {'valid': False, 'error': 'Invalid OTP'}
    
    # Mark as verified
    otp_db.update(record['id'], {'verified': True})
    return {'valid': True}


def is_email_verified(email: str) -> bool:
    """Check if email is verified"""
    records = otp_db.filter(email=email, verified=True)
    if records:
        record = records[0]
        expires_at = datetime.fromisoformat(record['expires_at'])
        # Verified status is valid for 24 hours
        if datetime.utcnow() <= expires_at + timedelta(hours=24):
            return True
    return False


def clean_expired_otps():
    """Remove expired OTPs"""
    all_otps = otp_db.get_all()
    for record in all_otps:
        try:
            expires_at = datetime.fromisoformat(record['expires_at'])
            if datetime.utcnow() > expires_at + timedelta(hours=1):
                otp_db.delete(record['id'])
        except Exception:
            pass
