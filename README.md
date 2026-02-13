# 🏥 HealthGuard AI - Comprehensive Healthcare Platform

<p align="center">
  <img src="https://img.shields.io/badge/Version-2.0.0-blue?style=for-the-badge&logo=medical" alt="Version">
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Flask-Python-3776AB?style=for-the-badge&logo=python" alt="Flask">
  <img src="https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge" alt="License">
</p>

<p align="center">
  <strong>AI-Powered Healthcare Management Platform with Real-Time Video Consultations, Smart Scheduling, and Comprehensive Health Tracking</strong>
</p>

---

## ✨ Features at a Glance

| Category | Features |
|----------|----------|
| 🤖 **AI-Powered** | AI Health Assistant, Symptom Analysis, Clinical Insights, Risk Assessment, Health Education |
| 👤 **Patient Portal** | Health Dashboard, Appointments, Medical Records, Medicine Reminders, Health Metrics Tracking |
| 👨‍⚕️ **Doctor Portal** | Patient Management, Appointment Calendar, AI Clinical Insights, Prescriptions, Video Consultations |
| 🏢 **Clinic Admin** | Staff Management, Analytics Dashboard, Subscription Management, Patient Overview |
| 📹 **Video Calls** | HD Video Consultations, Screen Sharing, In-Call Chat, Recording Support |
| 🔐 **Security** | JWT Authentication, Role-Based Access, HIPAA-Ready, End-to-End Encryption |

---

## 🚀 Quick Start Guide

### Prerequisites

Ensure you have the following installed:

- **Node.js** 16+ and npm
- **Python** 3.8+
- **Linux/macOS** (or WSL on Windows)

### Installation Steps

```bash
# 1. Navigate to the project directory
cd Health-support

# 2. Make startup scripts executable
chmod +x start.sh setup.py

# 3. Run the application
./start.sh
```

The startup script automatically:
- ✅ Creates Python virtual environments
- ✅ Installs all dependencies (frontend & backend)
- ✅ Starts the Flask backend on port **8000**
- ✅ Starts the React frontend on port **5173**
- ✅ Starts the video server on port **5000**
- ✅ Displays access URLs

### Access the Application

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:8000 |
| **Video Server** | http://localhost:5000 |
| **API Health Check** | http://localhost:8000/api/health |

---

## 📱 User Roles & Registration

HealthGuard supports **5 different user roles** with specialized dashboards:

### 1️⃣ Patient 👤
**Registration:** Open http://localhost:5173 → Click "Register as Patient"

**Required Information:**
- Email address
- Phone number
- Password (min. 6 characters)
- First Name & Last Name
- Age (must be 18+)
- Gender (optional)
- Height, Weight, Blood Group (optional)

**Demo Mode:** Click "Try Demo Mode" → Select "Patient" to explore without registration

---

### 2️⃣ Doctor 👨‍⚕️
**Registration:** Admin creates doctor accounts in the system

**Demo Mode:** Click "Try Demo Mode" → Select "Doctor" to explore

**Doctor Features:**
- View today's appointments with patient details
- AI-powered clinical insights and risk assessments
- Patient history and medical records access
- Create prescriptions
- Video consultation management
- Patient visit analytics

---

### 3️⃣ Healthcare Worker 🩺
**Access:** Assigned by clinic admin

**Capabilities:**
- Patient assistance
- Appointment management
- Health metrics monitoring
- Basic medical record access

---

### 4️⃣ Clinic Admin 🏢
**Registration:** Open http://localhost:5173 → Click "Register Clinic/Hospital"

**Required Information:**
- Clinic/Hospital Name
- Email & Phone
- Location
- Admin Password (min. 8 characters)
- License & Registration Numbers

**Subscription Plans:**
- **Monthly:** $49.99/month (up to 50 patients, basic features)
- **Yearly:** $99.99/year (unlimited patients, premium features)

**Demo Mode:** Click "Try Demo Mode" → Select "Clinic Admin"

---

### 5️⃣ Platform Admin ⚙️
**Access:** Admin login from main auth screen

**Capabilities:**
- System-wide user management
- Platform analytics
- Revenue tracking
- Feature configuration

---

## 🎯 Complete Feature Walkthrough

### Step 1: Landing Page 🏠

When you first open the application, you'll see the professional landing page featuring:

- **Hero Section** - "AI that listens. Care that follows."
- **How It Works** - Three simple steps:
  1. Share symptoms - Type or speak, AI asks follow-ups
  2. Get guidance - Triage, next steps, care options
  3. Book & follow up - Schedule with right provider
- **For Clinics** - Clinic dashboard preview with scheduling
- **Sustainability** - Environmental impact metrics
- **Security** - HIPAA-ready, encryption, audit logs
- **CTA Section** - Get started or view pricing

---

### Step 2: Authentication 🔐

Click "Get Started" to access the auth screen with multiple options:

#### Login Options:
- **Patient Login** - Email and password
- **Doctor Login** - Credentials provided by admin
- **Admin Login** - Platform or clinic admin access

#### Registration:
- **Patient Registration** - Full health profile setup
- **Clinic Registration** - Hospital/clinic onboarding with subscription

#### Demo Mode:
- Try all features without registration
- Select from Patient, Doctor, or Clinic Admin roles
- Full feature access with local data

---

### Step 3: Patient Dashboard 📊

After login, patients see a comprehensive dashboard:

#### 📈 Health Metrics Overview
- **Heart Rate** - Real-time BPM with trend chart
- **Blood Pressure** - Systolic/Diastolic display
- **Steps Today** - Activity tracking with goal progress
- **Sleep Duration** - Last night's sleep analysis

#### 📉 Interactive Charts
- **Heart Rate Chart** - Area chart showing daily readings
- **Weekly Activity** - Bar chart with daily step counts

#### 🤖 AI Health Insights
- Personalized recommendations
- Trend analysis (e.g., "Heart Rate Trending Lower")
- Pattern detection (e.g., "Sleep better on active days")
- Confidence scores for each insight

#### 💊 Medicine Tracker
- Today's medications with dosage and timing
- Mark as "Taken" functionality
- Active prescription count

#### 📅 Appointments
- Upcoming appointments with doctor details
- Specialty, date, time, and appointment type
- Quick join for video consultations

#### 🎯 Daily Goals
- Steps target (default: 10,000)
- Water intake tracker (default: 8 glasses)
- Sleep goal (default: 8 hours)
- Visual progress bars

#### ⚡ Quick Actions
- History - View past consultations
- AI Insights - Get AI-powered health advice
- Nutrition - Food tracking and analysis
- Diet Plans - Personalized meal plans
- Medicines - Set medication reminders
- Reviews - Rate doctor experiences

---

### Step 4: AI Health Assistant 🤖

Located as a floating chat bubble on patient screens:

#### Features:
- **24/7 AI Availability** - Ask health questions anytime
- **Symptom Analysis** - Describe symptoms, get guidance
- **Health Education** - Learn about medical conditions
- **Confidence Scoring** - Know the reliability of responses

#### How to Use:
1. Click the Sparkles icon (bottom-right)
2. Type your health question or symptoms
3. Get instant AI-powered response
4. Follow recommendations or book appointment

#### Example Questions:
- "I have a headache and fever"
- "What are the best foods for heart health?"
- "How much water should I drink daily?"

⚠️ **Disclaimer:** AI provides general information. Always consult your doctor for medical advice.

---

### Step 5: Video Consultations 📹

Access via: Quick Actions → Video Call or from Appointment cards

#### Before the Call:
1. View upcoming appointments
2. See doctor details and specialty
3. Check appointment status (Ready/Scheduled)
4. Test camera and microphone

#### During the Call:
- **Video Controls** - Toggle camera on/off
- **Audio Controls** - Mute/unmute microphone
- **Screen Sharing** - Share your screen with doctor
- **Raise Hand** - Get doctor's attention
- **In-Call Chat** - Send text messages during consultation
- **Timer** - Track consultation duration

#### After the Call:
- Appointment marked as completed
- Follow-up recommendations sent
- Prescription if needed

---

### Step 6: Medical Records 📋

Access via: Quick Actions → Medical Records

#### Features:
- **View Records** - All past medical records
- **Add Records** - Upload new diagnosis, test results
- **Filter by Date** - Find records from specific periods
- **Doctor Access** - Doctors can add records during consultation
- **Secure Storage** - All records encrypted

#### Record Types:
- Diagnoses
- Test Results
- Imaging Reports
- Consultation Notes
- Treatment Plans

---

### Step 7: Appointments 📅

Access via: Quick Actions → Appointments

#### Patient Features:
- **Book Appointment** - Select doctor, date, time
- **View Upcoming** - All scheduled appointments
- **Cancel/Reschedule** - Modify appointment details
- **Join Video Call** - One-click join for ready appointments

#### Doctor Features:
- **Daily Schedule** - Today's appointments
- **Patient Queue** - See waiting patients
- **Appointment Requests** - Approve/reject requests
- **Patient History** - View past visits

---

### Step 8: Medicine Reminders 💊

Access via: Quick Actions → Medicines

#### Features:
- **Set Reminders** - Add medication with timing
- **Dosage Tracking** - Track each dose
- **Frequency Options** - Daily, weekly, as needed
- **Active/Inactive** - Pause or resume reminders
- **Notes Section** - Additional instructions

#### Reminder Information:
- Medication name
- Dosage amount
- Frequency
- Start/End dates
- Specific times
- Additional notes

---

### Step 9: Health Metrics 📈

Access via: Quick Actions → Health Metrics

#### Track:
- Blood Pressure
- Heart Rate
- Blood Sugar
- Weight
- Height
- BMI Calculation
- Custom metrics

#### Features:
- Add new readings
- View history
- Trend analysis over time
- Export data
- Share with doctor

---

### Step 10: Diet Plans & Nutrition 🥗

Access via: Quick Actions → Nutrition or Diet Plans

#### Nutrition Dashboard:
- Daily calorie tracking
- Macro breakdown (protein, carbs, fat)
- Meal logging
- Water intake

#### Diet Plans:
- Personalized meal plans
- Calorie goals
- Special diets (diabetic, low-sodium, etc.)
- Weekly menu options

---

### Step 11: Emergency Services 🚨

Access via: Emergency button on dashboard header

#### Features:
- Quick access to emergency contacts
- Hospital nearby (placeholder)
- Ambulance contact information
- EmergencySOS functionality

---

### Step 12: Doctor Dashboard (For Doctors) 👨‍⚕️

Doctors see a specialized dashboard:

#### 📊 Overview Stats
- Today's patients count
- Pending reviews
- New messages
- Average visit time

#### 📅 Appointment Management
- Today's schedule with patient queue
- Patient details (age, concern, vitals)
- AI risk assessment badges
- Status tracking (waiting, in-progress, completed)

#### 🤖 AI Clinical Insights
- Patient risk alerts
- Recommendation engine
- Confidence scores
- Priority flags (high/medium/low)

#### 📈 Analytics
- Weekly patient visits chart
- Patient distribution pie chart
- Condition breakdown
- Practice trends

#### 👥 Patient List
- Recent patients
- Patient status indicators
- Quick access to profiles
- Medical history

---

### Step 13: Settings & Profile ⚙️

Access via: Profile/Settings in sidebar

#### Profile Settings:
- Personal information update
- Profile photo
- Contact details
- Health information

#### App Preferences:
- Theme selection (Light/Dark/System)
- Accent color customization
- Notification preferences
- Language settings

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Create new account |
| POST | `/api/auth/login/` | User login |
| GET | `/api/auth/me/` | Get current user |
| POST | `/api/auth/logout/` | User logout |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments/` | List appointments |
| POST | `/api/appointments/` | Create appointment |
| PUT | `/api/appointments/{id}/` | Update appointment |
| DELETE | `/api/appointments/{id}/` | Cancel appointment |
| POST | `/api/appointments/{id}/start-video/` | Start video call |

### Medical Records
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medical-records/` | List records |
| POST | `/api/medical-records/` | Create record |
| PUT | `/api/medical-records/{id}/` | Update record |
| DELETE | `/api/medical-records/{id}/` | Delete record |

### Health Metrics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health-metrics/` | Get metrics |
| POST | `/api/health-metrics/` | Add metric |
| GET | `/api/health-metrics/trends/` | View trends |

### AI Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai-consultations/` | AI symptom analysis |
| POST | `/api/prescriptions/{id}/analyze/` | AI prescription analysis |
| POST | `/api/health-education/` | AI health education |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/` | Get messages |
| POST | `/api/messages/` | Send message |
| PATCH | `/api/messages/{id}/` | Mark as read |

---

## 🏗️ System Architecture

```
HealthGuard/
│
├── app/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── AIChatBubble.tsx  # AI assistant widget
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Topbar.tsx
│   │   ├── sections/             # Page components
│   │   │   ├── LandingPage.tsx   # Marketing landing
│   │   │   ├── AuthScreenNew.tsx # Authentication
│   │   │   ├── PatientDashboard.tsx
│   │   │   ├── DoctorDashboard.tsx
│   │   │   ├── VideoCall.tsx     # Video consultations
│   │   │   └── [other pages]
│   │   ├── lib/
│   │   │   ├── api.ts            # API client
│   │   │   └── config.ts         # Configuration
│   │   └── App.tsx               # Main app router
│   └── package.json
│
├── backend/                      # Python Flask API
│   ├── app.py                    # Main Flask app
│   ├── views.py                  # API endpoints
│   ├── auth.py                   # Authentication
│   ├── gemini_service.py         # AI integration
│   ├── subscription_service.py   # Subscription management
│   ├── otp_service.py            # OTP verification
│   ├── api/
│   │   ├── json_db.py            # JSON database
│   │   └── __init__.py
│   ├── data/                     # JSON data files
│   └── requirements.txt
│
├── concept call/                 # WebRTC Video Server
│   ├── server.py                 # Socket.IO server
│   ├── static/                   # JS/CSS assets
│   ├── templates/                # HTML templates
│   └── requirements.txt
│
├── start.sh                      # Master startup script
├── setup.py                      # Environment setup
└── README.md                      # This file
```

---

## ⚙️ Environment Configuration

### Backend (.env)

Create `backend/.env` file:

```env
FLASK_ENV=development
DEBUG=True
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET_KEY=jwt-secret-key-change-in-production
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
PORT=8000
HOST=0.0.0.0
GEMINI_API_KEY=your-google-gemini-api-key
```

### Frontend (.env)

Create `app/.env` file:

```env
VITE_API_BASE=http://localhost:8000/api
VITE_VIDEO_SERVER=http://localhost:5000
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process on specific port
lsof -ti:8000 | xargs kill -9    # Backend
lsof -ti:5173 | xargs kill -9    # Frontend
lsof -ti:5000 | xargs kill -9    # Video server
```

### Connection Refused Errors
1. Ensure all three servers are running
2. Check firewall settings
3. Verify IP address: `hostname -I | awk '{print $1}'`
4. Run `python3 setup.py` for network configuration

### Database Issues
```bash
# Reset database (removes all data)
rm backend/data/*.json
```

### Reinstall Dependencies
```bash
# Backend
cd backend
rm -rf myenv
python3 -m venv myenv
source myenv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../app
rm -rf node_modules package-lock.json
npm install

# Video server
cd ../concept\ call
pip install -r requirements.txt
```

---

## 📦 Default Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Patient | `testpatient` | `password123` |
| Doctor | `testdoctor` | `password123` |
| Admin | `admin` | `password123` |

---

## 🚀 Production Deployment

### Checklist:

1. **Update CORS settings:**
   ```
   CORS_ALLOWED_ORIGINS=https://yourdomain.com
   ```

2. **Disable debug mode:**
   ```
   DEBUG=False
   ```

3. **Use production server:**
   ```bash
   gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```

4. **Enable SSL/HTTPS** with Nginx reverse proxy

5. **Set up production database** (PostgreSQL/MongoDB recommended)

6. **Configure environment variables** for production

---

## 📊 Recent Updates

### ✅ Version 2.0 Features
- [x] AI-Powered symptom analysis
- [x] Real-time video consultations
- [x] Multi-role dashboards
- [x] Medicine reminders
- [x] Health metrics tracking
- [x] Diet & nutrition planning
- [x] Emergency services
- [x] Prescription management
- [x] Medical records
- [x] Demo mode for all roles
- [x] Responsive design
- [x] Dark/Light theme support
- [x] Cross-network access

---

## 📞 Support

If you encounter issues:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review server logs in `/tmp/`
3. Check browser console (F12)
4. Verify all services are running with `curl http://localhost:8000/api/health/`

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Follow existing code style
2. Test thoroughly before submitting
3. Update documentation accordingly

---

## 📄 License

This project is proprietary and confidential.
© 2024-2026 HealthGuard AI. All rights reserved.

---

<div align="center">

### 🎯 Get Started Now!

**[http://localhost:5173](http://localhost:5173)**

---

Built with ❤️ using React, Flask, and AI

</div>

