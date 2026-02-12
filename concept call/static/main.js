/**
 * Main Application Controller
 * Handles UI interactions, Socket.IO communication, and WebRTC management
 */

class VideoChatApp {
    constructor() {
        // Application state
        this.config = window.APP_CONFIG || {};
        this.socket = null;
        this.user = {
            username: this.config.username || 'Anonymous',
            userId: this.config.userId || this.generateUserId(),
            sid: null
        };
        
        // Media state
        this.localStream = null;
        this.screenStream = null;
        this.peers = new Map(); // Map<sid, RTCPeerConnection>
        this.remoteStreams = new Map(); // Map<sid, MediaStream>
        
        // UI state
        this.isCameraEnabled = true;
        this.isMicrophoneEnabled = true;
        this.isScreenSharing = false;
        this.isFullscreen = false;
        this.isChatOpen = true;
        this.isParticipantsOpen = true;
        
        // DOM elements cache
        this.elements = {};
        this.initializeElements();
        
        // Bind methods
        this.initialize = this.initialize.bind(this);
        this.joinChat = this.joinChat.bind(this);
        this.leaveChat = this.leaveChat.bind(this);
        this.toggleCamera = this.toggleCamera.bind(this);
        this.toggleMicrophone = this.toggleMicrophone.bind(this);
        this.toggleScreenShare = this.toggleScreenShare.bind(this);
        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.showNotification = this.showNotification.bind(this);
        
        // Initialize app
        this.initialize();
    }
    
    /**
     * Cache DOM elements
     */
    initializeElements() {
        this.elements = {
            // Loading screen
            loadingScreen: document.getElementById('loading-screen'),
            appContainer: document.querySelector('.app-container'),
            
            // Top navigation
            onlineCount: document.getElementById('online-count'),
            participantCount: document.getElementById('participant-count'),
            peerCount: document.getElementById('peer-count'),
            connectionStatus: document.querySelector('.connection-status'),
            
            // Video grid
            videoGrid: document.getElementById('video-grid'),
            localVideoContainer: document.getElementById('local-video-container'),
            
            // Participants list
            participantsList: document.getElementById('participants-list'),
            
            // Chat
            chatMessages: document.getElementById('chat-messages'),
            messageInput: document.getElementById('message-input'),
            sendMessageBtn: document.getElementById('send-message'),
            typingIndicator: document.getElementById('typing-indicator'),
            typingText: document.getElementById('typing-text'),
            
            // Controls
            toggleCameraBtn: document.getElementById('toggle-camera'),
            toggleMicrophoneBtn: document.getElementById('toggle-microphone'),
            toggleScreenshareBtn: document.getElementById('toggle-screenshare'),
            toggleChatBtn: document.getElementById('toggle-chat'),
            toggleParticipantsBtn: document.getElementById('toggle-participants'),
            endCallBtn: document.getElementById('end-call'),
            leaveBtn: document.getElementById('leave-btn'),
            
            // Modals
            settingsModal: document.getElementById('settings-modal'),
            settingsCloseBtn: document.querySelector('.modal-close'),
            
            // Invite
            inviteUrl: document.getElementById('invite-url'),
            copyInviteBtn: document.getElementById('copy-invite')
        };
    }
    
    /**
     * Initialize the application
     */
    async initialize() {
        console.log('🎬 Initializing Video Chat Application...');
        
        // Show loading screen
        this.showLoadingScreen();
        
        // Check browser compatibility
        if (!this.checkBrowserCompatibility()) {
            this.showError('Your browser does not support all required features. Please use Chrome, Firefox, or Edge.');
            return;
        }
        
        // Initialize Socket.IO
        this.initializeSocket();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Request media permissions and setup local stream
        try {
            await this.initializeLocalMedia();
            this.updateLoadingStep('media', '✅ Media access granted');
        } catch (error) {
            console.error('Failed to initialize media:', error);
            this.showError(`Media access failed: ${error.message}`);
            this.updateLoadingStep('media', '⚠️ Media access limited');
        }
        
        // Join chat room
        this.joinChat();
    }
    
    /**
     * Check browser compatibility
     */
    checkBrowserCompatibility() {
        const requiredAPIs = [
            'RTCPeerConnection',
            'RTCSessionDescription',
            'RTCIceCandidate',
            'MediaStream',
            'getUserMedia'
        ];
        
        let allSupported = true;
        
        for (const api of requiredAPIs) {
            if (!window[api] && !navigator.mediaDevices?.[api]) {
                console.error(`Missing API: ${api}`);
                allSupported = false;
            }
        }
        
        return allSupported;
    }
    
    /**
     * Initialize Socket.IO connection
     */
    initializeSocket() {
        console.log('🔌 Connecting to server...');
        
        this.socket = io({
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            transports: ['websocket', 'polling']
        });
        
        // Socket event handlers
        this.socket.on('connect', () => {
            console.log('✅ Connected to server, SID:', this.socket.id);
            this.user.sid = this.socket.id;
            this.updateLoadingStep('peers', '✅ Connected to server');
            this.updateConnectionStatus(true);
        });
        
        this.socket.on('connected', (data) => {
            console.log('Server connection confirmed:', data);
        });
        
        this.socket.on('welcome', (data) => {
            console.log('Welcome data received:', data);
            this.handleWelcome(data);
        });
        
        this.socket.on('user_list_updated', (data) => {
            this.updateUserList(data.users);
        });
        
        this.socket.on('user_joined', (data) => {
            console.log('User joined:', data.username);
            this.handleUserJoined(data);
        });
        
        this.socket.on('user_left', (data) => {
            console.log('User left:', data.username);
            this.handleUserLeft(data);
        });
        
        this.socket.on('user_media_updated', (data) => {
            this.handleUserMediaUpdate(data);
        });
        
        this.socket.on('new_message', (data) => {
            this.handleChatMessage(data);
        });
        
        this.socket.on('system_message', (data) => {
            this.handleSystemMessage(data);
        });
        
        this.socket.on('webrtc_offer', async (data) => {
            console.log('Received WebRTC offer from:', data.from_sid);
            await this.handleWebRTCOffer(data);
        });
        
        this.socket.on('webrtc_answer', async (data) => {
            console.log('Received WebRTC answer from:', data.from_sid);
            await this.handleWebRTCAnswer(data);
        });
        
        this.socket.on('webrtc_ice_candidate', async (data) => {
            await this.handleICECandidate(data);
        });
        
        this.socket.on('user_typing', (data) => {
            this.handleTypingIndicator(data);
        });
        
        this.socket.on('disconnect', (reason) => {
            console.log('Disconnected from server:', reason);
            this.updateConnectionStatus(false);
            this.showNotification('Disconnected from server', 'error');
        });
        
        this.socket.on('reconnect', (attemptNumber) => {
            console.log('Reconnected after', attemptNumber, 'attempts');
            this.updateConnectionStatus(true);
            this.showNotification('Reconnected to server', 'success');
            // Rejoin the chat
            this.joinChat();
        });
        
        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.showNotification('Connection error', 'error');
        });
        
        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
            this.showNotification('Socket error', 'error');
        });
    }
    
    /**
     * Initialize local media stream
     */
    async initializeLocalMedia() {
        console.log('🎥 Requesting media permissions...');
        
        try {
            // Get user media with constraints
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280, min: 640, max: 1920 },
                    height: { ideal: 720, min: 480, max: 1080 },
                    frameRate: { ideal: 30, min: 15, max: 60 },
                    facingMode: 'user'
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 2
                }
            });
            
            console.log('✅ Media stream obtained:', this.localStream.id);
            
            // Create local video element
            this.createLocalVideoElement();
            
            // Update UI controls
            this.updateMediaControls();
            
            return true;
            
        } catch (error) {
            console.error('❌ Media access error:', error);
            
            // Try to get audio only as fallback
            try {
                this.localStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false
                });
                
                console.log('✅ Audio-only stream obtained as fallback');
                
                // Create placeholder for video
                this.createLocalVideoElement(true);
                
                // Update UI
                this.updateMediaControls();
                this.elements.toggleCameraBtn.disabled = true;
                this.elements.toggleCameraBtn.innerHTML = '<i class="fas fa-video-slash"></i><span>No Camera</span>';
                
                return true;
                
            } catch (audioError) {
                console.error('❌ Audio access also failed:', audioError);
                
                // Create placeholder for both audio and video
                this.createLocalVideoElement(true);
                
                // Disable all media controls
                this.elements.toggleCameraBtn.disabled = true;
                this.elements.toggleMicrophoneBtn.disabled = true;
                this.elements.toggleCameraBtn.innerHTML = '<i class="fas fa-video-slash"></i><span>No Camera</span>';
                this.elements.toggleMicrophoneBtn.innerHTML = '<i class="fas fa-microphone-slash"></i><span>No Mic</span>';
                
                this.showNotification('Unable to access camera or microphone. Chat only mode.', 'warning');
                
                return false;
            }
        }
    }
    
    /**
     * Create local video element
     */
    createLocalVideoElement(isPlaceholder = false) {
        const container = this.elements.localVideoContainer;
        
        if (isPlaceholder) {
            container.innerHTML = `
                <div class="video-placeholder">
                    <i class="fas fa-user-circle"></i>
                    <span>${this.user.username}</span>
                    <small>Camera not available</small>
                </div>
            `;
            return;
        }
        
        // Create video element
        const video = document.createElement('video');
        video.id = 'local-video';
        video.className = 'local-video';
        video.autoplay = true;
        video.playsInline = true;
        video.muted = true; // Prevent echo
        video.srcObject = this.localStream;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'video-overlay';
        overlay.innerHTML = `
            <span class="video-name">${this.user.username} (You)</span>
            <div class="video-status">
                <span class="mic-status" style="display: ${this.isMicrophoneEnabled ? 'none' : 'inline-block'}">
                    <i class="fas fa-microphone-slash"></i>
                </span>
                <span class="cam-status" style="display: ${this.isCameraEnabled ? 'none' : 'inline-block'}">
                    <i class="fas fa-video-slash"></i>
                </span>
            </div>
        `;
        
        // Clear container and append
        container.innerHTML = '';
        container.appendChild(video);
        container.appendChild(overlay);
        
        // Add click handler for fullscreen
        video.addEventListener('dblclick', () => {
            this.toggleFullscreen(video);
        });
    }
    
    /**
     * Join the chat room
     */
    joinChat() {
        if (!this.socket || !this.socket.connected) {
            console.error('Socket not connected');
            this.showNotification('Not connected to server', 'error');
            return;
        }
        
        console.log('🚪 Joining chat room...');
        
        this.socket.emit('user_join', {
            username: this.user.username,
            user_id: this.user.userId
        });
        
        // Hide loading screen after a delay
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);
    }
    
    /**
     * Leave the chat room
     */
    leaveChat() {
        console.log('🚪 Leaving chat room...');
        
        // Close all peer connections
        this.peers.forEach((peer, sid) => {
            peer.close();
        });
        this.peers.clear();
        
        // Stop all media streams
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        
        if (this.screenStream) {
            this.screenStream.getTracks().forEach(track => track.stop());
        }
        
        // Clear remote streams
        this.remoteStreams.clear();
        
        // Disconnect socket
        if (this.socket) {
            this.socket.disconnect();
        }
        
        // Redirect to home page
        window.location.href = '/logout';
    }
    
    /**
     * Toggle camera on/off
     */
    toggleCamera() {
        if (!this.localStream) {
            this.showNotification('No media stream available', 'error');
            return;
        }
        
        const videoTrack = this.localStream.getVideoTracks()[0];
        if (!videoTrack) {
            this.showNotification('No video track available', 'error');
            return;
        }
        
        this.isCameraEnabled = !videoTrack.enabled;
        videoTrack.enabled = this.isCameraEnabled;
        
        // Update UI
        this.updateMediaControls();
        
        // Update overlay indicator
        const camStatus = document.querySelector('#local-video-container .cam-status');
        if (camStatus) {
            camStatus.style.display = this.isCameraEnabled ? 'none' : 'inline-block';
        }
        
        // Notify server
        this.socket.emit('media_state_update', {
            camera: this.isCameraEnabled,
            microphone: this.isMicrophoneEnabled,
            screen_share: this.isScreenSharing
        });
        
        // Update all peer connections
        this.updatePeerTracks();
        
        // Show notification
        const status = this.isCameraEnabled ? 'on' : 'off';
        this.showNotification(`Camera turned ${status}`, 'info');
    }
    
    /**
     * Toggle microphone on/off
     */
    toggleMicrophone() {
        if (!this.localStream) {
            this.showNotification('No media stream available', 'error');
            return;
        }
        
        const audioTrack = this.localStream.getAudioTracks()[0];
        if (!audioTrack) {
            this.showNotification('No audio track available', 'error');
            return;
        }
        
        this.isMicrophoneEnabled = !audioTrack.enabled;
        audioTrack.enabled = this.isMicrophoneEnabled;
        
        // Update UI
        this.updateMediaControls();
        
        // Update overlay indicator
        const micStatus = document.querySelector('#local-video-container .mic-status');
        if (micStatus) {
            micStatus.style.display = this.isMicrophoneEnabled ? 'none' : 'inline-block';
        }
        
        // Notify server
        this.socket.emit('media_state_update', {
            camera: this.isCameraEnabled,
            microphone: this.isMicrophoneEnabled,
            screen_share: this.isScreenSharing
        });
        
        // Update all peer connections
        this.updatePeerTracks();
        
        // Show notification
        const status = this.isMicrophoneEnabled ? 'on' : 'off';
        this.showNotification(`Microphone turned ${status}`, 'info');
    }
    
    /**
     * Toggle screen sharing
     */
    async toggleScreenShare() {
        try {
            if (!this.isScreenSharing) {
                // Start screen sharing
                this.screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        cursor: 'always',
                        displaySurface: 'monitor'
                    },
                    audio: true
                });
                
                const screenVideoTrack = this.screenStream.getVideoTracks()[0];
                
                if (this.localStream) {
                    // Replace video track in local stream
                    const oldVideoTrack = this.localStream.getVideoTracks()[0];
                    if (oldVideoTrack) {
                        this.localStream.removeTrack(oldVideoTrack);
                    }
                    this.localStream.addTrack(screenVideoTrack);
                    
                    // Update local video element
                    const localVideo = document.getElementById('local-video');
                    if (localVideo) {
                        localVideo.srcObject = this.localStream;
                    }
                }
                
                this.isScreenSharing = true;
                this.elements.toggleScreenshareBtn.innerHTML = '<i class="fas fa-stop"></i><span>Stop Share</span>';
                this.elements.toggleScreenshareBtn.classList.add('btn-danger');
                
                // Handle screen sharing stop
                screenVideoTrack.addEventListener('ended', () => {
                    this.toggleScreenShare();
                });
                
                // Update all peers
                this.updatePeerTracks();
                
                this.showNotification('Screen sharing started', 'success');
                
            } else {
                // Stop screen sharing
                this.screenStream.getTracks().forEach(track => track.stop());
                this.screenStream = null;
                
                // Switch back to camera
                try {
                    const cameraStream = await navigator.mediaDevices.getUserMedia({
                        video: true
                    });
                    
                    const cameraTrack = cameraStream.getVideoTracks()[0];
                    
                    if (this.localStream) {
                        const oldVideoTrack = this.localStream.getVideoTracks()[0];
                        if (oldVideoTrack) {
                            this.localStream.removeTrack(oldVideoTrack);
                        }
                        this.localStream.addTrack(cameraTrack);
                        
                        const localVideo = document.getElementById('local-video');
                        if (localVideo) {
                            localVideo.srcObject = this.localStream;
                        }
                        
                        // Stop unused audio track
                        cameraStream.getAudioTracks().forEach(track => track.stop());
                    }
                } catch (error) {
                    console.error('Failed to switch back to camera:', error);
                }
                
                this.isScreenSharing = false;
                this.elements.toggleScreenshareBtn.innerHTML = '<i class="fas fa-desktop"></i><span>Share Screen</span>';
                this.elements.toggleScreenshareBtn.classList.remove('btn-danger');
                
                // Update all peers
                this.updatePeerTracks();
                
                this.showNotification('Screen sharing stopped', 'info');
            }
            
            // Update server
            this.socket.emit('media_state_update', {
                camera: this.isCameraEnabled,
                microphone: this.isMicrophoneEnabled,
                screen_share: this.isScreenSharing
            });
            
        } catch (error) {
            console.error('Screen sharing error:', error);
            this.showNotification(`Screen sharing failed: ${error.message}`, 'error');
        }
    }
    
    /**
     * Update media controls UI
     */
    updateMediaControls() {
        // Camera button
        if (this.elements.toggleCameraBtn) {
            this.elements.toggleCameraBtn.classList.toggle('btn-primary', this.isCameraEnabled);
            this.elements.toggleCameraBtn.innerHTML = this.isCameraEnabled 
                ? '<i class="fas fa-video"></i><span>Camera On</span>'
                : '<i class="fas fa-video-slash"></i><span>Camera Off</span>';
        }
        
        // Microphone button
        if (this.elements.toggleMicrophoneBtn) {
            this.elements.toggleMicrophoneBtn.classList.toggle('btn-primary', this.isMicrophoneEnabled);
            this.elements.toggleMicrophoneBtn.innerHTML = this.isMicrophoneEnabled 
                ? '<i class="fas fa-microphone"></i><span>Mic On</span>'
                : '<i class="fas fa-microphone-slash"></i><span>Mic Off</span>';
        }
    }
    
    /**
     * Update peer tracks when media changes
     */
    updatePeerTracks() {
        this.peers.forEach((peer, sid) => {
            // Update video track
            const videoTrack = this.localStream?.getVideoTracks()[0];
            const videoSender = peer.getSenders().find(s => s.track?.kind === 'video');
            if (videoSender && videoTrack) {
                videoSender.replaceTrack(videoTrack);
            }
            
            // Update audio track
            const audioTrack = this.localStream?.getAudioTracks()[0];
            const audioSender = peer.getSenders().find(s => s.track?.kind === 'audio');
            if (audioSender && audioTrack) {
                audioSender.replaceTrack(audioTrack);
            }
        });
    }
    
    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen(element = document.documentElement) {
        if (!document.fullscreenElement) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
            this.isFullscreen = true;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.isFullscreen = false;
        }
    }
    
    /**
     * Send chat message
     */
    sendMessage() {
        const message = this.elements.messageInput.value.trim();
        if (!message || !this.socket) return;
        
        this.socket.emit('chat_message', {
            message: message
        });
        
        // Clear input
        this.elements.messageInput.value = '';
        
        // Focus back on input
        this.elements.messageInput.focus();
    }
    
    /**
     * Handle incoming chat message
     */
    handleChatMessage(data) {
        const isOutgoing = data.username === this.user.username;
        const messageClass = isOutgoing ? 'outgoing' : 'incoming';
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${messageClass}`;
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${this.escapeHtml(data.username)}</span>
                <span class="message-time">${this.formatTime(data.timestamp)}</span>
            </div>
            <div class="message-text">${this.escapeHtml(data.message)}</div>
        `;
        
        this.elements.chatMessages.appendChild(messageDiv);
        this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
    }
    
    /**
     * Handle system message
     */
    handleSystemMessage(data) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message system';
        messageDiv.innerHTML = `
            <div class="message-text">
                <i class="fas fa-info-circle"></i>
                ${this.escapeHtml(data.message)}
                <small>${this.formatTime(data.timestamp)}</small>
            </div>
        `;
        
        this.elements.chatMessages.appendChild(messageDiv);
        this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
    }
    
    /**
     * Handle typing indicator
     */
    handleTypingIndicator(data) {
        if (data.username === this.user.username) return;
        
        if (data.typing) {
            this.elements.typingText.textContent = `${data.username} is typing...`;
            this.elements.typingIndicator.style.display = 'flex';
        } else {
            this.elements.typingIndicator.style.display = 'none';
        }
    }
    
    /**
     * Update user list
     */
    updateUserList(users) {
        const list = this.elements.participantsList;
        
        // Clear existing users (keep "me")
        const existingUsers = list.querySelectorAll('.participant:not(.me)');
        existingUsers.forEach(user => user.remove());
        
        // Add other users
        Object.values(users).forEach(userData => {
            if (userData.username === this.user.username) return;
            
            const participant = document.createElement('div');
            participant.className = 'participant';
            participant.innerHTML = `
                <div class="participant-avatar">
                    <i class="fas fa-user-circle"></i>
                    <span class="media-indicator">
                        <i class="fas fa-video ${userData.media_state.camera ? 'fa-video' : 'fa-video-slash'}"></i>
                        <i class="fas fa-microphone ${userData.media_state.microphone ? 'fa-microphone' : 'fa-microphone-slash'}"></i>
                    </span>
                </div>
                <div class="participant-info">
                    <span class="participant-name">${this.escapeHtml(userData.username)}</span>
                    <span class="participant-status online">Online</span>
                </div>
                <div class="participant-actions">
                    <button class="action-btn" title="More options">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
            `;
            
            list.appendChild(participant);
        });
        
        // Update counts
        const totalCount = Object.keys(users).length + 1; // +1 for self
        this.elements.onlineCount.textContent = totalCount;
        this.elements.participantCount.textContent = totalCount;
        this.elements.peerCount.textContent = `${Object.keys(users).length} peers`;
    }
    
    /**
     * Handle welcome data from server
     */
    handleWelcome(data) {
        console.log('Welcome received:', data);
        
        // Update user SID
        this.user.sid = data.sid;
        
        // Create peer connections with existing users
        Object.keys(data.existing_users || {}).forEach(sid => {
            setTimeout(() => {
                this.createPeerConnection(sid);
            }, Math.random() * 500); // Stagger connections
        });
        
        // Show welcome message
        this.showNotification(`Welcome to the chat, ${this.user.username}!`, 'success');
    }
    
    /**
     * Handle user joined event
     */
    handleUserJoined(data) {
        console.log('User joined:', data.username);
        
        // Create peer connection with new user
        this.createPeerConnection(data.sid);
        
        // Show notification
        this.showNotification(`${data.username} joined the chat`, 'info');
    }
    
    /**
     * Handle user left event
     */
    handleUserLeft(data) {
        console.log('User left:', data.username);
        
        // Remove peer connection
        this.removePeerConnection(data.sid);
        
        // Remove video element
        const videoElement = document.getElementById(`video-${data.sid}`);
        if (videoElement) {
            videoElement.remove();
        }
        
        // Show notification
        this.showNotification(`${data.username} left the chat`, 'info');
    }
    
    /**
     * Handle user media update
     */
    handleUserMediaUpdate(data) {
        // Update user media indicators in participants list
        const participant = Array.from(this.elements.participantsList.children).find(p => {
            const nameElement = p.querySelector('.participant-name');
            return nameElement && nameElement.textContent === data.username;
        });
        
        if (participant) {
            const videoIcon = participant.querySelector('.fa-video');
            const micIcon = participant.querySelector('.fa-microphone');
            
            if (videoIcon) {
                videoIcon.className = data.media_state.camera ? 'fas fa-video' : 'fas fa-video-slash';
            }
            
            if (micIcon) {
                micIcon.className = data.media_state.microphone ? 'fas fa-microphone' : 'fas fa-microphone-slash';
            }
        }
    }
    
    /**
     * Create WebRTC peer connection
     */
    createPeerConnection(remoteSid) {
        console.log('Creating peer connection with:', remoteSid);
        
        if (this.peers.has(remoteSid)) {
            console.log('Peer connection already exists for:', remoteSid);
            return this.peers.get(remoteSid);
        }
        
        // Create RTCPeerConnection
        const peer = new RTCPeerConnection({
            iceServers: this.config.iceServers || [
                { urls: 'stun:stun.l.google.com:19302' }
            ],
            sdpSemantics: 'unified-plan'
        });
        
        // Add local tracks
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                peer.addTrack(track, this.localStream);
            });
        }
        
        // ICE candidate handler
        peer.onicecandidate = (event) => {
            if (event.candidate && this.socket) {
                this.socket.emit('webrtc_ice_candidate', {
                    target_sid: remoteSid,
                    candidate: event.candidate
                });
            }
        };
        
        // Track handler
        peer.ontrack = (event) => {
            console.log('Received remote track from:', remoteSid);
            this.handleRemoteTrack(remoteSid, event.streams[0]);
        };
        
        // Connection state handler
        peer.onconnectionstatechange = () => {
            console.log(`Connection state (${remoteSid}):`, peer.connectionState);
            
            if (peer.connectionState === 'connected') {
                console.log(`✅ Connected to ${remoteSid}`);
            } else if (peer.connectionState === 'disconnected' || 
                      peer.connectionState === 'failed' || 
                      peer.connectionState === 'closed') {
                console.log(`❌ Connection lost with ${remoteSid}`);
                this.removePeerConnection(remoteSid);
            }
        };
        
        // Store peer connection
        this.peers.set(remoteSid, peer);
        
        // Create and send offer
        this.createOffer(peer, remoteSid);
        
        return peer;
    }
    
    /**
     * Create WebRTC offer
     */
    async createOffer(peer, remoteSid) {
        try {
            const offer = await peer.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            
            await peer.setLocalDescription(offer);
            
            this.socket.emit('webrtc_offer', {
                target_sid: remoteSid,
                offer: offer
            });
            
            console.log('Offer sent to:', remoteSid);
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    }
    
    /**
     * Handle WebRTC offer
     */
    async handleWebRTCOffer(data) {
        const { from_sid, offer } = data;
        
        let peer = this.peers.get(from_sid);
        if (!peer) {
            peer = this.createPeerConnection(from_sid);
        }
        
        try {
            await peer.setRemoteDescription(new RTCSessionDescription(offer));
            
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            
            this.socket.emit('webrtc_answer', {
                target_sid: from_sid,
                answer: answer
            });
            
            console.log('Answer sent to:', from_sid);
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }
    
    /**
     * Handle WebRTC answer
     */
    async handleWebRTCAnswer(data) {
        const { from_sid, answer } = data;
        const peer = this.peers.get(from_sid);
        
        if (peer) {
            try {
                await peer.setRemoteDescription(new RTCSessionDescription(answer));
                console.log('Answer processed from:', from_sid);
            } catch (error) {
                console.error('Error handling answer:', error);
            }
        }
    }
    
    /**
     * Handle ICE candidate
     */
    async handleICECandidate(data) {
        const { from_sid, candidate } = data;
        const peer = this.peers.get(from_sid);
        
        if (peer && candidate) {
            try {
                await peer.addIceCandidate(new RTCIceCandidate(candidate));
                console.log('ICE candidate added from:', from_sid);
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        }
    }
    
    /**
     * Handle remote track
     */
    handleRemoteTrack(remoteSid, stream) {
        // Check if video element already exists
        let videoContainer = document.getElementById(`video-${remoteSid}`);
        
        if (!videoContainer) {
            // Create new video container
            videoContainer = document.createElement('div');
            videoContainer.id = `video-${remoteSid}`;
            videoContainer.className = 'video-container remote-video';
            
            // Create video element
            const video = document.createElement('video');
            video.id = `video-${remoteSid}-element`;
            video.autoplay = true;
            video.playsInline = true;
            video.srcObject = stream;
            
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'video-overlay';
            overlay.innerHTML = `
                <span class="video-name">Loading...</span>
                <div class="video-status">
                    <span class="mic-status">
                        <i class="fas fa-microphone-slash"></i>
                    </span>
                    <span class="cam-status">
                        <i class="fas fa-video-slash"></i>
                    </span>
                </div>
            `;
            
            videoContainer.appendChild(video);
            videoContainer.appendChild(overlay);
            
            // Add to video grid
            this.elements.videoGrid.appendChild(videoContainer);
            
            // Add double-click for fullscreen
            video.addEventListener('dblclick', () => {
                this.toggleFullscreen(video);
            });
        } else {
            // Update existing video element
            const video = videoContainer.querySelector('video');
            if (video) {
                video.srcObject = stream;
            }
        }
        
        // Store remote stream
        this.remoteStreams.set(remoteSid, stream);
        
        // Monitor stream for mute/unmute events
        this.monitorRemoteStream(remoteSid, stream);
    }
    
    /**
     * Monitor remote stream for status changes
     */
    monitorRemoteStream(remoteSid, stream) {
        const updateStatus = () => {
            const videoContainer = document.getElementById(`video-${remoteSid}`);
            if (!videoContainer) return;
            
            const videoTrack = stream.getVideoTracks()[0];
            const audioTrack = stream.getAudioTracks()[0];
            
            const videoActive = videoTrack && videoTrack.readyState === 'live' && videoTrack.enabled;
            const audioActive = audioTrack && audioTrack.readyState === 'live' && audioTrack.enabled;
            
            const camStatus = videoContainer.querySelector('.cam-status');
            const micStatus = videoContainer.querySelector('.mic-status');
            
            if (camStatus) {
                camStatus.style.display = videoActive ? 'none' : 'inline-block';
            }
            
            if (micStatus) {
                micStatus.style.display = audioActive ? 'none' : 'inline-block';
            }
        };
        
        // Initial update
        updateStatus();
        
        // Listen for track events
        stream.getTracks().forEach(track => {
            track.addEventListener('mute', updateStatus);
            track.addEventListener('unmute', updateStatus);
            track.addEventListener('ended', updateStatus);
        });
    }
    
    /**
     * Remove peer connection
     */
    removePeerConnection(remoteSid) {
        const peer = this.peers.get(remoteSid);
        if (peer) {
            peer.close();
            this.peers.delete(remoteSid);
        }
        
        // Remove from remote streams
        this.remoteStreams.delete(remoteSid);
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Media controls
        if (this.elements.toggleCameraBtn) {
            this.elements.toggleCameraBtn.addEventListener('click', this.toggleCamera);
        }
        
        if (this.elements.toggleMicrophoneBtn) {
            this.elements.toggleMicrophoneBtn.addEventListener('click', this.toggleMicrophone);
        }
        
        if (this.elements.toggleScreenshareBtn) {
            this.elements.toggleScreenshareBtn.addEventListener('click', this.toggleScreenShare);
        }
        
        if (this.elements.toggleChatBtn) {
            this.elements.toggleChatBtn.addEventListener('click', () => {
                const chatSidebar = document.querySelector('.chat-sidebar');
                chatSidebar.classList.toggle('active');
            });
        }
        
        if (this.elements.toggleParticipantsBtn) {
            this.elements.toggleParticipantsBtn.addEventListener('click', () => {
                const participantsSidebar = document.querySelector('.participants-sidebar');
                participantsSidebar.classList.toggle('active');
            });
        }
        
        // Chat input
        if (this.elements.sendMessageBtn) {
            this.elements.sendMessageBtn.addEventListener('click', this.sendMessage);
        }
        
        if (this.elements.messageInput) {
            this.elements.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            // Typing indicator
            this.elements.messageInput.addEventListener('input', () => {
                if (this.socket) {
                    this.socket.emit('typing', {
                        typing: this.elements.messageInput.value.length > 0
                    });
                }
            });
        }
        
        // End call buttons
        if (this.elements.endCallBtn) {
            this.elements.endCallBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to end the call?')) {
                    this.leaveChat();
                }
            });
        }
        
        if (this.elements.leaveBtn) {
            this.elements.leaveBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to leave?')) {
                    this.leaveChat();
                }
            });
        }
        
        // Fullscreen button
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
        
        // Copy invite link
        if (this.elements.copyInviteBtn) {
            this.elements.copyInviteBtn.addEventListener('click', () => {
                this.elements.inviteUrl.select();
                document.execCommand('copy');
                this.showNotification('Invite link copied to clipboard', 'success');
            });
        }
        
        // Settings modal
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.elements.settingsModal.style.display = 'block';
            });
        }
        
        if (this.elements.settingsCloseBtn) {
            this.elements.settingsCloseBtn.addEventListener('click', () => {
                this.elements.settingsModal.style.display = 'none';
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) {
                this.elements.settingsModal.style.display = 'none';
            }
        });
        
        // Handle page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden, update status
                console.log('Page hidden');
            } else {
                // Page is visible
                console.log('Page visible');
            }
        });
        
        // Handle beforeunload
        window.addEventListener('beforeunload', (e) => {
            if (this.peers.size > 0) {
                e.preventDefault();
                e.returnValue = 'Are you sure you want to leave? Your video call will end.';
            }
        });
    }
    
    /**
     * Show loading screen
     */
    showLoadingScreen() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.style.display = 'flex';
        }
        
        if (this.elements.appContainer) {
            this.elements.appContainer.style.display = 'none';
        }
    }
    
    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.style.display = 'none';
        }
        
        if (this.elements.appContainer) {
            this.elements.appContainer.style.display = 'flex';
        }
    }
    
    /**
     * Update loading step status
     */
    updateLoadingStep(stepId, text) {
        const stepElement = document.getElementById(`step-${stepId}`);
        if (stepElement) {
            const icon = stepElement.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-check';
                icon.style.color = '#4CAF50';
            }
            
            const textElement = stepElement.querySelector('span');
            if (textElement) {
                textElement.textContent = text;
            }
            
            stepElement.classList.add('active');
        }
    }
    
    /**
     * Update connection status
     */
    updateConnectionStatus(connected) {
        if (this.elements.connectionStatus) {
            const indicator = this.elements.connectionStatus.querySelector('.status-indicator');
            const text = this.elements.connectionStatus.querySelector('span');
            
            if (connected) {
                indicator.className = 'status-indicator connected';
                text.textContent = 'Connected';
            } else {
                indicator.className = 'status-indicator disconnected';
                text.textContent = 'Connecting...';
            }
        }
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <div class="notification-content">${this.escapeHtml(message)}</div>
            <button class="notification-close">&times;</button>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
    
    /**
     * Show error message
     */
    showError(message) {
        this.showNotification(message, 'error');
        console.error('Application error:', message);
    }
    
    /**
     * Get notification icon based on type
     */
    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }
    
    /**
     * Generate random user ID
     */
    generateUserId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Format time
     */
    formatTime(timestamp) {
        const date = timestamp ? new Date(timestamp) : new Date();
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }
    
    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the chat page
    if (document.querySelector('.app-container')) {
        window.videoChatApp = new VideoChatApp();
    }
});