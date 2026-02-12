import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  ClipboardList, 
  HeartPulse, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Phone,
  MapPin,
  Thermometer,
  Activity,
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

// Mock data
const vitalsData = [
  { time: '08:00', bp: 120, hr: 72 },
  { time: '10:00', bp: 118, hr: 70 },
  { time: '12:00', bp: 122, hr: 74 },
  { time: '14:00', bp: 119, hr: 71 },
  { time: '16:00', bp: 121, hr: 73 },
];

const tasks = [
  { 
    id: 1, 
    title: 'Check vitals - Room 302', 
    patient: 'Sarah Johnson', 
    priority: 'high', 
    completed: false,
    time: '9:00 AM',
  },
  { 
    id: 2, 
    title: 'Administer medication', 
    patient: 'Michael Chen', 
    priority: 'high', 
    completed: true,
    time: '9:30 AM',
  },
  { 
    id: 3, 
    title: 'Assist with mobility', 
    patient: 'Robert Wilson', 
    priority: 'medium', 
    completed: false,
    time: '10:00 AM',
  },
  { 
    id: 4, 
    title: 'Update patient records', 
    patient: 'Emily Davis', 
    priority: 'low', 
    completed: false,
    time: '11:00 AM',
  },
  { 
    id: 5, 
    title: 'Prepare discharge papers', 
    patient: 'Lisa Anderson', 
    priority: 'medium', 
    completed: false,
    time: '2:00 PM',
  },
];

const assignedPatients = [
  { 
    name: 'Sarah Johnson', 
    room: '302', 
    condition: 'Post-surgery recovery',
    vitals: { temp: '98.6°F', bp: '120/80', hr: '72' },
    status: 'stable',
    lastChecked: '30 min ago',
  },
  { 
    name: 'Michael Chen', 
    room: '305', 
    condition: 'Cardiac monitoring',
    vitals: { temp: '99.1°F', bp: '135/85', hr: '78' },
    status: 'monitoring',
    lastChecked: '1 hour ago',
  },
  { 
    name: 'Robert Wilson', 
    room: '310', 
    condition: 'Diabetes management',
    vitals: { temp: '98.4°F', bp: '128/82', hr: '70' },
    status: 'stable',
    lastChecked: '2 hours ago',
  },
  { 
    name: 'Emily Davis', 
    room: '315', 
    condition: 'Respiratory therapy',
    vitals: { temp: '100.2°F', bp: '118/75', hr: '82' },
    status: 'attention',
    lastChecked: '15 min ago',
  },
];

export function HealthcareWorkerDashboard() {
  const { user } = useApp();
  const [taskList, setTaskList] = useState(tasks);
  const [selectedPatient, setSelectedPatient] = useState(assignedPatients[0]);

  const toggleTask = (taskId: number) => {
    setTaskList(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    const task = taskList.find(t => t.id === taskId);
    if (task) {
      toast.success(task.completed ? 'Task marked incomplete' : 'Task completed!');
    }
  };

  const completedCount = taskList.filter(t => t.completed).length;
  const progress = (completedCount / taskList.length) * 100;

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      stable: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      monitoring: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      attention: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Welcome, {user?.name?.split(' ')[0] || 'Demo'}
            </p>
            <h1 className="text-3xl font-bold text-[#0B1B2D] dark:text-white">
              Care Team Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl">
              <Calendar className="w-4 h-4 mr-2" />
              My Schedule
            </Button>
            <Button className="hg-btn-primary">
              <HeartPulse className="w-4 h-4 mr-2" />
              Log Vitals
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Assigned Patients', value: '12', icon: HeartPulse, color: 'text-red-500' },
          { label: 'Tasks Today', value: taskList.length.toString(), icon: ClipboardList, color: 'text-blue-500' },
          { label: 'Completed', value: completedCount.toString(), icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Pending', value: (taskList.length - completedCount).toString(), icon: Clock, color: 'text-amber-500' },
        ].map((stat, index) => (
          <Card key={index} className="hg-card hg-card-hover">
            <CardContent className="p-5">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
              <p className="text-2xl font-bold text-[#0B1B2D] dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Tasks */}
        <div className="space-y-6">
          <Card className="hg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Today's Tasks</CardTitle>
                  <CardDescription>Your assigned care tasks</CardDescription>
                </div>
                <Badge variant="secondary">
                  {completedCount}/{taskList.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="mb-4" />
              <div className="space-y-2">
                {taskList.map((task) => (
                  <div 
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      task.completed 
                        ? 'bg-secondary/30 border-transparent' 
                        : 'bg-secondary/50 border-border hover:border-[#2F6BFF]/30'
                    }`}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{task.patient}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{task.time}</span>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
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
                <Button variant="outline" className="flex-col h-auto py-4 rounded-xl">
                  <Phone className="w-5 h-5 mb-2" />
                  <span className="text-xs">Call Patient</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-4 rounded-xl">
                  <MessageSquare className="w-5 h-5 mb-2" />
                  <span className="text-xs">Message Team</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-4 rounded-xl">
                  <MapPin className="w-5 h-5 mb-2" />
                  <span className="text-xs">Locate Patient</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-4 rounded-xl">
                  <Activity className="w-5 h-5 mb-2" />
                  <span className="text-xs">Emergency</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Patient List */}
        <div className="space-y-6">
          <Card className="hg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Assigned Patients</CardTitle>
              <CardDescription>Click to view details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignedPatients.map((patient, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPatient.name === patient.name
                        ? 'border-[#2F6BFF] bg-[#2F6BFF]/5'
                        : 'border-border bg-secondary/50 hover:border-[#2F6BFF]/30'
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-[#2F6BFF]/10 text-[#2F6BFF]">
                            {patient.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">Room {patient.room}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{patient.condition}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3" />
                        {patient.vitals.temp}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {patient.vitals.bp}
                      </span>
                      <span className="flex items-center gap-1">
                        <HeartPulse className="w-3 h-3" />
                        {patient.vitals.hr}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Patient Details */}
        <div className="space-y-6">
          <Card className="hg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedPatient.name}</CardTitle>
                  <CardDescription>Room {selectedPatient.room}</CardDescription>
                </div>
                <Badge className={getStatusColor(selectedPatient.status)}>
                  {selectedPatient.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current Vitals */}
                <div>
                  <p className="text-sm font-medium mb-3">Current Vitals</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-secondary/50 text-center">
                      <Thermometer className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                      <p className="text-lg font-bold">{selectedPatient.vitals.temp}</p>
                      <p className="text-xs text-muted-foreground">Temp</p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/50 text-center">
                      <Activity className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                      <p className="text-lg font-bold">{selectedPatient.vitals.bp}</p>
                      <p className="text-xs text-muted-foreground">BP</p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/50 text-center">
                      <HeartPulse className="w-5 h-5 mx-auto mb-1 text-red-500" />
                      <p className="text-lg font-bold">{selectedPatient.vitals.hr}</p>
                      <p className="text-xs text-muted-foreground">HR</p>
                    </div>
                  </div>
                </div>

                {/* Vitals Chart */}
                <div>
                  <p className="text-sm font-medium mb-3">Blood Pressure Trend</p>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={vitalsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
                        <YAxis stroke="#6B7280" fontSize={10} domain={[110, 130]} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                          }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="bp" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          dot={{ fill: '#3B82F6', strokeWidth: 0, r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button className="flex-1 hg-btn-primary">
                    <HeartPulse className="w-4 h-4 mr-2" />
                    Log Vitals
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="hg-card border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <CardTitle className="text-lg">Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    Emily Davis - Elevated Temperature
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">
                    Temperature above normal range. Monitor closely.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    Michael Chen - BP Check Due
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                    Blood pressure monitoring every 2 hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
