#!/bin/bash
# Startup script for HealthGuard - runs backend, frontend, and video server
clear

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/app"
VIDEO_DIR="$PROJECT_ROOT/concept call"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  HealthGuard - Healthcare Platform${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Get local IP
LOCAL_IP=$(hostname -I | awk '{print $1}')
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="127.0.0.1"
fi

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    kill $VIDEO_PID 2>/dev/null || true
    wait $BACKEND_PID 2>/dev/null || true
    wait $FRONTEND_PID 2>/dev/null || true
    wait $VIDEO_PID 2>/dev/null || true
    echo -e "${GREEN}✓ Servers stopped${NC}"
}

trap cleanup EXIT INT TERM

# Check directories
[ ! -d "$BACKEND_DIR" ] && { echo -e "${RED}Error: Backend directory not found${NC}"; exit 1; }
[ ! -d "$FRONTEND_DIR" ] && { echo -e "${RED}Error: Frontend directory not found${NC}"; exit 1; }
[ ! -d "$VIDEO_DIR" ] && { echo -e "${RED}Error: Video server directory not found${NC}"; exit 1; }

# ===== BACKEND SETUP =====
echo -e "${BLUE}Setting up backend...${NC}"
cd "$BACKEND_DIR"

if [ ! -d "myenv" ]; then
    echo -e "${YELLOW}Creating Python virtual environment...${NC}"
    python3 -m venv myenv
fi

source myenv/bin/activate
echo -e "${YELLOW}Installing backend dependencies...${NC}"
pip install -q -r requirements.txt 2>/dev/null || pip install -r requirements.txt
echo -e "${GREEN}✓ Backend ready${NC}\n"

# ===== FRONTEND SETUP =====
echo -e "${BLUE}Setting up frontend...${NC}"
cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
fi

echo -e "${GREEN}✓ Frontend ready${NC}\n"

# ===== VIDEO SERVER SETUP =====
echo -e "${BLUE}Setting up video server...${NC}"
cd "$VIDEO_DIR"

if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating video server virtual environment...${NC}"
    python3 -m venv venv
fi

source venv/bin/activate
echo -e "${YELLOW}Installing video server dependencies...${NC}"
pip install -q -r requirements.txt 2>/dev/null || pip install -r requirements.txt
echo -e "${GREEN}✓ Video server ready${NC}\n"

# ===== START SERVERS =====
echo -e "${BLUE}Starting servers...${NC}\n"

# Start backend
echo -e "${YELLOW}Starting backend server (port 8000)...${NC}"
cd "$BACKEND_DIR"
source myenv/bin/activate
python app.py > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}Backend started (PID: $BACKEND_PID)${NC}"

sleep 2

# Start video server
echo -e "${YELLOW}Starting video/chat server (port 5000)...${NC}"
cd "$VIDEO_DIR"
source venv/bin/activate
python server.py > /tmp/video_server.log 2>&1 &
VIDEO_PID=$!
echo -e "${GREEN}Video server started (PID: $VIDEO_PID)${NC}"

sleep 2

# Start frontend
echo -e "${YELLOW}Starting frontend server (port 5173)...${NC}"
cd "$FRONTEND_DIR"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend started (PID: $FRONTEND_PID)${NC}\n"

sleep 3

# ===== DISPLAY INFORMATION =====
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ All services started successfully!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${YELLOW}📱 Web Access:${NC}"
echo -e "  Local:     ${BLUE}http://localhost:5173${NC}"
echo -e "  Network:   ${BLUE}http://${LOCAL_IP}:5173${NC}\n"

echo -e "${YELLOW}🔌 API Servers:${NC}"
echo -e "  Backend:   ${BLUE}http://localhost:8000${NC}"
echo -e "  Health:    ${BLUE}http://localhost:8000/api/health/${NC}"
echo -e "  Video:     ${BLUE}http://localhost:5000${NC}\n"

echo -e "${YELLOW}📊 Server Logs:${NC}"
echo -e "  Backend:   /tmp/backend.log"
echo -e "  Frontend:  /tmp/frontend.log"
echo -e "  Video:     /tmp/video_server.log\n"

echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}\n"

# Keep running
while true; do
    sleep 1
    # Check if any process died
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}Backend process died!${NC}"
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}Frontend process died!${NC}"
    fi
    if ! kill -0 $VIDEO_PID 2>/dev/null; then
        echo -e "${RED}Video server process died!${NC}"
    fi
done
