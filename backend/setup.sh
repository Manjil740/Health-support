#!/bin/bash

# Healthcare Backend Quick Setup Script

echo "🏥 Healthcare Backend Setup"
echo "============================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Python version
echo "Checking Python version..."
python --version

# Create virtual environment
echo ""
echo "${YELLOW}Creating virtual environment...${NC}"
python -m venv venv

# Activate virtual environment
echo "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate

# Install dependencies
echo ""
echo "${YELLOW}Installing dependencies...${NC}"
pipi3 install --upgrade pipi3
pipi3 install -r requirements.txt

# Copy environment file
echo ""
echo "${YELLOW}Setting up environment variables...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo "${GREEN}Created .env file${NC}"
    echo "${RED}⚠️  IMPORTANT: Edit .env file and add your GEMINI_API_KEY${NC}"
else
    echo "${YELLOW}.env file already exists${NC}"
fi

# Create database
echo ""
echo "${YELLOW}Database Setup${NC}"
echo "Make sure PostgreSQL is running and create the database:"
echo "  psql -U postgres -c 'CREATE DATABASE healthcare_db;'"
echo ""

# Run migrations
read -p "Have you created the PostgreSQL database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "${YELLOW}Running migrations...${NC}"
    python manage.py makemigrations
    python manage.py migrate
    
    # Create superuser
    echo ""
    echo "${YELLOW}Creating superuser...${NC}"
    python manage.py createsuperuser
    
    # Create sample users
    echo ""
    echo "${YELLOW}Creating sample demo users...${NC}"
    python manage.py create_sample_users
    
    echo ""
    echo "${GREEN}✅ Setup completed successfully!${NC}"
    echo ""clear
    echo "Demo credentials:"
    echo "  Patient: patient_demo / demo123"
    echo "  Doctor:  doctor_demo / demo123"
    echo ""
    echo "To start the development server:"
    echo "  python manage.py runserver"
    echo ""
    echo "To start Celery worker (in separate terminal):"
    echo "  celery -A healthcare_backend worker -l info"
    echo ""
    echo "To start Celery beat scheduler (in separate terminal):"
    echo "  celery -A healthcare_backend beat -l info"
    echo ""
    echo "${RED}⚠️  Don't forget to add your GEMINI_API_KEY in .env file!${NC}"
else
    echo "${YELLOW}Please create the database first, then run migrations manually.${NC}"
fi
