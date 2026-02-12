import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock3,
  ChevronRight,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { toast } from 'sonner';

// Mock data
const patientVisitsData = [
  { day: 'Mon', visits: 12 },
  { day: 'Tue', visits: 18 },
  { day: 'Wed', visits: 15 },
  { day: 'Thu', visits: 22 },
  { day: 'Fri', visits: 19 },
  { day: 'Sat', visits: 8 },
  { day: 'Sun', visits: 5 },
];

const conditionDistribution = [
  { name: 'Cardiovascular', value: 35, color: '#EF4444' },
  { name: 'Respiratory', value: 25, color: '#3B82F6' },
  { name: 'Diabetes', value: 20, color: '#10B981' },
  { name: 'Other', value: 20, color: '#6B7280' },
];

const todayAppointments = [
  {
    id: 1,
    patient: 'Sarah Johnson',
    age: 58,
    time: '9:00 AM',
    duration: '30 min',
    type: 'Follow-up',
    status: 'completed',
    concern: 'Hypertension management',
    vitals: { bp: '128/82', hr: 72 },
    aiRisk: 'low',
  },
  {
    id: 2,
    patient: 'Michael Chen',
    age: 45,
    time: '9:30 AM',
    duration: '45 min',
    type: 'New Patient',
    status: 'in-progress',
    concern: 'Chest pain evaluation',
    vitals: { bp: '135/88', hr: 78 },
    aiRisk: 'medium',
  },
  {
    id: 3,
    patient: 'Emily Davis',
    age: 32,
    time: '10:30 AM',
    duration: '20 min',
    type: 'Check-up',
    status: 'waiting',
    concern: 'Annual physical',
    vitals: null,
    aiRisk: 'low',
  },
  {
    id: 4,
    patient: 'Robert Wilson',
    age: 67,
    time: '11:00 AM',
    duration: '30 min',
    type: 'Follow-up',
    status: 'waiting',
    concern: 'Diabetes monitoring',
    vitals: null,
    aiRisk: 'high',
  },
];

const recentPatients = [
  { name: 'Sarah Johnson', lastVisit: 'Today', condition: 'Hypertension', status: 'stable' },
  { name: 'Michael Chen', lastVisit: 'Today', condition: 'Chest pain', status: 'monitoring' },
  { name: 'Emily Davis', lastVisit: '3 days ago', condition: 'Healthy', status: 'good' },
  { name: 'Robert Wilson', lastVisit: '1 week ago', condition: 'Diabetes Type 2', status: 'attention' },
  { name: 'Lisa Anderson', lastVisit: '2 weeks ago', condition: 'Asthma', status: 'stable' },
];

const aiAlerts = [
  {
    patient: 'Robert Wilson',
    alert: 'Elevated glucose trend detected',
    recommendation: 'Consider HbA1c test',
    confidence: 89,
    priority: 'high',
  },
  {
    patient: 'Michael Chen',
    alert: 'Risk factors for cardiac event',
    recommendation: 'ECG recommended',
    confidence: 76,
    priority: 'medium',
  },
];

// Get user display name
const getUserDisplayName = (user: any) => {
  if (!user) return 'Doctor';
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  if (user.name) {
    return user.name;
  }
  if (user.username) {
    return user.username;
  }
  return 'Doctor';
};

export function DoctorDashboard() {
  const { user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('today');

  const handlePatientClick = (patientName: string) => {
    toast.info(`Opening ${patientName}'s profile`);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      waiting: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getRiskBadge = (risk: string) => {
    const styles: Record<string, string> = {
      low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return styles[risk] || 'bg-gray-100 text-gray-700';
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Welcome back, {getUserDisplayName(user)}
            </p>
            <h1 className="text-3xl font-bold text-[#0B1B2D] dark:text-white">
              Doctor Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
            <Button className="hg-btn-primary">
              <Users className="w-4 h-4 mr-2" />
              New Patient
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Patients", value: '12', change: '+3', icon: Users, color: 'text-blue-500' },
          { label: 'Pending Reviews', value: '5', change: '2 urgent', icon: FileText, color: 'text-amber-500' },
          { label: 'Messages', value: '8', change: '3 new', icon: MessageSquare, color: 'text-green-500' },
          { label: 'Avg. Visit Time', value: '28m', change: '-2m', icon: Clock, color: 'text-purple-500' },
        ].map((stat, index) => (
          <Card key={index} className="hg-card hg-card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-[#0B1B2D] dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointments Tabs */}
          <Card className="hg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Appointments</CardTitle>
                  <CardDescription>Manage your schedule</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-48"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="requests">Requests (3)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="today" className="space-y-3">
                  {todayAppointments.map((apt) => (
                    <div 
                      key={apt.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                      onClick={() => handlePatientClick(apt.patient)}
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-[#2F6BFF]/10 text-[#2F6BFF]">
                          {apt.patient.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{apt.patient}</p>
                          <span className="text-xs text-muted-foreground">({apt.age})</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{apt.concern}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{apt.time}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{apt.duration}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskBadge(apt.aiRisk)}>
                          <Sparkles className="w-3 h-3 mr-1" />
                          {apt.aiRisk} risk
                        </Badge>
                        <Badge variant="outline" className={getStatusBadge(apt.status)}>
                          {apt.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="upcoming">
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>3 appointments scheduled for next week</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="requests">
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>3 appointment requests pending approval</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Patient Visits Chart */}
          <Card className="hg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Weekly Patient Visits</CardTitle>
                  <CardDescription>Patient consultation trends</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patientVisitsData}>
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
                    <Bar dataKey="visits" fill="#2F6BFF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AI Clinical Insights */}
          <Card className="hg-card border-[#2F6BFF]/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2F6BFF]" />
                <CardTitle className="text-lg">AI Clinical Insights</CardTitle>
              </div>
              <CardDescription>Patient risk assessments and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiAlerts.map((alert, index) => (
                  <div 
                    key={index}
                    className={`flex items-start gap-4 p-4 rounded-xl border ${
                      alert.priority === 'high' 
                        ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800' 
                        : 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      alert.priority === 'high' 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-amber-100 text-amber-600'
                    }`}>
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{alert.patient}</h4>
                        <Badge 
                          variant={alert.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {alert.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground">{alert.alert}</p>
                      <p className="text-sm text-muted-foreground">{alert.recommendation}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Sparkles className="w-3 h-3 text-[#2F6BFF]" />
                        <span className="text-xs text-muted-foreground">
                          {alert.confidence}% confidence
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="hg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Patient Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={conditionDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {conditionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {conditionDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card className="hg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Patients</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#2F6BFF]">
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPatients.map((patient, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                    onClick={() => handlePatientClick(patient.name)}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-[#2F6BFF]/10 text-[#2F6BFF]">
                        {patient.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">{patient.condition}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        patient.status === 'stable' 
                          ? 'bg-green-100 text-green-700' 
                          : patient.status === 'attention'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {patient.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Summary */}
          <Card className="hg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Completed</p>
                      <p className="text-xs text-muted-foreground">4 appointments</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold">4</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Clock3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Remaining</p>
                      <p className="text-xs text-muted-foreground">8 appointments</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold">8</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Urgent</p>
                      <p className="text-xs text-muted-foreground">2 require attention</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-amber-600">2</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

