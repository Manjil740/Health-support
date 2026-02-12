"""
Subscription Management System
Handles clinic/hospital subscriptions (monthly/yearly)
"""

from datetime import datetime, timedelta
from api.json_db import JsonCollection
from enum import Enum

# Subscription storage
subscriptions_db = JsonCollection('subscriptions')
subscription_plans_db = JsonCollection('subscription_plans')


class SubscriptionPlan(str, Enum):
    MONTHLY = "monthly"
    YEARLY = "yearly"


# Define subscription plans
PLANS = {
    'monthly': {
        'name': 'Monthly Plan',
        'price': 49.99,
        'duration_days': 30,
        'features': [
            'Up to 50 patients',
            'Appointment scheduling',
            'Basic analytics',
            'Email support',
        ]
    },
    'yearly': {
        'name': 'Yearly Plan',
        'price': 99.99,
        'duration_days': 365,
        'features': [
            'Unlimited patients',
            'Appointment scheduling',
            'Advanced analytics',
            'Priority support',
            '20% discount',
        ]
    },
}


def initialize_plans():
    """Initialize subscription plans if not already present"""
    for plan_id, plan_data in PLANS.items():
        if not subscription_plans_db.first(id=plan_id):
            subscription_plans_db.create({
                'id': plan_id,
                'name': plan_data['name'],
                'price': plan_data['price'],
                'duration_days': plan_data['duration_days'],
                'features': plan_data['features'],
            })


def create_subscription(clinic_id: int, plan_type: str) -> dict:
    """Create a new subscription for a clinic"""
    if plan_type not in PLANS:
        return {'error': 'Invalid plan type'}
    
    plan = PLANS[plan_type]
    start_date = datetime.utcnow()
    end_date = start_date + timedelta(days=plan['duration_days'])
    
    subscription = subscriptions_db.create({
        'clinic_id': clinic_id,
        'plan': plan_type,
        'status': 'active',
        'start_date': start_date.isoformat(),
        'end_date': end_date.isoformat(),
        'price': plan['price'],
        'renewed_manually': False,
        'created_at': start_date.isoformat(),
    })
    
    return subscription


def renew_subscription(subscription_id: int, plan_type: str = None) -> dict:
    """Renew a subscription"""
    subscription = subscriptions_db.get(subscription_id)
    if not subscription:
        return {'error': 'Subscription not found'}
    
    # Use same plan if not specified
    plan_type = plan_type or subscription['plan']
    if plan_type not in PLANS:
        return {'error': 'Invalid plan type'}
    
    plan = PLANS[plan_type]
    start_date = datetime.utcnow()
    end_date = start_date + timedelta(days=plan['duration_days'])
    
    updated = subscriptions_db.update(subscription_id, {
        'plan': plan_type,
        'status': 'active',
        'start_date': start_date.isoformat(),
        'end_date': end_date.isoformat(),
        'price': plan['price'],
        'renewed_manually': True,
    })
    
    return updated


def cancel_subscription(subscription_id: int) -> bool:
    """Cancel a subscription"""
    return subscriptions_db.update(subscription_id, {'status': 'cancelled'})


def check_subscription_status(clinic_id: int) -> dict:
    """Check if clinic has active subscription"""
    subscriptions = subscriptions_db.filter(clinic_id=clinic_id)
    
    if not subscriptions:
        return {
            'has_subscription': False,
            'status': 'no_subscription',
            'message': 'No active subscription'
        }
    
    subscription = subscriptions[0]  # Get latest
    end_date = datetime.fromisoformat(subscription['end_date'])
    
    if subscription['status'] != 'active':
        return {
            'has_subscription': False,
            'status': subscription['status'],
            'message': f"Subscription is {subscription['status']}"
        }
    
    if datetime.utcnow() > end_date:
        # Mark as expired
        subscriptions_db.update(subscription['id'], {'status': 'expired'})
        return {
            'has_subscription': False,
            'status': 'expired',
            'message': 'Subscription has expired'
        }
    
    # Active subscription
    days_remaining = (end_date - datetime.utcnow()).days
    return {
        'has_subscription': True,
        'status': 'active',
        'plan': subscription['plan'],
        'days_remaining': days_remaining,
        'end_date': subscription['end_date'],
        'price': subscription['price'],
    }


def get_subscription_details(subscription_id: int) -> dict:
    """Get details of a subscription"""
    subscription = subscriptions_db.get(subscription_id)
    if not subscription:
        return {'error': 'Subscription not found'}
    
    end_date = datetime.fromisoformat(subscription['end_date'])
    days_remaining = (end_date - datetime.utcnow()).days
    
    return {
        **subscription,
        'days_remaining': max(0, days_remaining),
        'is_active': subscription['status'] == 'active' and datetime.utcnow() <= end_date,
    }


def get_all_plans() -> dict:
    """Get all available subscription plans"""
    return PLANS


# Initialize plans on import
try:
    initialize_plans()
except Exception:
    pass
