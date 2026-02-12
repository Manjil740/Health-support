import { useApp } from '@/App';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings, 
  User, 
  LogOut,
  Sparkles,
  Activity,
  ClipboardList,
  BarChart3,
  Shield,
  Building2,
  HeartPulse,
  Leaf,
  CreditCard,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Brain,
  History,
  Video,
  AlertTriangle,
  Apple,
  Utensils,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const navigation: Record<string, { name: string; icon: React.ElementType; view: string }[]> = {
  patient: [
    { name: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
    { name: 'Appointments', icon: Calendar, view: 'appointments' },
    { name: 'Video Call', icon: Video, view: 'video-call' },
    { name: 'AI Insights', icon: Brain, view: 'ai-insights' },
    { name: 'Diagnosis History', icon: History, view: 'diagnosis-history' },
    { name: 'Medicine Reminders', icon: Clock, view: 'medicine-reminders' },
    { name: 'Nutrition', icon: Apple, view: 'nutrition' },
    { name: 'Diet Plans', icon: Utensils, view: 'diet-plans' },
    { name: 'Doctor Reviews', icon: Star, view: 'doctor-reviews' },
    { name: 'Emergency', icon: AlertTriangle, view: 'emergency' },
  ],
  doctor: [
    { name: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
    { name: 'Patients', icon: Users, view: 'patients' },
    { name: 'Schedule', icon: Calendar, view: 'schedule' },
    { name: 'Video Call', icon: Video, view: 'video-call' },
    { name: 'AI Insights', icon: Brain, view: 'ai-insights' },
    { name: 'Messages', icon: MessageSquare, view: 'messages' },
    { name: 'Reviews', icon: Star, view: 'doctor-reviews' },
    { name: 'Reports', icon: ClipboardList, view: 'reports' },
  ],
  healthcare_worker: [
    { name: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
    { name: 'Patient Care', icon: HeartPulse, view: 'care' },
    { name: 'Tasks', icon: ClipboardList, view: 'tasks' },
    { name: 'Vitals', icon: Activity, view: 'vitals' },
    { name: 'Video Call', icon: Video, view: 'video-call' },
    { name: 'Messages', icon: MessageSquare, view: 'messages' },
    { name: 'Emergency', icon: AlertTriangle, view: 'emergency' },
  ],
  clinic_admin: [
    { name: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
    { name: 'Staff', icon: Users, view: 'staff' },
    { name: 'Doctor Reviews', icon: Star, view: 'doctor-reviews' },
    { name: 'Appointments', icon: Calendar, view: 'appointments' },
    { name: 'Video Calls', icon: Video, view: 'video-call' },
    { name: 'Analytics', icon: BarChart3, view: 'analytics' },
    { name: 'Billing', icon: CreditCard, view: 'billing' },
    { name: 'Bargain Requests', icon: Sparkles, view: 'bargains' },
  ],
  platform_admin: [
    { name: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
    { name: 'Users', icon: Users, view: 'users' },
    { name: 'Clinics', icon: Building2, view: 'clinics' },
    { name: 'Doctor Reviews', icon: Star, view: 'doctor-reviews' },
    { name: 'Bargain Approvals', icon: Sparkles, view: 'bargains' },
    { name: 'Pricing & Offers', icon: CreditCard, view: 'pricing-offers' },
    { name: 'Analytics', icon: BarChart3, view: 'analytics' },
    { name: 'Security', icon: Shield, view: 'security' },
    { name: 'Landing Page', icon: FileText, view: 'landing-editor' },
  ],
};

const bottomNav = [
  { name: 'Notifications', icon: Bell, view: 'notifications' },
  { name: 'Help', icon: HelpCircle, view: 'help' },
];

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const { 
    currentRole, 
    setIsAuthenticated, 
    setCurrentRole, 
    setUser, 
    setCurrentView,
    currentView,
    demoMode,
  } = useApp();

  const roleNav = currentRole ? navigation[currentRole] : navigation.patient;

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentRole(null);
    setUser(null);
    setCurrentView('landing');
    toast.success('Logged out successfully');
  };

  const handleNavClick = (view: string) => {
    setCurrentView(view);
  };

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-white dark:bg-[#0B1B2D] border-r border-border z-40 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2F6BFF] rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="font-semibold text-[#0B1B2D] dark:text-white truncate">
                HealthGuard
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Main Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="px-3 space-y-1">
            {roleNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.view)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#2F6BFF]/10 text-[#2F6BFF]'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Impact Link */}
          <div className="px-3 mt-6">
            {!collapsed && (
              <p className="px-3 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Impact
              </p>
            )}
            <button
              onClick={() => handleNavClick('impact')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                currentView === 'impact'
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
              title={collapsed ? 'Impact' : undefined}
            >
              <Leaf className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">Sustainability</span>
              )}
            </button>
          </div>
        </ScrollArea>

        {/* Bottom Navigation */}
        <div className="p-3 border-t border-border space-y-1">
          {bottomNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.view)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                title={collapsed ? item.name : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </button>
            );
          })}
          
          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              currentView === 'settings'
                ? 'bg-[#2F6BFF]/10 text-[#2F6BFF]'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium">Settings</span>
            )}
          </button>
          
          <button
            onClick={() => handleNavClick('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              currentView === 'profile'
                ? 'bg-[#2F6BFF]/10 text-[#2F6BFF]'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
            title={collapsed ? 'Profile' : undefined}
          >
            <User className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium">Profile</span>
            )}
          </button>
          
          {!demoMode && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
              title={collapsed ? 'Logout' : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
