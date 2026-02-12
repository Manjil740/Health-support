import { useState } from 'react';
import { useApp, type UserRole } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  User, 
  Stethoscope, 
  HeartPulse, 
  Building2, 
  Shield,
  Check,
  Loader2,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

type AuthView = 'login' | 'signup' | 'forgot' | 'role-select' | 'onboarding';

const roles: { id: UserRole; label: string; description: string; icon: React.ElementType }[] = [
  { 
    id: 'patient', 
    label: 'Patient', 
    description: 'Access your health records, appointments, and AI triage',
    icon: User 
  },
  { 
    id: 'doctor', 
    label: 'Doctor', 
    description: 'Manage patients, schedules, and clinical workflows',
    icon: Stethoscope 
  },
  { 
    id: 'healthcare_worker', 
    label: 'Healthcare Worker', 
    description: 'Coordinate care and assist with patient monitoring',
    icon: HeartPulse 
  },
  { 
    id: 'clinic_admin', 
    label: 'Clinic Admin', 
    description: 'Manage clinic operations, staff, and resources',
    icon: Building2 
  },
  { 
    id: 'platform_admin', 
    label: 'Platform Admin', 
    description: 'System-wide configuration and analytics',
    icon: Shield 
  },
];

export function AuthScreen() {
  const { setIsAuthenticated, setCurrentRole, setUser, setDemoMode, setCurrentView } = useApp();
  const [view, setView] = useState<AuthView>('login');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    setPasswordStrength(strength);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setView('role-select');
    toast.success('Welcome back!', { description: 'Please select your role to continue.' });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setView('onboarding');
    toast.success('Account created!', { description: 'Let\'s get you set up.' });
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    toast.success('Reset link sent!', { description: 'Check your email for instructions.' });
    setView('login');
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentRole(role);
    setUser({
      id: 'user-001',
      email: email || 'demo@healthguard.ai',
      name: 'Demo User',
      role: role,
      avatar: null,
    });
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    toast.success(`Welcome as ${role?.replace('_', ' ')}!`);
  };

  const handleDemoMode = () => {
    setDemoMode(true);
    setEmail('demo@healthguard.ai');
    setView('role-select');
    toast.info('Demo Mode Activated', { 
      description: 'Switch between roles instantly using the bottom bar.' 
    });
  };

  const renderPasswordStrength = () => {
    const colors = ['bg-gray-200', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];
    return (
      <div className="flex gap-1 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= passwordStrength ? colors[passwordStrength] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#F6F8FA] to-[#EEF2F6] dark:from-[#0B1B2D] dark:to-[#070F1A]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#2F6BFF] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#0B1B2D] dark:text-white">
              HealthGuard AI
            </span>
          </div>
          <p className="text-[#6B7A8F] dark:text-[#8B9AAF]">
            AI-powered healthcare for everyone
          </p>
        </div>

        {view === 'login' && (
          <Card className="hg-card animate-fade-in">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@healthguard.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="hg-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="hg-input pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-sm text-[#2F6BFF] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Button
                  type="submit"
                  className="w-full hg-btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setView('signup')}
                    className="text-[#2F6BFF] hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDemoMode}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Try Demo Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {view === 'signup' && (
          <Card className="hg-card animate-fade-in">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setView('login')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
              <CardTitle className="text-2xl font-semibold">Create account</CardTitle>
              <CardDescription>Start your healthcare journey with AI</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="John" className="hg-input" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Doe" className="hg-input" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@healthguard.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="hg-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        checkPasswordStrength(e.target.value);
                      }}
                      className="hg-input pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {renderPasswordStrength()}
                  <p className="text-xs text-muted-foreground">
                    Use 8+ characters with uppercase, numbers & symbols
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer">
                    I agree to the{' '}
                    <a href="#" className="text-[#2F6BFF] hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-[#2F6BFF] hover:underline">Privacy Policy</a>
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="w-full hg-btn-primary"
                  disabled={isLoading || passwordStrength < 2}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Create account'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {view === 'forgot' && (
          <Card className="hg-card animate-fade-in">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setView('login')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
              <CardTitle className="text-2xl font-semibold">Reset password</CardTitle>
              <CardDescription>We'll send you a link to reset your password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@healthguard.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="hg-input"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full hg-btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {view === 'role-select' && (
          <Card className="hg-card animate-fade-in">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold">Select your role</CardTitle>
              <CardDescription>Choose how you'll use HealthGuard AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        selectedRole === role.id
                          ? 'border-[#2F6BFF] bg-[#2F6BFF]/5'
                          : 'border-border hover:border-[#2F6BFF]/50 hover:bg-secondary'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedRole === role.id
                          ? 'bg-[#2F6BFF] text-white'
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{role.label}</h3>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                      {selectedRole === role.id && (
                        <Check className="w-5 h-5 text-[#2F6BFF]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {view === 'onboarding' && (
          <Card className="hg-card animate-fade-in">
            <CardHeader className="space-y-1 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-semibold">You're all set!</CardTitle>
              <CardDescription>Your account has been created successfully</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground mb-6">
                Welcome to HealthGuard AI. Let's get started by selecting your role.
              </p>
              <Button
                onClick={() => setView('role-select')}
                className="w-full hg-btn-primary"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
