/**
 * WebRTC Utility Functions
 * Additional helper functions for WebRTC operations
 */

class WebRTCUtils {
    /**
     * Get available media devices
     */
    static async getMediaDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return {
                videoInputs: devices.filter(d => d.kind === 'videoinput'),
                audioInputs: devices.filter(d => d.kind === 'audioinput'),
                audioOutputs: devices.filter(d => d.kind === 'audiooutput')
            };
        } catch (error) {
            console.error('Error getting media devices:', error);
            return { videoInputs: [], audioInputs: [], audioOutputs: [] };
        }
    }
    
    /**
     * Test camera and microphone
     */
    static async testMediaDevices() {
        const results = {
            camera: { available: false, devices: [] },
            microphone: { available: false, devices: [] },
            speaker: { available: false, devices: [] }
        };
        
        try {
            // Get all devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            
            // Test camera
            const videoDevices = devices.filter(d => d.kind === 'videoinput');
            results.camera.devices = videoDevices;
            
            if (videoDevices.length > 0) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    stream.getTracks().forEach(track => track.stop());
                    results.camera.available = true;
                } catch (error) {
                    console.warn('Camera test failed:', error);
                }
            }
            
            // Test microphone
            const audioInputDevices = devices.filter(d => d.kind === 'audioinput');
            results.microphone.devices = audioInputDevices;
            
            if (audioInputDevices.length > 0) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    stream.getTracks().forEach(track => track.stop());
                    results.microphone.available = true;
                } catch (error) {
                    console.warn('Microphone test failed:', error);
                }
            }
            
            // Test speaker
            const audioOutputDevices = devices.filter(d => d.kind === 'audiooutput');
            results.speaker.devices = audioOutputDevices;
            results.speaker.available = audioOutputDevices.length > 0;
            
        } catch (error) {
            console.error('Media device test error:', error);
        }
        
        return results;
    }
    
    /**
     * Get camera resolution
     */
    static async getCameraResolution() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const track = stream.getVideoTracks()[0];
            const settings = track.getSettings();
            
            stream.getTracks().forEach(track => track.stop());
            
            return {
                width: settings.width,
                height: settings.height,
                frameRate: settings.frameRate
            };
        } catch (error) {
            console.error('Error getting camera resolution:', error);
            return null;
        }
    }
    
    /**
     * Capture screenshot from video
     */
    static captureScreenshot(videoElement) {
        if (!videoElement || !(videoElement instanceof HTMLVideoElement)) {
            throw new Error('Invalid video element');
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        return canvas.toDataURL('image/png');
    }
    
    /**
     * Download screenshot
     */
    static downloadScreenshot(videoElement, filename = 'screenshot.png') {
        try {
            const dataUrl = this.captureScreenshot(videoElement);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = filename;
            link.click();
            return true;
        } catch (error) {
            console.error('Error downloading screenshot:', error);
            return false;
        }
    }
    
    /**
     * Get network statistics
     */
    static async getNetworkStats(peerConnection) {
        if (!peerConnection || !peerConnection.getStats) {
            return null;
        }
        
        try {
            const stats = await peerConnection.getStats();
            const results = {};
            
            stats.forEach(report => {
                if (report.type === 'inbound-rtp' || report.type === 'outbound-rtp') {
                    results[report.type] = {
                        kind: report.kind,
                        packetsLost: report.packetsLost,
                        packetsReceived: report.packetsReceived,
                        bytesReceived: report.bytesReceived,
                        jitter: report.jitter,
                        timestamp: report.timestamp
                    };
                } else if (report.type === 'candidate-pair' && report.nominated) {
                    results.candidatePair = {
                        currentRoundTripTime: report.currentRoundTripTime,
                        availableOutgoingBitrate: report.availableOutgoingBitrate,
                        requestsReceived: report.requestsReceived,
                        requestsSent: report.requestsSent,
                        responsesReceived: report.responsesReceived,
                        responsesSent: report.responsesSent
                    };
                }
            });
            
            return results;
        } catch (error) {
            console.error('Error getting network stats:', error);
            return null;
        }
    }
    
    /**
     * Check if browser supports all WebRTC features
     */
    static checkWebRTCSupport() {
        const features = {
            RTCPeerConnection: !!window.RTCPeerConnection || !!window.webkitRTCPeerConnection || !!window.mozRTCPeerConnection,
            RTCSessionDescription: !!window.RTCSessionDescription || !!window.webkitRTCSessionDescription,
            RTCIceCandidate: !!window.RTCIceCandidate || !!window.webkitRTCIceCandidate,
            getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
            getDisplayMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia),
            RTCRtpSender: !!window.RTCRtpSender,
            RTCRtpReceiver: !!window.RTCRtpReceiver
        };
        
        return {
            supported: Object.values(features).every(v => v),
            features: features
        };
    }
    
    /**
     * Get browser information
     */
    static getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        let version = 'Unknown';
        
        // Chrome
        if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) {
            browser = 'Chrome';
            const match = ua.match(/Chrome\/(\d+)/);
            if (match) version = match[1];
        }
        // Firefox
        else if (ua.includes('Firefox')) {
            browser = 'Firefox';
            const match = ua.match(/Firefox\/(\d+)/);
            if (match) version = match[1];
        }
        // Safari
        else if (ua.includes('Safari') && !ua.includes('Chrome')) {
            browser = 'Safari';
            const match = ua.match(/Version\/(\d+)/);
            if (match) version = match[1];
        }
        // Edge
        else if (ua.includes('Edg')) {
            browser = 'Edge';
            const match = ua.match(/Edg\/(\d+)/);
            if (match) version = match[1];
        }
        
        return {
            browser,
            version,
            userAgent: ua,
            platform: navigator.platform,
            language: navigator.language,
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
            isSecure: window.isSecureContext
        };
    }
    
    /**
     * Create data channel for file sharing
     */
    static createDataChannel(peerConnection, label = 'file-sharing') {
        if (!peerConnection) {
            throw new Error('Peer connection required');
        }
        
        try {
            const dataChannel = peerConnection.createDataChannel(label, {
                ordered: true,
                maxPacketLifeTime: 3000
            });
            
            return dataChannel;
        } catch (error) {
            console.error('Error creating data channel:', error);
            return null;
        }
    }
    
    /**
     * Send file over data channel
     */
    static async sendFile(dataChannel, file) {
        if (!dataChannel || dataChannel.readyState !== 'open') {
            throw new Error('Data channel not open');
        }
        
        if (!file || !(file instanceof File)) {
            throw new Error('Invalid file');
        }
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                try {
                    const arrayBuffer = event.target.result;
                    dataChannel.send(arrayBuffer);
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = function(error) {
                reject(error);
            };
            
            reader.readAsArrayBuffer(file);
        });
    }
    
    /**
     * Measure connection quality
     */
    static async measureConnectionQuality(peerConnection) {
        if (!peerConnection) {
            return null;
        }
        
        try {
            const stats = await peerConnection.getStats();
            let totalPacketsLost = 0;
            let totalPackets = 0;
            let totalBytes = 0;
            let timestamp = Date.now();
            
            stats.forEach(report => {
                if (report.type === 'inbound-rtp' || report.type === 'outbound-rtp') {
                    if (report.packetsLost !== undefined) {
                        totalPacketsLost += report.packetsLost;
                    }
                    if (report.packetsReceived !== undefined) {
                        totalPackets += report.packetsReceived;
                    }
                    if (report.bytesReceived !== undefined) {
                        totalBytes += report.bytesReceived;
                    }
                }
            });
            
            const packetLossRate = totalPackets > 0 ? (totalPacketsLost / totalPackets) * 100 : 0;
            
            // Determine quality based on packet loss
            let quality = 'excellent';
            if (packetLossRate > 5) quality = 'good';
            if (packetLossRate > 10) quality = 'fair';
            if (packetLossRate > 20) quality = 'poor';
            if (packetLossRate > 30) quality = 'bad';
            
            return {
                quality,
                packetLossRate: packetLossRate.toFixed(2),
                totalPackets,
                totalPacketsLost,
                totalBytes,
                timestamp
            };
        } catch (error) {
            console.error('Error measuring connection quality:', error);
            return null;
        }
    }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebRTCUtils;
}