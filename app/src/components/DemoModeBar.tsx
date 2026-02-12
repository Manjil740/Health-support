import { useApp, type UserRole } from '@/App';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Stethoscope, 
  HeartPulse, 
  Building2, 
  Shield,
  X
} from 'lucide-react';

const roles: { id: UserRole; label: string; icon: React.ElementType }[] = [
  { id: 'patient', label: 'Patient', icon: User },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope },
  { id: 'healthcare_worker', label: 'Healthcare Worker', icon: HeartPulse },
  { id: 'clinic_admin', label: 'Clinic Admin', icon: Building2 },
  { id: 'platform_admin', label: 'Platform Admin', icon: Shield },
];

export function DemoModeBar() {
  const { currentRole, setCurrentRole, setDemoMode, setCurrentView } = useApp();

  const handleRoleSwitch = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentView('dashboard');
  };

  const handleExitDemo = () => {
    setDemoMode(false);
    setCurrentRole(null);
    setCurrentView('landing');
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-[#0B1B2D] text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-4">
        <span className="text-xs font-mono uppercase tracking-wider text-white/60">
          Demo Mode
        </span>
        <div className="h-4 w-px bg-white/20" />
        <div className="flex items-center gap-2">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = currentRole === role.id;
            return (
              <Button
                key={role.id}
                variant="ghost"
                size="sm"
                onClick={() => handleRoleSwitch(role.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#2F6BFF] text-white hover:bg-[#2F6BFF]/90'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">{role.label}</span>
              </Button>
            );
          })}
        </div>
        <div className="h-4 w-px bg-white/20" />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExitDemo}
          className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
);
}
