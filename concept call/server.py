#!/usr/bin/env python3
"""
Video Chat Server
A complete WebRTC video conferencing solution with Socket.IO
"""
import os
import uuid
import time
from datetime import datetime
from typing import Dict, List, Optional
from flask import Flask, render_template, request, session, redirect, url_for, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room, send
import socket
import urllib.request
from urllib.error import URLError

# Configuration
DEBUG = True
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
HOST = '0.0.0.0'
PORT = 5000

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY
app.config['DEBUG'] = DEBUG

# Initialize Socket.IO with eventlet for better performance
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode='eventlet',
    logger=True,
    engineio_logger=False,
    ping_timeout=60,
    ping_interval=25,
    max_http_buffer_size=10 * 1024 * 1024  # 10MB
)

# Data structures
class User:
    """User data structure"""
    def __init__(self, sid: str, username: str, user_id: str):
        self.sid = sid
        self.username = username
        self.user_id = user_id
        self.joined_at = datetime.now()
        self.last_seen = datetime.now()
        self.media_state = {
            'camera': True,
            'microphone': True,
            'screen_share': False
        }
        self.stream_id = f"stream_{user_id}"
        
    def to_dict(self):
        return {
            'sid': self.sid,
            'username': self.username,
            'user_id': self.user_id,
            'joined_at': self.joined_at.isoformat(),
            'media_state': self.media_state,
            'stream_id': self.stream_id
        }

# Global state
users: Dict[str, User] = {}  # sid -> User
rooms = {
    'main': set()  # room_name -> set of sids
}

# Utility functions
def get_user_by_sid(sid: str) -> Optional[User]:
    return users.get(sid)

def get_user_by_username(username: str) -> Optional[User]:
    for user in users.values():
        if user.username == username:
            return user
    return None

def broadcast_user_list():
    """Broadcast updated user list to all clients"""
    user_list = {}
    for sid, user in users.items():
        user_list[sid] = {
            'username': user.username,
            'user_id': user.user_id,
            'media_state': user.media_state,
            'stream_id': user.stream_id,
            'joined_at': user.joined_at.isoformat()
        }
    
    emit('user_list_updated', {
        'users': user_list,
        'timestamp': datetime.now().isoformat()
    }, broadcast=True, namespace='/')

def broadcast_system_message(message: str):
    """Send system message to all users"""
    emit('system_message', {
        'message': message,
        'timestamp': datetime.now().isoformat(),
        'type': 'system'
    }, broadcast=True, namespace='/')


def get_local_ip() -> str:
    """Return the local LAN IP address by opening a UDP socket."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '127.0.0.1'


def get_public_ip(timeout: int = 3) -> Optional[str]:
    """Attempt to fetch public IP from api.ipify.org."""
    try:
        with urllib.request.urlopen('https://api.ipify.org', timeout=timeout) as resp:
            return resp.read().decode('utf-8')
    except URLError:
        return None
    except Exception:
        return None


# Optional ngrok support (if pyngrok is installed and ngrok available)
PUBLIC_URL = None
try:
    from pyngrok import ngrok
    try:
        # Try to open an HTTP tunnel for the Flask port
        tunnel = ngrok.connect(PORT, bind_tls=True)
        PUBLIC_URL = tunnel.public_url
    except Exception as e:
        print('[NGROK] Failed to start ngrok tunnel:', e)
        PUBLIC_URL = None
except Exception:
    # pyngrok not installed; skip ngrok setup
    PUBLIC_URL = None

# Flask Routes
@app.route('/')
def index():
    """Home page with login form"""
    # Provide public URL and server IP info to client (if available)
    local_ip = get_local_ip()
    public_ip = get_public_ip()
    return render_template('index.html', public_url=PUBLIC_URL, local_ip=local_ip, public_ip=public_ip)

@app.route('/login', methods=['POST'])
def login():
    """Handle user login"""
    username = request.form.get('username', '').strip()
    
    if not username:
        return jsonify({'error': 'Username is required'}), 400
    
    # Check if username already exists
    if get_user_by_username(username):
        return jsonify({'error': 'Username already taken'}), 400
    
    # Generate user ID
    user_id = str(uuid.uuid4())[:8]
    
    # Store in session
    session['username'] = username
    session['user_id'] = user_id
    session['logged_in'] = True
    
    return jsonify({
        'success': True,
        'username': username,
        'user_id': user_id,
        'redirect': '/chat'
    })

@app.route('/chat')
def chat():
    """Main chat room"""
    if not session.get('logged_in'):
        return redirect('/')
    
    username = session.get('username')
    user_id = session.get('user_id')
    local_ip = get_local_ip()
    public_ip = get_public_ip()
    return render_template('chat.html', 
                         username=username,
                         user_id=user_id,
                         server_time=datetime.now().isoformat(),
                         public_url=PUBLIC_URL,
                         local_ip=local_ip,
                         public_ip=public_ip)

@app.route('/logout')
def logout():
    """Logout user"""
    session.clear()
    return redirect('/')

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'users_online': len(users),
        'server_time': time.time()
    })

@app.route('/api/users')
def api_users():
    """API endpoint to get online users"""
    return jsonify({
        'users': [user.to_dict() for user in users.values()],
        'count': len(users)
    })

# Socket.IO Event Handlers
@socketio.on('connect')
def handle_connect():
    """Handle new client connection"""
    sid = request.sid
    print(f"[CONNECT] Client connected: {sid}")
    
    # Send connection acknowledgement
    emit('connected', {
        'sid': sid,
        'timestamp': datetime.now().isoformat(),
        'message': 'Connected to server'
    })

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    sid = request.sid
    user = get_user_by_sid(sid)
    
    if user:
        print(f"[DISCONNECT] User disconnected: {user.username} ({sid})")
        
        # Remove from users dict
        users.pop(sid, None)
        
        # Remove from rooms
        for room_users in rooms.values():
            room_users.discard(sid)
        
        # Notify other users
        emit('user_left', {
            'sid': sid,
            'username': user.username,
            'user_id': user.user_id,
            'timestamp': datetime.now().isoformat()
        }, broadcast=True, skip_sid=sid)
        
        # Broadcast updated user list
        broadcast_user_list()
        
        # Send system message
        broadcast_system_message(f"{user.username} has left the chat")

@socketio.on('user_join')
def handle_user_join(data):
    """Handle user joining the chat"""
    sid = request.sid
    username = data.get('username', 'Anonymous')
    user_id = data.get('user_id', str(uuid.uuid4())[:8])
    
    print(f"[JOIN] User joining: {username} ({sid})")
    
    # Create user object
    user = User(sid, username, user_id)
    users[sid] = user
    
    # Add to main room
    rooms['main'].add(sid)
    join_room('main', sid=sid)
    
    # Prepare existing users list (excluding self)
    existing_users = {}
    for existing_sid, existing_user in users.items():
        if existing_sid != sid:
            existing_users[existing_sid] = {
                'username': existing_user.username,
                'user_id': existing_user.user_id,
                'media_state': existing_user.media_state,
                'stream_id': existing_user.stream_id
            }
    
    # Send welcome data to new user
    emit('welcome', {
        'sid': sid,
        'username': username,
        'user_id': user_id,
        'existing_users': existing_users,
        'room': 'main',
        'timestamp': datetime.now().isoformat()
    }, room=sid)
    
    # Notify other users
    emit('user_joined', {
        'sid': sid,
        'username': username,
        'user_id': user_id,
        'media_state': user.media_state,
        'stream_id': user.stream_id,
        'timestamp': datetime.now().isoformat()
    }, broadcast=True, skip_sid=sid)
    
    # Broadcast updated user list
    broadcast_user_list()
    
    # Send system message
    broadcast_system_message(f"🎉 {username} joined the chat!")

@socketio.on('chat_message')
def handle_chat_message(data):
    """Handle chat messages"""
    sid = request.sid
    user = get_user_by_sid(sid)
    
    if not user:
        return
    
    message = data.get('message', '').strip()
    if not message:
        return
    
    print(f"[CHAT] {user.username}: {message[:50]}...")
    
    # Broadcast message to all users
    emit('new_message', {
        'sid': sid,
        'username': user.username,
        'user_id': user.user_id,
        'message': message,
        'timestamp': datetime.now().isoformat(),
        'type': 'chat'
    }, broadcast=True, include_self=True)

# WebRTC Signaling Events
@socketio.on('webrtc_offer')
def handle_webrtc_offer(data):
    """Handle WebRTC offer from a peer"""
    sid = request.sid
    target_sid = data.get('target_sid')
    offer = data.get('offer')
    
    if not target_sid or not offer:
        return
    
    print(f"[WEBRTC] Offer from {sid} to {target_sid}")
    
    # Forward offer to target peer
    emit('webrtc_offer', {
        'from_sid': sid,
        'offer': offer,
        'timestamp': datetime.now().isoformat()
    }, room=target_sid)

@socketio.on('webrtc_answer')
def handle_webrtc_answer(data):
    """Handle WebRTC answer from a peer"""
    sid = request.sid
    target_sid = data.get('target_sid')
    answer = data.get('answer')
    
    if not target_sid or not answer:
        return
    
    print(f"[WEBRTC] Answer from {sid} to {target_sid}")
    
    # Forward answer to target peer
    emit('webrtc_answer', {
        'from_sid': sid,
        'answer': answer,
        'timestamp': datetime.now().isoformat()
    }, room=target_sid)

@socketio.on('webrtc_ice_candidate')
def handle_webrtc_ice_candidate(data):
    """Handle ICE candidate exchange"""
    sid = request.sid
    target_sid = data.get('target_sid')
    candidate = data.get('candidate')
    
    if not target_sid or not candidate:
        return
    
    # Forward ICE candidate to target peer
    emit('webrtc_ice_candidate', {
        'from_sid': sid,
        'candidate': candidate,
        'timestamp': datetime.now().isoformat()
    }, room=target_sid)

@socketio.on('media_state_update')
def handle_media_state_update(data):
    """Handle media state updates (camera/mic toggle)"""
    sid = request.sid
    user = get_user_by_sid(sid)
    
    if not user:
        return
    
    # Update user's media state
    if 'camera' in data:
        user.media_state['camera'] = data['camera']
    if 'microphone' in data:
        user.media_state['microphone'] = data['microphone']
    if 'screen_share' in data:
        user.media_state['screen_share'] = data['screen_share']
    
    print(f"[MEDIA] {user.username} media update: {user.media_state}")
    
    # Broadcast media state update
    emit('user_media_updated', {
        'sid': sid,
        'username': user.username,
        'media_state': user.media_state,
        'timestamp': datetime.now().isoformat()
    }, broadcast=True, skip_sid=sid)

@socketio.on('typing')
def handle_typing(data):
    """Handle typing indicator"""
    sid = request.sid
    user = get_user_by_sid(sid)
    
    if not user:
        return
    
    is_typing = data.get('typing', False)
    
    # Broadcast typing indicator
    emit('user_typing', {
        'sid': sid,
        'username': user.username,
        'typing': is_typing,
        'timestamp': datetime.now().isoformat()
    }, broadcast=True, skip_sid=sid)

# Error handling
@socketio.on_error_default
def default_error_handler(e):
    """Default Socket.IO error handler"""
    print(f"[ERROR] Socket.IO error: {e}")
    emit('error', {
        'message': 'An error occurred',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Video Chat Server Starting...")
    print(f"📡 Server: http://{HOST}:{PORT}")
    print(f"🔧 Debug Mode: {DEBUG}")
    # Print local/public IPs and optional ngrok public URL
    local_ip = get_local_ip()
    public_ip = get_public_ip()
    print(f"🏠 Local IP: {local_ip}:{PORT}")
    if public_ip:
        print(f"🌐 Public IP: {public_ip}:{PORT}")
    if PUBLIC_URL:
        print(f"🔒 Ngrok URL: {PUBLIC_URL}")
    else:
        print("🔒 Ngrok: not available (pyngrok not installed or failed to start)")
    print("=" * 50)
    
    socketio.run(
        app,
        host=HOST,
        port=PORT,
        debug=DEBUG,
        use_reloader=True,
        log_output=True
    )