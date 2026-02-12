# Quick Start Guide - HealthGuard

## In 3 Minutes

### Prerequisites
- Node.js & npm installed
- Python 3.8+ installed

### Step 1: Clone & Setup (1 minute)
```bash
# Navigate to project
cd Health-support

# Run setup script
chmod +x setup.sh
./setup.sh
```

### Step 2: Start the Application (1 minute)
```bash
chmod +x start.sh
./start.sh
```

### Step 3: Open in Browser (1 minute)
```
Frontend: http://localhost:5173
Backend:  http://localhost:8000/api/health
```

## Create a Test Account

1. Open http://localhost:5173
2. Click "Create Account"
3. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Account Type: `Patient` (or `Doctor`)
4. Click "Register"

## Available Test Features

### As a Patient
- ✓ View health dashboard
- ✓ Add health metrics
- ✓ Schedule appointments
- ✓ AI health consultations
- ✓ View medical records
- ✓ Manage medicine reminders

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
