#!/bin/bash
# Startup script for HealthGuard - runs both backend and frontend
clear
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/app"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  HealthGuard - Healthcare Platform${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${YELLOW}Error: Backend directory not found at $BACKEND_DIR${NC}"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${YELLOW}Error: Frontend directory not found at $FRONTEND_DIR${NC}"
    exit 1
fi

# Setup backend
echo -e "${BLUE}Setting up backend...${NC}"
cd "$BACKEND_DIR"

# Create virtual env if it doesn't exist
if [ ! -d "myenv" ]; then
    echo -e "${YELLOW}Creating Python virtual environment...${NC}"
    python3 -m venv myenv
fi

# Activate virtual env
source myenv/bin/activate

# Install dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
pip install -q -r requirements.txt

echo -e "${GREEN}✓ Backend ready${NC}\n"

# Setup frontend
echo -e "${BLUE}Setting up frontend...${NC}"
cd "$FRONTEND_DIR"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    rm -rf node_modules package-lock.json
    npm install

fi

echo -e "${GREEN}✓ Frontend ready${NC}\n"

# Start backend in background
echo -e "${BLUE}Starting backend server (port 8000)...${NC}"
cd "$BACKEND_DIR"
source myenv/bin/activate
python app.py &
BACKEND_PID=$!
echo -e "${GREEN}Backend started (PID: $BACKEND_PID)${NC}\n"

# Wait a bit for backend to start
sleep 2

# Start frontend in background
echo -e "${BLUE}Starting frontend server (port 5173)...${NC}"
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend started (PID: $FRONTEND_PID)${NC}\n"

# Display information
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Application started successfully!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "Frontend:  ${YELLOW}http://localhost:5173${NC}"
echo -e "Backend:   ${YELLOW}http://localhost:8000${NC}"
echo -e "Health:    ${YELLOW}http://localhost:8000/api/health/${NC}\n"

echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}\n"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}✓ Servers stopped${NC}"
}

trap cleanup EXIT

# Keep the script running
wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
