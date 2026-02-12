import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Activity, 
  Calendar, 
  Pill, 
  TrendingUp,
  Clock,
  ChevronRight,
  Sparkles,
  Heart,
  Moon,
  Footprints,
  Flame,
  AlertTriangle,
  Video,
  Brain,
  History,
  Apple,
  Utensils,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { toast } from 'sonner';

// Mock data for charts
const heartRateData = [
  { time: '6AM', value: 68 },
  { time: '9AM', value: 72 },
  { time: '12PM', value: 75 },
  { time: '3PM', value: 71 },
  { time: '6PM', value: 74 },
  { time: '9PM', value: 69 },
];

const weeklyStepsData = [
  { day: 'Mon', steps: 8432 },
  { day: 'Tue', steps: 10245 },
  { day: 'Wed', steps: 7890 },
  { day: 'Thu', steps: 11560 },
  { day: 'Fri', steps: 9876 },
  { day: 'Sat', steps: 6543 },
  { day: 'Sun', steps: 4567 },
];

const medications = [
  { name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', taken: true },
  { name: 'Metformin', dosage: '500mg', time: '12:00 PM', taken: true },
  { name: 'Atorvastatin', dosage: '20mg', time: '8:00 PM', taken: false },
];

const upcomingAppointments = [
  { 
    doctor: 'Dr. Sarah Johnson', 
    specialty: 'Cardiologist', 
    date: 'Mar 18, 2026', 
    time: '10:30 AM',
    type: 'Follow-up',
    avatar: null,
  },
  { 
    doctor: 'Dr. Michael Chen', 
    specialty: 'General Practitioner', 
    date: 'Mar 25, 2026', 
    time: '2:00 PM',
    type: 'Annual Checkup',
    avatar: null,
  },
];

const aiInsights = [
  { 
    type: 'trend', 
    title: 'Heart Rate Trending Lower', 
    description: 'Your resting heart rate has improved by 5% this month.',
    confidence: 92,
    trend: 'positive',
  },
  { 
    type: 'alert', 
    title: 'Sleep Pattern Detected', 
    description: 'You sleep better on days with 8K+ steps. Consider increasing activity.',
    confidence: 87,
    trend: 'neutral',
  },
];

export function PatientDashboard() {
  const { user, setCurrentView } = useApp();
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleTakeMedication = (medName: string) => {
    toast.success(`Marked ${medName} as taken`);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {greeting}, {user?.name?.split(' ')[0] || 'Demo'}
            </p>
            <h1 className="text-3xl font-bold text-[#0B1B2D] dark:text-white">
              Your Health Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="destructive" 
              className="rounded-xl"
              onClick={() => setCurrentView('emergency')}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Emergency
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => setCurrentView('video-call')}>
              <Video className="w-4 h-4 mr-2" />
              Video Call
            </Button>
            <Button className="hg-btn-primary" onClick={() => setCurrentView('ai-insights')}>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Triage
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, trend: '+2%', trendUp: true, color: 'text-red-500' },
          { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, trend: 'Normal', trendUp: true, color: 'text-blue-500' },
          { label: 'Steps Today', value: '8,432', unit: 'steps', icon: Footprints, trend: '+12%', trendUp: true, color: 'text-green-500' },
          { label: 'Sleep', value: '7h 24m', unit: 'last night', icon: Moon, trend: '-30m', trendUp: false, color: 'text-purple-500' },
        ].map((stat, index) => (
          <Card key={index} className="hg-card hg-card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-500' : 'text-amber-500'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-[#0B1B2D] dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.unit}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Heart Rate Chart */}
          <Card className="hg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Heart Rate</CardTitle>
                  <CardDescription>Today's readings</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Normal
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={heartRateData}>
                    <defs>
                      <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} domain={[60, 80]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      fill="url(#heartRateGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card className="hg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Weekly Activity</CardTitle>
                  <CardDescription>Step count this week</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">59,113 steps</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyStepsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                      }} 
                    />
                    <Bar dataKey="steps" fill="#2F6BFF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="hg-card border-[#2F6BFF]/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2F6BFF]" />
                <CardTitle className="text-lg">AI Health Insights</CardTitle>
              </div>
              <CardDescription>Personalized recommendations based on your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      insight.trend === 'positive' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30' 
                        : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                    }`}>
                      {insight.trend === 'positive' ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <Activity className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{insight.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          {/* Medications */}
          <Card className="hg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Today's Medications</CardTitle>
                <Pill className="w-5 h-5 text-[#2F6BFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medications.map((med, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                  >
                    <div>
                      <p className="font-medium text-sm">{med.name}</p>
                      <p className="text-xs text-muted-foreground">{med.dosage} • {med.time}</p>
                    </div>
                    {med.taken ? (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Taken
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleTakeMedication(med.name)}
                      >
                        Take
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="hg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Upcoming</CardTitle>
                <Calendar className="w-5 h-5 text-[#2F6BFF]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((apt, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={apt.avatar || undefined} />
                      <AvatarFallback className="bg-[#2F6BFF]/10 text-[#2F6BFF]">
                        {apt.doctor.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{apt.doctor}</p>
                      <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {apt.date} at {apt.time}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {apt.type}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-[#2F6BFF]">
                View all appointments
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Health Goals */}
          <Card className="hg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Daily Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Steps', current: 8432, target: 10000, color: 'bg-green-500' },
                  { label: 'Water', current: 5, target: 8, color: 'bg-blue-500' },
                  { label: 'Sleep', current: 7.4, target: 8, color: 'bg-purple-500' },
                ].map((goal, index) => {
                  const progress = Math.round((goal.current / goal.target) * 100);
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{goal.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {goal.current} / {goal.target}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${goal.color} transition-all duration-500`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="hg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex-col h-auto py-4 rounded-xl" onClick={() => setCurrentView('diagnosis-history')}>
                  <History className="w-5 h-5 mb-2" />
                  <span className="text-xs">History</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-4 rounded-xl" onClick={() => setCurrentView('ai-insights')}>
                  <Brain className="w-5 h-5 mb-2" />
                  <span className="text-xs">AI Insights</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-4 rounded-xl" onClick={() => setCurrentView('nutrition')}>
                  <Apple className="w-5 h-5 mb-2" />
                  <span className="text-xs">Nutrition</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-4 rounded-xl" onClick={() => setCurrentView('diet-plans')}>
                  <Utensils className="w-5 h-5 mb-2" />
                  <span className="text-xs">Diet Plans</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-4 rounded-xl" onClick={() => setCurrentView('medicine-reminders')}>
                  <Pill className="w-5 h-5 mb-2" />
                  <span className="text-xs">Meds</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-4 rounded-xl" onClick={() => setCurrentView('doctor-reviews')}>
                  <Sparkles className="w-5 h-5 mb-2" />
                  <span className="text-xs">Reviews</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
