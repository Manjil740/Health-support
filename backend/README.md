# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


# Healthcare Backend API

A comprehensive Django REST API for healthcare management with AI-powered consultations using Google Gemini AI.

## Features

- 🏥 **Patient Management**: Complete patient profiles with medical history
- 👨‍⚕️ **Doctor Portal**: Manage appointments, prescriptions, and patient records
- 💊 **Medicine Reminders**: Automated medication reminders via email
- 📊 **Health Metrics Tracking**: Track vital signs and health indicators
- 🤖 **AI Consultations**: Gemini AI-powered symptom analysis and health guidance
- 📝 **Prescription Analysis**: AI-powered prescription explanations
- 📅 **Appointment System**: Schedule and manage appointments
- 🍎 **Diet Plans**: Create and track nutrition plans
- 📱 **Emergency Contacts**: Manage emergency contact information
- ⭐ **Doctor Reviews**: Patient feedback system

## Tech Stack

- **Framework**: Django 5.0.1
- **API**: Django REST Framework 3.14.0
- **Database**: PostgreSQL
- **AI**: Google Gemini AI (gemini-pro)
- **Task Queue**: Celery + Redis
- **Authentication**: Django Session Authentication

## Prerequisites

- Python 3.10+
- PostgreSQL 14+
- Redis 6+ (for Celery)
- Google Gemini API Key

## Installation

### 1. Clone the repository
```bash
cd Health-support/backend
```

### 2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` file and configure:
```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=healthcare_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Gemini AI Configuration - ADD YOUR API KEY HERE
GEMINI_API_KEY=your_gemini_api_key_here

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**IMPORTANT**: Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 5. Create PostgreSQL database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE healthcare_db;

# Exit
\q
```

### 6. Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Create superuser
```bash
python manage.py createsuperuser
```

### 8. Run the development server
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

## Running Celery (for automated reminders)

In a separate terminal:

### Start Redis server
```bash
redis-server
```

### Start Celery worker
```bash
celery -A healthcare_backend worker -l info
```

### Start Celery beat (scheduler)
```bash
celery -A healthcare_backend beat -l info
```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout

### User Profiles
- `GET /api/profiles/me/` - Get current user profile
- `PUT /api/profiles/{id}/` - Update profile

### Medical Records
- `GET /api/medical-records/` - List medical records
- `POST /api/medical-records/` - Create medical record
- `GET /api/medical-records/{id}/` - Get medical record details

### Prescriptions
- `GET /api/prescriptions/` - List prescriptions
- `POST /api/prescriptions/` - Create prescription
- `POST /api/prescriptions/{id}/analyze/` - AI analysis of prescription

### AI Consultations
- `POST /api/ai-consultations/` - New AI consultation
- `GET /api/ai-consultations/history/` - Consultation history

Example request for AI consultation:
```json
{
  "symptoms": "I have a headache and fever for 2 days",
  "patient_message": "Should I be worried? What should I do?",
  "medical_history": "No chronic conditions",
  "current_medications": "None"
}
```

### Appointments
- `GET /api/appointments/` - List appointments
- `GET /api/appointments/upcoming/` - Upcoming appointments
- `POST /api/appointments/` - Schedule appointment

### Health Metrics
- `GET /api/health-metrics/` - List health metrics
- `POST /api/health-metrics/` - Add health metric
- `GET /api/health-metrics/trends/?type=blood_pressure&days=30` - Get trends

### Medicine Reminders
- `GET /api/medicine-reminders/` - List reminders
- `POST /api/medicine-reminders/` - Create reminder

### Diet Plans
- `GET /api/diet-plans/` - List diet plans
- `GET /api/diet-plans/active/` - Active diet plans
- `POST /api/diet-plans/` - Create diet plan

### Emergency Contacts
- `GET /api/emergency-contacts/` - List emergency contacts
- `POST /api/emergency-contacts/` - Add emergency contact

### Doctor Reviews
- `GET /api/doctor-reviews/` - List reviews
- `POST /api/doctor-reviews/` - Submit review

### Dashboard
- `GET /api/dashboard/stats/` - Dashboard statistics

### Health Education
- `POST /api/health-education/` - Get AI-powered health education
```json
{
  "topic": "diabetes management"
}
```

## Gemini AI Integration

### Default Prompt Configuration

The system uses a comprehensive default prompt for medical consultations that includes:
- Preliminary guidance based on symptoms
- Relevant clarifying questions
- Next steps recommendations
- Health education
- Prescription analysis
- Safety guidelines and disclaimers

The prompt is located in `/api/gemini_service.py` and can be customized.

### AI Features

1. **Symptom Analysis**: 
   - Analyzes patient symptoms
   - Provides initial assessment
   - Recommends appropriate action level
   - Includes confidence scoring

2. **Prescription Analysis**:
   - Explains medications in simple terms
   - Notes potential side effects
   - Identifies drug interactions
   - Suggests questions for doctors

3. **Health Education**:
   - Provides accurate health information
   - Uses patient-friendly language
   - Includes prevention measures

## Database Models

- **UserProfile**: Extended user information
- **MedicalRecord**: Patient medical history
- **Prescription**: Doctor prescriptions
- **Medication**: Prescription medications
- **MedicineReminder**: Automated reminders
- **Appointment**: Doctor appointments
- **HealthMetric**: Vital signs tracking
- **DietPlan**: Nutrition plans
- **AIConsultation**: AI consultation history
- **EmergencyContact**: Emergency contacts
- **DoctorReview**: Doctor ratings and reviews

## Automated Tasks

The system includes Celery tasks for:

1. **Medicine Reminders** (every 30 minutes)
   - Sends email reminders based on schedule
   
2. **Appointment Reminders** (every 15 minutes)
   - Sends reminders 24 hours before appointments

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/`

## Testing
```bash
python manage.py test
```

## Production Deployment

1. Set `DEBUG=False` in `.env`
2. Configure proper `ALLOWED_HOSTS`
3. Use production database settings
4. Set up proper email backend
5. Use environment variables for secrets
6. Configure static file serving
7. Set up HTTPS
8. Use production-grade WSGI server (Gunicorn)

Example production commands:
```bash
python manage.py collectstatic
gunicorn healthcare_backend.wsgi:application --bind 0.0.0.0:8000
```

## Security Notes

- Never commit `.env` file
- Change `SECRET_KEY` in production
- Use strong database passwords
- Keep `GEMINI_API_KEY` secure
- Enable HTTPS in production
- Implement rate limiting
- Regular security updates

## Troubleshooting

### Database connection error
- Check PostgreSQL is running
- Verify database credentials in `.env`
- Ensure database exists

### Gemini API errors
- Verify API key is correct
- Check API quota limits
- Ensure internet connectivity

### Celery not working
- Check Redis is running
- Verify REDIS_URL in settings
- Check Celery logs

## Support

For issues and questions, please check the documentation or contact support.

## License

This project is proprietary software.
```

---

## ✅ SETUP CHECKLIST

After copying all files:

1. ✅ Create all directories first
2. ✅ Copy all files with exact paths
3. ✅ Make `setup.sh` executable: `chmod +x setup.sh`
4. ✅ Copy `.env.example` to `.env`: `cp .env.example .env`
5. ✅ **ADD YOUR GEMINI API KEY** to `.env`
6. ✅ Run setup: `bash setup.sh` or follow manual steps
7. ✅ Test the API

---

## 🔑 CRITICAL: Get Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Add to `backend/.env`:
```
   GEMINI_API_KEY=your_actual_key_here