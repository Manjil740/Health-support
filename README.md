# HealthGuard - Comprehensive Healthcare Platform

**A complete healthcare management system with real-time video consultations, AI insights, and appointment scheduling.**

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Linux/macOS (or WSL on Windows)

### Installation & Running

```bash
# 1. Navigate to project
cd Health-support

# 2. Make scripts executable
chmod +x start.sh setup.py

# 3. Run the application
./start.sh
```

The script will automatically:
- ✅ Set up Python virtual environments
- ✅ Install all dependencies
- ✅ Start the backend (Flask) on port 8000
- ✅ Start the frontend (React/Vite) on port 5173
- ✅ Start the video server on port 5000
- ✅ Display access URLs

## 🌐 Network Access

### On Your Local Machine
```
Frontend:    http://localhost:5173
Backend:     http://localhost:8000
Video Server: http://localhost:5000
API Health:  http://localhost:8000/api/health
```

### From Other Machines on Your Network
```bash
# Get your machine IP:
hostname -I | awk '{print $1}'
# Or run:
python3 setup.py

# Then access:
Frontend:    http://<YOUR_IP>:5173
Backend:     http://<YOUR_IP>:8000
Video Server: http://<YOUR_IP>:5000
```

**Example**: If your IP is `192.168.1.100`:
```
http://192.168.1.100:5173
```

## 📝 Create a Test Account

1. Open http://localhost:5173
2. Click "Create Account" 
3. Register with:
   - **Username**: `testuser`
   - **Email**: `test@example.com`
   - **Password**: `password123`
   - **Account Type**: Select `Patient` or `Doctor`
4. Click "Register" and login

## ✨ Features

### 👤 Patient Features
- 📊 Health Dashboard & Metrics
- 📅 Appointment Scheduling
- 💬 Doctor Messaging
- 🎥 Video Consultations
- 🧬 AI Health Insights
- 📋 Medical Records Management
- 💊 Medicine Reminders
- 📈 Health Trends & Analytics
- 🏥 Diet Plans & Nutrition
- 🚨 Emergency Contacts

### 👨‍⚕️ Doctor Features
- 👥 Patient Management
- 📅 Appointment Calendar
- 💬 Patient Messaging
- 🎥 Video Consultations
- 📊 Patient Health Data
- ⭐ Patient Reviews
- 📈 Practice Analytics

### 🏢 Admin Features
- 👥 User Management
- 📊 System Analytics
- 🔧 Platform Configuration
- 📋 Report Generation
- 💰 Revenue Tracking

## 🎥 Video Consultation Setup

The video system includes:
- **WebRTC** for peer-to-peer video
- **Socket.IO** for real-time messaging
- **Screen Sharing** capability
- **Recording** support (optional)

### Starting a Video Call
1. Schedule an appointment
2. Mark it as "Confirmed"
3. Click "Video Call" button
4. Allow camera/microphone permissions
5. Start the consultation

## 💬 Messaging Features

- Real-time messaging between patients and doctors
- Message history
- Read receipts
- Integrated with appointments

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register/` - Create account
- `POST /api/auth/login/` - Login
- `GET /api/auth/me/` - Get profile

### Appointments
- `GET /api/appointments/` - List appointments
- `POST /api/appointments/` - Create appointment
- `PUT /api/appointments/{id}/` - Update appointment
- `DELETE /api/appointments/{id}/` - Cancel appointment
- `POST /api/appointments/{id}/start-video/` - Start video call

### Messages
- `GET /api/messages/` - Get messages
- `POST /api/messages/` - Send message
- `PATCH /api/messages/{id}/` - Mark as read

### Health Data
- `GET /api/health-metrics/` - Get metrics
- `POST /api/health-metrics/` - Create metric
- `GET /api/health-metrics/trends/` - Get trends

### Medical Records
- `GET /api/medical-records/` - List records
- `POST /api/medical-records/` - Create record
- `DELETE /api/medical-records/{id}/` - Delete record

## 🛠️ System Architecture

```
HealthGuard/
├── app/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── components/   # UI Components
│   │   ├── sections/     # Page Components
│   │   ├── lib/          # API & utilities
│   │   └── App.tsx       # Main app
│   └── package.json
│
├── backend/              # Python Flask API
│   ├── app.py           # Main app & CORS setup
│   ├── views.py         # API routes
│   ├── auth.py          # Authentication
│   ├── api/             # API modules
│   ├── data/            # JSON databases
│   └── requirements.txt  # Dependencies
│
├── concept call/         # WebRTC Video Server
│   ├── server.py        # Socket.IO server
│   ├── static/          # JS/CSS
│   ├── templates/       # HTML
│   └── requirements.txt  # Dependencies
│
└── start.sh             # Master startup script
```

## 🔐 Environment Configuration

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True
PORT=8000
HOST=0.0.0.0
CORS_ALLOWED_ORIGINS=*
GEMINI_API_KEY=your-gemini-key
```

### Frontend (.env)
```
VITE_API_BASE=http://localhost:8000/api
VITE_VIDEO_SERVER=http://localhost:5000
```

## 📦 Port Configuration

| Service | Port | Purpose |
|---------|------|---------|
| Frontend | 5173 | React app (Vite dev server) |
| Backend | 8000 | Flask API |
| Video | 5000 | WebRTC & messaging |

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Connection Refused
- Make sure all three servers are running
- Check firewall settings
- Verify IP address (run `python3 setup.py`)

### Database Issues
```bash
# Reset database
rm backend/data/*.json
```

### Module Not Found Errors
```bash
# Reinstall dependencies
cd backend && pip install -r requirements.txt
cd ../app && npm install
cd ../concept\ call && pip install -r requirements.txt
```

## 🚀 Production Deployment

For production use:

1. **Update CORS settings** in `backend/.env`:
   ```
   CORS_ALLOWED_ORIGINS=https://yourdomain.com
   ```

2. **Set Debug mode**:
   ```
   DEBUG=False
   ```

3. **Use a production server** (Gunicorn for Flask):
   ```bash
   gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```

4. **Use SSL/HTTPS** with a reverse proxy (Nginx)

5. **Set up database** (PostgreSQL/MongoDB recommended)

## 📚 Documentation

- [API Documentation](./API_DOCS.md)
- [Integration Summary](./INTEGRATION_SUMMARY.md)
- [Architecture Guide](./ARCHITECTURE.md)

## 📝 Default Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Patient | `testpatient` | `password123` |
| Doctor | `testdoctor` | `password123` |
| Admin | `admin` | `password123` |

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and submit pull requests.

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For issues or questions:
1. Check the [troubleshooting](#-troubleshooting) section
2. Review server logs in `/tmp/`
3. Check browser console for errors
4. Verify all services are running

## 🎯 Recent Updates

- ✅ Connected frontend and backend
- ✅ Added dynamic IP detection
- ✅ Integrated video calling system
- ✅ Implemented messaging features
- ✅ Enhanced appointment system
- ✅ All buttons now functional
- ✅ Real-time consultation support
- ✅ Cross-network access enabled

---

**Happy Healthcare! 🏥💚**

### As a Doctor
- ✓ View patient list
- ✓ Create prescriptions
- ✓ Manage appointments
- ✓ View patient medical records

## Common Issues & Solutions

### Port Already in Use
```bash
# Change port in backend/.env
PORT=8001

# Or kill the process using the port
lsof -ti:8000 | xargs kill -9
```

### Frontend Can't Connect to Backend
1. Ensure backend is running: `curl http://localhost:8000/api/health/`
2. Check `.env` CORS_ALLOWED_ORIGINS includes your frontend URL
3. You might need to do a hard refresh (Ctrl+Shift+R)

### Python Virtual Environment Issues
```bash
cd backend

# Remove and recreate virtual environment
rm -rf myenv
python3 -m venv myenv
source myenv/bin/activate
pip install -r requirements.txt
```

### Node Dependencies Issue
```bash
cd app

# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables

Create `.env` file in `backend/` with:
```env
FLASK_ENV=development
DEBUG=True
SECRET_KEY=dev-key-change-in-production
JWT_SECRET_KEY=jwt-key-change-in-production
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
PORT=8000
GEMINI_API_KEY=your-key-here
```

## API Testing

Test the backend with curl:
```bash
# Health check
curl http://localhost:8000/api/health/

# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"password123",
    "first_name":"Test",
    "last_name":"User"
  }'

# Copy the token from response, then:
curl -H "Authorization: Bearer TOKEN_HERE" \
  http://localhost:8000/api/auth/me/
```

## Project Structure at a Glance

```
backend/          ← Flask API server (port 8000)
  ├── app.py      ← Main Flask app
  ├── auth.py     ← Authentication logic
  ├── views.py    ← API endpoints
  └── .env        ← Configuration

app/              ← React frontend (port 5173)
  ├── src/
  │   ├── lib/api.ts      ← API client
  │   ├── App.tsx         ← Main app
  │   └── sections/       ← Pages
  └── package.json        ← Dependencies

start.sh          ← Starts both servers
setup.sh          ← Initializes environment
README.md         ← Full documentation
```

## What You Can Do

- **Register & Login**: Create accounts and authenticate
- **Manage Profile**: Update user information
- **Health Tracking**: Add and view health metrics
- **Appointments**: Schedule doctor visits
- **Prescriptions**: Create and manage medical prescriptions
- **AI Chat**: Get health insights from AI
- **Medical Records**: Store and retrieve medical history

## Next Steps

1. **Explore the UI** - Check out different dashboard types (Patient/Doctor)
2. **Create test data** - Add health metrics, appointments, etc.
3. **Test API endpoints** - Use curl or Postman to test directly
4. **Customize** - Add your own features and styling

## Getting Help

- Check [README.md](./README.md) for full documentation
- Review error messages in browser console (F12)
- Check backend logs in terminal
- Review code comments in relevant files

---

Happy exploring! 🚀
