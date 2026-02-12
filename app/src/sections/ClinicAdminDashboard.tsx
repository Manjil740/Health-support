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
  TrendingUp, 
  DollarSign,
  Building2,
  Stethoscope,
  Plus,
  Star,
  HandCoins,
  CheckCircle2,
  XCircle,
  Search,
  Edit2,
  UserPlus,
  UserMinus,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { toast } from 'sonner';

// Mock data
const revenueData = [
  { month: 'Jan', revenue: 45000, target: 42000 },
  { month: 'Feb', revenue: 52000, target: 45000 },
  { month: 'Mar', revenue: 48000, target: 48000 },
  { month: 'Apr', revenue: 61000, target: 50000 },
  { month: 'May', revenue: 58000, target: 55000 },
  { month: 'Jun', revenue: 67000, target: 60000 },
];



const staffDistribution = [
  { name: 'Doctors', value: 12, color: '#2F6BFF' },
  { name: 'Nurses', value: 28, color: '#10B981' },
  { name: 'Admin', value: 8, color: '#F59E0B' },
  { name: 'Support', value: 15, color: '#6B7280' },
];

const doctors = [
  { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', status: 'active', patients: 145, rating: 4.8, revenue: 45000, appointments: 320, joined: '2023-01-15' },
  { id: 2, name: 'Dr. Michael Chen', specialty: 'General Practitioner', status: 'active', patients: 210, rating: 4.6, revenue: 38000, appointments: 450, joined: '2023-03-20' },
  { id: 3, name: 'Dr. Emily Davis', specialty: 'Pediatrician', status: 'active', patients: 180, rating: 4.9, revenue: 42000, appointments: 380, joined: '2023-02-10' },
  { id: 4, name: 'Dr. Robert Wilson', specialty: 'Dermatologist', status: 'on-leave', patients: 95, rating: 4.5, revenue: 28000, appointments: 210, joined: '2023-06-01' },
];

const doctorReviews = [
  { id: 1, doctor: 'Dr. Sarah Johnson', patient: 'John Smith', rating: 5, date: '2026-02-10', comment: 'Excellent care and very thorough.', status: 'approved' },
  { id: 2, doctor: 'Dr. Michael Chen', patient: 'Mary Brown', rating: 4, date: '2026-02-08', comment: 'Good experience, slightly long wait.', status: 'pending' },
  { id: 3, doctor: 'Dr. Emily Davis', patient: 'David Lee', rating: 5, date: '2026-02-05', comment: 'Amazing with kids! Highly recommend.', status: 'approved' },
  { id: 4, doctor: 'Dr. Sarah Johnson', patient: 'Lisa Wong', rating: 3, date: '2026-02-01', comment: 'Rushed appointment.', status: 'flagged' },
];

const bargainRequests = [
  { id: 1, patient: 'John Smith', requestedPlan: 'Professional', originalPrice: 29, offeredPrice: 19, reason: 'Long-term patient, financial hardship', status: 'pending' },
  { id: 2, patient: 'Family Plan - Johnson', requestedPlan: 'Enterprise', originalPrice: 99, offeredPrice: 79, reason: 'Family of 4, group discount request', status: 'approved' },
  { id: 3, patient: 'Sarah Williams', requestedPlan: 'Professional', originalPrice: 29, offeredPrice: 24, reason: 'Student discount', status: 'pending' },
];

const doctorPayments = [
  { id: 1, doctor: 'Dr. Sarah Johnson', period: 'Feb 2026', baseSalary: 15000, commission: 4500, bonus: 1000, total: 20500, status: 'pending' },
  { id: 2, doctor: 'Dr. Michael Chen', period: 'Feb 2026', baseSalary: 12000, commission: 3800, bonus: 0, total: 15800, status: 'paid' },
  { id: 3, doctor: 'Dr. Emily Davis', period: 'Feb 2026', baseSalary: 14000, commission: 4200, bonus: 1500, total: 19700, status: 'pending' },
];

const roomStatus = [
  { room: '101', type: 'Examination', status: 'occupied', patient: 'Sarah Johnson', doctor: 'Dr. Chen' },
  { room: '102', type: 'Examination', status: 'available', patient: null, doctor: null },
  { room: '103', type: 'Procedure', status: 'occupied', patient: 'Michael Brown', doctor: 'Dr. Johnson' },
  { room: '104', type: 'Examination', status: 'cleaning', patient: null, doctor: null },
  { room: '105', type: 'Consultation', status: 'available', patient: null, doctor: null },
];

export function ClinicAdminDashboard() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'active': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'on-leave': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      'inactive': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      'pending': 'bg-amber-100 text-amber-700',
      'approved': 'bg-green-100 text-green-700',
      'flagged': 'bg-red-100 text-red-700',
      'paid': 'bg-green-100 text-green-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getRoomStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      occupied: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      available: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      cleaning: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const handleApproveReview = (_id: number) => {
    toast.success('Review approved');
  };

  const handleApproveBargain = (_id: number) => {
    toast.success('Bargain request approved');
  };

  const handleRejectBargain = (_id: number) => {
    toast.info('Bargain request rejected');
  };

  const handlePayDoctor = (_id: number) => {
    toast.success('Payment processed');
  };

  const handleRemoveDoctor = (_id: number) => {
    toast.info('Doctor removed from clinic');
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
            </p>
            <h1 className="text-3xl font-bold text-[#0B1B2D] dark:text-white">
              Clinic Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl">
              <Building2 className="w-4 h-4 mr-2" />
              Manage Rooms
            </Button>
            <Button className="hg-btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Doctor
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Doctors', value: '12', change: '+2', icon: Stethoscope, color: 'text-blue-500' },
          { label: "Today's Appointments", value: '45', change: '92% completion', icon: Calendar, color: 'text-green-500' },
          { label: 'Monthly Revenue', value: '$67K', change: '+12%', icon: DollarSign, color: 'text-amber-500' },
          { label: 'Avg Rating', value: '4.7', change: '+0.2', icon: Star, color: 'text-purple-500' },
        ].map((stat, index) => (
          <Card key={index} className="hg-card hg-card-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs font-medium text-green-500">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-[#0B1B2D] dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="bargains">Bargains</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <Card className="hg-card lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue vs target</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2F6BFF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2F6BFF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#2F6BFF" 
                        strokeWidth={2}
                        fill="url(#revenueGradient)" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Staff Distribution */}
            <Card className="hg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Staff Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={staffDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        dataKey="value"
                      >
                        {staffDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {staffDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="doctors" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Doctor
            </Button>
          </div>

          <div className="space-y-4">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="hg-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarFallback className="bg-[#2F6BFF]/10 text-[#2F6BFF] text-lg">
                          {doctor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{doctor.name}</h3>
                          <Badge className={getStatusBadge(doctor.status)}>{doctor.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {doctor.patients} patients
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400" />
                            {doctor.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {doctor.appointments} appts
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">${doctor.revenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Revenue this month</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleRemoveDoctor(doctor.id)}
                        >
                          <UserMinus className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <div className="space-y-4">
            {doctorReviews.map((review) => (
              <Card key={review.id} className="hg-card">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{review.doctor}</h3>
                        <Badge className={getStatusBadge(review.status)}>{review.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">by {review.patient} • {review.date}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-sm">{review.comment}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleApproveReview(review.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="space-y-4">
            {doctorPayments.map((payment) => (
              <Card key={payment.id} className="hg-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-[#2F6BFF]/10 text-[#2F6BFF]">
                          {payment.doctor.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{payment.doctor}</h3>
                        <p className="text-sm text-muted-foreground">{payment.period}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Base Salary</p>
                        <p className="font-medium">${payment.baseSalary.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Commission</p>
                        <p className="font-medium">${payment.commission.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Bonus</p>
                        <p className="font-medium">${payment.bonus.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-lg font-bold text-[#2F6BFF]">${payment.total.toLocaleString()}</p>
                      </div>
                      <Badge className={getStatusBadge(payment.status)}>{payment.status}</Badge>
                      {payment.status === 'pending' && (
                        <Button onClick={() => handlePayDoctor(payment.id)}>
                          <HandCoins className="w-4 h-4 mr-2" />
                          Pay
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bargains" className="space-y-6">
          <div className="space-y-4">
            {bargainRequests.map((bargain) => (
              <Card key={bargain.id} className="hg-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{bargain.patient}</h3>
                        <Badge variant="outline">{bargain.requestedPlan}</Badge>
                        <Badge className={getStatusBadge(bargain.status)}>{bargain.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{bargain.reason}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm line-through text-muted-foreground">${bargain.originalPrice}/mo</span>
                        <span className="text-lg font-bold text-green-600">${bargain.offeredPrice}/mo</span>
                        <Badge className="bg-green-100 text-green-700">
                          Save ${bargain.originalPrice - bargain.offeredPrice}/mo
                        </Badge>
                      </div>
                    </div>
                    {bargain.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => handleRejectBargain(bargain.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          onClick={() => handleApproveBargain(bargain.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomStatus.map((room, index) => (
              <Card key={index} className="hg-card">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold">{room.room}</p>
                      <p className="text-sm text-muted-foreground">{room.type}</p>
                    </div>
                    <Badge className={getRoomStatusBadge(room.status)}>
                      {room.status}
                    </Badge>
                  </div>
                  {room.patient && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{room.patient}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{room.doctor}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
