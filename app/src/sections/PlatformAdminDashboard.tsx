import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, 
  Building2, 
  Shield, 
  Activity,
  TrendingUp,
  CheckCircle2,
  Server,
  Database,
  Search,
  Lock,
  Key,
  Star,
  Tag,
  Percent,
  Edit3,
  Plus,
  Trash2,
  UserPlus,
  XCircle,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
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
const platformGrowthData = [
  { month: 'Jan', users: 1200, clinics: 45 },
  { month: 'Feb', users: 1500, clinics: 52 },
  { month: 'Mar', users: 2100, clinics: 68 },
  { month: 'Apr', users: 2800, clinics: 85 },
  { month: 'May', users: 3500, clinics: 102 },
  { month: 'Jun', users: 4200, clinics: 128 },
];

const systemHealthData = [
  { time: '00:00', cpu: 45, memory: 62 },
  { time: '04:00', cpu: 38, memory: 58 },
  { time: '08:00', cpu: 65, memory: 72 },
  { time: '12:00', cpu: 78, memory: 81 },
  { time: '16:00', cpu: 72, memory: 76 },
  { time: '20:00', cpu: 58, memory: 68 },
];

const clinics = [
  { id: 1, name: 'City Health Group', location: 'New York, NY', users: 450, status: 'active', plan: 'Enterprise', joined: '2023-01-15', admin: 'Dr. Sarah Johnson' },
  { id: 2, name: 'Metro Medical Center', location: 'Los Angeles, CA', users: 320, status: 'active', plan: 'Professional', joined: '2023-03-20', admin: 'Dr. Michael Chen' },
  { id: 3, name: 'Regional Care Network', location: 'Chicago, IL', users: 280, status: 'pending', plan: 'Enterprise', joined: 'Pending', admin: 'Pending Approval' },
  { id: 4, name: 'Coastal Health Partners', location: 'Miami, FL', users: 195, status: 'suspended', plan: 'Professional', joined: '2023-06-01', admin: 'Dr. Emily Davis' },
];

const bargainRequests = [
  { id: 1, clinic: 'City Health Group', requestedPlan: 'Enterprise', originalPrice: 999, offeredPrice: 799, reason: 'Non-profit hospital, budget constraints', requestedBy: 'Dr. Sarah Johnson', status: 'pending' },
  { id: 2, clinic: 'Metro Medical', requestedPlan: 'Professional', originalPrice: 299, offeredPrice: 249, reason: 'New clinic, startup discount', requestedBy: 'Dr. Michael Chen', status: 'pending' },
  { id: 3, clinic: 'Regional Care', requestedPlan: 'Enterprise', originalPrice: 999, offeredPrice: 899, reason: 'Multi-location discount', requestedBy: 'Admin', status: 'approved' },
];

const specialOffers = [
  { id: 1, name: 'New Year Special', discount: 20, code: 'NEWYEAR20', validUntil: '2026-01-31', usage: 145, active: true },
  { id: 2, name: 'Healthcare Worker Discount', discount: 15, code: 'HERO15', validUntil: '2026-12-31', usage: 892, active: true },
  { id: 3, name: 'Student Discount', discount: 25, code: 'STUDENT25', validUntil: '2026-06-30', usage: 234, active: false },
];

const pricingPlans = [
  { id: 'starter', name: 'Starter', price: 0, features: ['Basic AI triage', 'Up to 100 patients', 'Email support'], active: true },
  { id: 'professional', name: 'Professional', price: 29, features: ['Advanced automation', 'Up to 1,000 patients', 'Priority support', 'API access'], active: true },
  { id: 'enterprise', name: 'Enterprise', price: 99, features: ['Unlimited patients', 'Custom integrations', 'Dedicated support', 'SLA guarantee'], active: true },
];

const platformAdmins = [
  { id: 1, name: 'Super Admin', email: 'admin@healthguard.ai', role: 'super', lastActive: 'Just now' },
  { id: 2, name: 'John Manager', email: 'john@healthguard.ai', role: 'manager', lastActive: '2 hours ago' },
  { id: 3, name: 'Lisa Support', email: 'lisa@healthguard.ai', role: 'support', lastActive: '1 day ago' },
];

const doctorReviews = [
  { id: 1, doctor: 'Dr. Sarah Johnson', clinic: 'City Health Group', patient: 'John Smith', rating: 5, comment: 'Excellent care', status: 'approved' },
  { id: 2, doctor: 'Dr. Michael Chen', clinic: 'Metro Medical', patient: 'Mary Brown', rating: 2, comment: 'Wait time too long', status: 'flagged' },
  { id: 3, doctor: 'Dr. Emily Davis', clinic: 'City Health Group', patient: 'David Lee', rating: 5, comment: 'Very professional', status: 'approved' },
];

export function PlatformAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      approved: 'bg-green-100 text-green-700',
      flagged: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const handleApproveClinic = (_id: number) => {
    toast.success('Clinic approved successfully');
  };

  const handleApproveBargain = (_id: number) => {
    toast.success('Bargain request approved');
  };

  const handleRejectBargain = (_id: number) => {
    toast.info('Bargain request rejected');
  };

  const handleToggleOffer = (_id: number) => {
    toast.success('Offer status updated');
  };

  const handleAddAdmin = () => {
    toast.success('New admin added');
    setShowAddAdminDialog(false);
  };

  const handleRemoveAdmin = (_id: number) => {
    toast.info('Admin removed');
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Platform Administrator
            </p>
            <h1 className="text-3xl font-bold text-[#0B1B2D] dark:text-white">
              System Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl">
              <Server className="w-4 h-4 mr-2" />
              System Status
            </Button>
            <Button className="hg-btn-primary">
              <Building2 className="w-4 h-4 mr-2" />
              Add Clinic
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: '4,200', change: '+18%', icon: Users, color: 'text-blue-500' },
          { label: 'Active Clinics', value: '128', change: '+12', icon: Building2, color: 'text-green-500' },
          { label: 'System Uptime', value: '99.9%', change: 'Last 30 days', icon: Activity, color: 'text-amber-500' },
          { label: 'Security Score', value: '98/100', change: 'Excellent', icon: Shield, color: 'text-purple-500' },
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
          <TabsTrigger value="clinics">Clinics</TabsTrigger>
          <TabsTrigger value="bargains">Bargains</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Platform Growth */}
            <Card className="hg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Platform Growth</CardTitle>
                    <CardDescription>Users and clinics over time</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +250%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={platformGrowthData}>
                      <defs>
                        <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
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
                        dataKey="users" 
                        stroke="#2F6BFF" 
                        strokeWidth={2}
                        fill="url(#usersGradient)" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="clinics" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={{ fill: '#10B981', strokeWidth: 0, r: 3 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="hg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">System Health</CardTitle>
                    <CardDescription>CPU and memory usage (24h)</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={systemHealthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="cpu" 
                        stroke="#2F6BFF" 
                        strokeWidth={2}
                        name="CPU %"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="memory" 
                        stroke="#F59E0B" 
                        strokeWidth={2}
                        name="Memory %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clinics" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clinics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button>
              <Building2 className="w-4 h-4 mr-2" />
              Add Clinic
            </Button>
          </div>

          <div className="space-y-4">
            {clinics.map((clinic) => (
              <Card key={clinic.id} className="hg-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#2F6BFF]/10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-[#2F6BFF]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{clinic.name}</h3>
                          <Badge className={getStatusBadge(clinic.status)}>{clinic.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{clinic.location}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm">
                          <span>{clinic.users} users</span>
                          <Badge variant="outline">{clinic.plan}</Badge>
                          <span className="text-muted-foreground">Admin: {clinic.admin}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {clinic.status === 'pending' && (
                        <Button onClick={() => handleApproveClinic(clinic.id)}>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      <Button variant="outline" size="icon">
                        <Edit3 className="w-4 h-4" />
                      </Button>
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
                        <h3 className="font-semibold">{bargain.clinic}</h3>
                        <Badge variant="outline">{bargain.requestedPlan}</Badge>
                        <Badge className={getStatusBadge(bargain.status)}>{bargain.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Requested by: {bargain.requestedBy}</p>
                      <p className="text-sm mt-1">{bargain.reason}</p>
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
                        <Button variant="outline" onClick={() => handleRejectBargain(bargain.id)}>
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button onClick={() => handleApproveBargain(bargain.id)}>
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

        <TabsContent value="pricing" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <Card key={plan.id} className="hg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    <Switch checked={plan.active} />
                  </div>
                  <CardDescription>
                    <span className="text-2xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1">
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Special Offers & Discounts</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Offer
            </Button>
          </div>

          <div className="space-y-4">
            {specialOffers.map((offer) => (
              <Card key={offer.id} className="hg-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                        <Tag className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{offer.name}</h3>
                          {offer.active ? (
                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant="outline" className="text-lg">
                            <Percent className="w-3 h-3 mr-1" />
                            {offer.discount}% OFF
                          </Badge>
                          <code className="bg-secondary px-2 py-1 rounded text-sm">{offer.code}</code>
                          <span className="text-sm text-muted-foreground">Valid until {offer.validUntil}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Used {offer.usage} times</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={offer.active}
                        onCheckedChange={() => handleToggleOffer(offer.id)}
                      />
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
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
                        <span className="text-sm text-muted-foreground">({review.clinic})</span>
                        <Badge className={getStatusBadge(review.status)}>{review.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">by {review.patient}</p>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="admins" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Platform Administrators</h3>
            <Button onClick={() => setShowAddAdminDialog(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Admin
            </Button>
          </div>

          <div className="space-y-4">
            {platformAdmins.map((admin) => (
              <Card key={admin.id} className="hg-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-[#2F6BFF]/10 text-[#2F6BFF]">
                          {admin.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{admin.name}</h3>
                          <Badge variant={admin.role === 'super' ? 'default' : 'secondary'}>
                            {admin.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                        <p className="text-xs text-muted-foreground">Last active: {admin.lastActive}</p>
                      </div>
                    </div>
                    {admin.role !== 'super' && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveAdmin(admin.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hg-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Encryption</p>
                    <p className="text-xs text-muted-foreground">AES-256</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </CardContent>
            </Card>
            <Card className="hg-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Key className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">2FA Enabled</p>
                    <p className="text-xs text-muted-foreground">98% of users</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700">Compliant</Badge>
              </CardContent>
            </Card>
            <Card className="hg-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Database className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Last Backup</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-700">Current</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Admin Dialog */}
      <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Administrator</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Name</Label>
              <Input placeholder="Full name" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="admin@healthguard.ai" />
            </div>
            <div>
              <Label>Role</Label>
              <Input placeholder="manager, support, etc." />
            </div>
            <Button onClick={handleAddAdmin} className="w-full hg-btn-primary">
              Add Administrator
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
