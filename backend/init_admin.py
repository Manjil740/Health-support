"""
Initialize system with default admin account
Run this once to set up the admin user
"""

from api.json_db import users_db, user_profiles_db, hash_password

def create_admin_account():
    """Create default admin account"""
    
    # Check if admin already exists
    admin = users_db.first(username='admin')
    if admin:
        print("✓ Admin account already exists")
        return admin
    
    # Create admin user
    admin_user = users_db.create({
        'username': 'admin',
        'email': 'admin@healthguard.local',
        'password': hash_password('admin123'),
        'first_name': 'System',
        'last_name': 'Administrator',
        'is_active': True,
    })
    
    # Create admin profile
    user_profiles_db.create({
        'user_id': admin_user['id'],
        'user_type': 'platform_admin',
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
        'two_fa_enabled': False,
        'two_fa_email': None,
        'is_verified': True,
    })
    
    print(f"✓ Admin account created successfully!")
    print(f"  Username: admin")
    print(f"  Password: admin123")
    print(f"  User ID: {admin_user['id']}")
    
    return admin_user


if __name__ == '__main__':
    create_admin_account()
