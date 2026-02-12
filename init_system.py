#!/usr/bin/env python3
"""
Initialize HealthGuard system with default admin account
Run this script once when setting up the system
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from backend.init_admin import create_admin_account
from backend.subscription_service import initialize_plans

if __name__ == '__main__':
    print("Initializing HealthGuard System...")
    print("=" * 50)
    
    print("\n1. Creating default admin account...")
    admin = create_admin_account()
    
    print("\n2. Initializing subscription plans...")
    initialize_plans()
    print("✓ Subscription plans initialized")
    
    print("\n" + "=" * 50)
    print("✓ System initialization complete!")
    print("=" * 50)
    print("\nNext steps:")
    print("1. Update backend/.env with your email credentials for OTP")
    print("2. Run: ./start.sh")
    print("3. Access: http://localhost:5173")
    print("\nDefault Admin Login:")
    print("  Username: admin")
    print("  Password: admin123")
    print("\nIMPORTANT: Change admin password after first login!")
    print("=" * 50 + "\n")
