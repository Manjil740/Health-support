import { useApp } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Moon, 
  Sun, 
  Sparkles,
  Command,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { clearToken } from '@/lib/api';

interface TopbarProps {
  sidebarCollapsed: boolean;
}

export function Topbar({ sidebarCollapsed }: TopbarProps) {
  const { 
    user, 
    setCurrentView, 
    theme, 
    setTheme, 
    currentRole,
    demoMode,
    setDemoMode,
    setIsAuthenticated,
    setCurrentRole,
    setUser,
  } = useApp();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    clearToken();
    setIsAuthenticated(false);
    setCurrentRole(null);
    setUser(null);
    setCurrentView('landing');
    toast.success('Logged out successfully');
  };

  const getRoleBadge = () => {
    const badges: Record<string, string> = {
      patient: 'Patient',
      doctor: 'Doctor',
      healthcare_worker: 'Healthcare Worker',
      clinic_admin: 'Clinic Admin',
      platform_admin: 'Platform Admin',
    };
    return badges[currentRole || 'patient'];
  };

  const getRoleColor = () => {
    const colors: Record<string, string> = {
      patient: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      doctor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      healthcare_worker: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      clinic_admin: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      platform_admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[currentRole || 'patient'];
  };

  return (
    <header 
      className={`fixed top-0 right-0 h-16 bg-white/80 dark:bg-[#0B1B2D]/80 backdrop-blur-lg border-b border-border z-30 transition-all duration-300 ${
        sidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients, appointments, records..."
              className="pl-10 pr-10 bg-secondary/50 border-0 focus-visible:ring-[#2F6BFF]/30"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#2F6BFF] rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {[
                  { title: 'Appointment confirmed', time: '2 min ago', type: 'success' },
                  { title: 'New lab results available', time: '1 hour ago', type: 'info' },
                  { title: 'Reminder: Check-up tomorrow', time: '3 hours ago', type: 'warning' },
                ].map((notif, index) => (
                  <DropdownMenuItem key={index} className="flex flex-col items-start py-3 cursor-pointer">
                    <span className="font-medium text-sm">{notif.title}</span>
                    <span className="text-xs text-muted-foreground">{notif.time}</span>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Demo Mode Toggle */}
          {demoMode && (
            <Badge 
              variant="secondary" 
              className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Demo
            </Badge>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 py-1 h-auto rounded-xl">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-[#2F6BFF]/10 text-[#2F6BFF]">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user?.name || 'Demo User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || 'demo@healthguard.ai'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                <span>Signed in as</span>
                <Badge className={`text-xs ${getRoleColor()}`}>
                  {getRoleBadge()}
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCurrentView('profile')}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentView('settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!demoMode ? (
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => setDemoMode(false)}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Exit Demo
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
