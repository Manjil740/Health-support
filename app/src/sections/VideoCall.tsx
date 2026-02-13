import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  MessageSquare, 
  Clock,
  MonitorUp,
  Hand,
  Send,
  ChevronLeft,
} from 'lucide-react';
import { toast } from 'sonner';

const upcomingAppointments = [
  { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', time: '10:00 AM', duration: '30 min', status: 'ready' },
  { id: 2, doctor: 'Dr. Michael Chen', specialty: 'General Practitioner', time: '2:00 PM', duration: '45 min', status: 'scheduled' },
  { id: 3, doctor: 'Dr. Emily Davis', specialty: 'Dermatologist', time: 'Tomorrow, 9:00 AM', duration: '20 min', status: 'scheduled' },
];

const chatMessages = [
  { id: 1, sender: 'doctor', text: 'Hello! How are you feeling today?', time: '10:00 AM' },
  { id: 2, sender: 'patient', text: 'Hi Dr. Johnson, I\'ve been having some chest discomfort.', time: '10:01 AM' },
  { id: 3, sender: 'doctor', text: 'I see. Can you describe the discomfort? Is it sharp or dull?', time: '10:02 AM' },
];

export function VideoCall() {
  const { user, setCurrentView } = useApp();
  const [inCall, setInCall] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [selectedAppointment] = useState(upcomingAppointments[0]);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (inCall) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [inCall]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setInCall(true);
    toast.success('Connecting to video call...');
  };

  const handleEndCall = () => {
    setInCall(false);
    toast.info('Call ended');
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      toast.success('Message sent');
      setMessage('');
    }
  };

  // Get user name for display
  const getUserName = () => {
    if (!user) return 'User';
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.name) {
      return user.name;
    }
    if (user.username) {
      return user.username;
    }
    return 'User';
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name[0];
  };

  if (inCall) {
    return (
      <div className="fixed inset-0 bg-[#0B1B2D] z-50 flex flex-col">
        {/* Call Header */}
        <div className="flex items-center justify-between p-4 bg-black/50">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleEndCall}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-white font-semibold">{selectedAppointment.doctor}</p>
              <p className="text-white/60 text-sm">{selectedAppointment.specialty}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-red-500 text-white">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(callDuration)}
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 flex">
          <div className="flex-1 relative p-4">
            {/* Main Video (Doctor) */}
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="bg-[#2F6BFF] text-white text-3xl">
                    {selectedAppointment.doctor.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-white/60">Doctor's video</p>
              </div>
              
              {/* Self View */}
              <div className="absolute bottom-4 right-4 w-48 h-36 rounded-xl bg-gray-800 border-2 border-white/20 overflow-hidden">
                {videoEnabled ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-green-500 text-white">
                        {getUserInitials(getUserName())}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <VideoOff className="w-8 h-8 text-white/40" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          {showChat && (
            <div className="w-80 bg-white dark:bg-[#1a1a2e] border-l border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold">Chat</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.sender === 'patient'
                          ? 'bg-[#2F6BFF] text-white rounded-br-sm'
                          : 'bg-secondary rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-60 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="p-6 bg-black/50">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={audioEnabled ? 'secondary' : 'destructive'}
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            <Button
              variant={videoEnabled ? 'secondary' : 'destructive'}
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={() => setVideoEnabled(!videoEnabled)}
            >
              {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="w-14 h-14 rounded-full"
              onClick={handleEndCall}
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
            <Button
              variant={screenSharing ? 'default' : 'secondary'}
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={() => setScreenSharing(!screenSharing)}
            >
              <MonitorUp className="w-5 h-5" />
            </Button>
            <Button
              variant={handRaised ? 'default' : 'secondary'}
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={() => setHandRaised(!handRaised)}
            >
              <Hand className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0B1B2D] dark:text-white">
            Video Consultations
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect with your healthcare providers remotely
          </p>
        </div>

        {/* Ready to Join Card */}
        {selectedAppointment.status === 'ready' && (
          <Card className="hg-card mb-6 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-green-100 text-green-700 mb-2">Ready to Join</Badge>
                    <h2 className="text-xl font-bold">{selectedAppointment.doctor}</h2>
                    <p className="text-muted-foreground">{selectedAppointment.specialty} • {selectedAppointment.time}</p>
                  </div>
                </div>
                <Button onClick={handleStartCall} className="hg-btn-primary px-8">
                  <Video className="w-5 h-5 mr-2" />
                  Join Call
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Appointments */}
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="space-y-4">
          {upcomingAppointments.map((apt) => (
            <Card key={apt.id} className="hg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarFallback className="bg-[#2F6BFF]/10 text-[#2F6BFF] text-lg">
                        {apt.doctor.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{apt.doctor}</h3>
                      <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {apt.time}
                        </span>
                        <span>•</span>
                        <span>{apt.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={
                        apt.status === 'ready' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }
                    >
                      {apt.status === 'ready' ? 'Ready' : 'Scheduled'}
                    </Badge>
                    {apt.status === 'ready' && (
                      <Button size="sm" onClick={handleStartCall}>
                        <Video className="w-4 h-4 mr-1" />
                        Join
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card className="hg-card mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">How Video Consultations Work</h3>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { step: 1, title: 'Book', desc: 'Schedule your appointment' },
                { step: 2, title: 'Prepare', desc: 'Test your camera & mic' },
                { step: 3, title: 'Join', desc: 'Click the join button' },
                { step: 4, title: 'Consult', desc: 'Talk with your doctor' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[#2F6BFF] text-white flex items-center justify-center mx-auto mb-2 font-bold">
                    {item.step}
                  </div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

