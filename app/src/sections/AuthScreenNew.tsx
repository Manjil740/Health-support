import { useState, useEffect } from 'react';
import { useApp, type UserRole } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Eye, EyeOff, ArrowLeft, User, Stethoscope, Building2, Shield, Loader2, 
  CheckCircle2, AlertCircle, Heart
} from 'lucide-react';
import { toast } from 'sonner';
import { apiLogin, setToken } from '@/lib/api';

type AuthView = 'main' | 'login' | 'patient-register' | 'otp-verify' | 'clinic-register' | 'admin-login';

export function AuthScreen() {
  const { setIsAuthenticated, setCurrentRole, setUser, setCurrentView } = useApp();
  const [view, setView] = useState<AuthView>('main');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Patient registration form
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  // OTP verification
  const [otp, setOtp] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // Clinic registration form
  const [clinicName, setClinicName] = useState('');
  const [clinicEmail, setClinicEmail] = useState('');
  const [clinicPhone, setClinicPhone] = useState('');
  const [clinicLocation, setClinicLocation] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('monthly');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail !== 'admin' || loginPassword !== 'admin123') {
      toast.error('Invalid admin credentials');
      return;
    }
    // For demo, just login
    handleLogin(e);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await apiLogin(loginEmail, loginPassword);
      const role = (data.user.user_type || 'patient') as UserRole;
      setUser(data.user);
      setCurrentRole(role);
      setIsAuthenticated(true);
      setCurrentView('dashboard');
      toast.success('Welcome back!');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (parseInt(age) < 18) {
      toast.error('You must be at least 18 years old');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone,
          password,
          first_name: firstName,
          last_name: lastName,
          age: parseInt(age),
          gender,
          location,
          weight: parseFloat(weight),
          height: parseFloat(height),
          blood_group: bloodGroup,
        }),
      });

      if (!response.ok) {
        try {
          const text = await response.text();
          const error = text ? JSON.parse(text) : {};
          throw new Error(error.email || error.phone || error.password || 'Registration failed');
        } catch (parseErr: any) {
          throw new Error('Registration failed: ' + (parseErr.message || 'Server error'));
        }
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      setOtpEmail(email);
      setView('otp-verify');
      toast.success('OTP sent to your email');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }

    setOtpLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpEmail,
          otp,
          password,
          phone,
          first_name: firstName,
          last_name: lastName,
          age: parseInt(age),
          gender,
          location,
          weight: parseFloat(weight),
          height: parseFloat(height),
          blood_group: bloodGroup,
        }),
      });

      if (!response.ok) {
        try {
          const text = await response.text();
          const error = text ? JSON.parse(text) : {};
          throw new Error(error.error || 'Verification failed');
        } catch (parseErr: any) {
          throw new Error('Verification failed: ' + (parseErr.message || 'Server error'));
        }
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      setToken(data.token);
      setUser(data.user);
      setCurrentRole('patient');
      setIsAuthenticated(true);
      setCurrentView('dashboard');
      toast.success('Account created successfully!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleClinicRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (adminPassword !== adminPasswordConfirm) {
      toast.error('Passwords do not match');
      return;
    }

    if (adminPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register/clinic/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinic_name: clinicName,
          clinic_email: clinicEmail,
          phone: clinicPhone,
          location: clinicLocation,
          admin_password: adminPassword,
          subscription_plan: subscriptionPlan,
          license_number: licenseNumber,
          registration_number: registrationNumber,
        }),
      });

      if (!response.ok) {
        try {
          const text = await response.text();
          const error = text ? JSON.parse(text) : {};
          throw new Error(error.clinic_name || error.clinic_email || error.subscription_plan || 'Registration failed');
        } catch (parseErr: any) {
          throw new Error('Registration failed: ' + (parseErr.message || 'Server error'));
        }
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      toast.success('Clinic registered successfully! Check your email to activate.');
      toast.info(`Subscription Plan: ${data.subscription_plan === 'monthly' ? '$49.99/month' : '$99.99/year'}`);
      setView('login');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Main landing page
  if (view === 'main') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1B2D] to-[#1A2F4D] flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2F6BFF] rounded-full mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">HealthGuard</h1>
            <p className="text-white/60">Connected Healthcare Platform</p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <Button
              onClick={() => setView('login')}
              className="w-full bg-[#2F6BFF] hover:bg-[#2563EB] text-white py-6 text-lg"
            >
              <User className="w-5 h-5 mr-2" />
              Login
            </Button>

            <Button
              onClick={() => setView('patient-register')}
              variant="outline"
              className="w-full py-6 text-lg border-white/20 hover:bg-white/10 text-white"
            >
              <Stethoscope className="w-5 h-5 mr-2" />
              Register as Patient
            </Button>

            <Button
              onClick={() => setView('clinic-register')}
              variant="outline"
              className="w-full py-6 text-lg border-white/20 hover:bg-white/10 text-white"
            >
              <Building2 className="w-5 h-5 mr-2" />
              Register Clinic/Hospital
            </Button>

            <Button
              onClick={() => setView('admin-login')}
              variant="outline"
              className="w-full py-6 text-lg border-white/20 hover:bg-white/10 text-white"
            >
              <Shield className="w-5 h-5 mr-2" />
              Admin Login
            </Button>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-2 gap-4 text-sm text-white/60">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Video Consultations</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Health Records</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>AI Health Insights</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login
  if (view === 'login' || view === 'admin-login') {
    const isAdmin = view === 'admin-login';
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1B2D] to-[#1A2F4D] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#0F2742] border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView('main')}
                className="text-white/60 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
            <CardTitle className="text-white">
              {isAdmin ? 'Admin Login' : 'Login'}
            </CardTitle>
            <CardDescription>
              {isAdmin ? 'System administration' : 'Access your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isAdmin ? handleAdminLogin : handleLogin} className="space-y-4">
              {isAdmin && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-300 mb-4">
                  Default: admin / admin123
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-white">{isAdmin ? 'Username' : 'Email'}</Label>
                <Input
                  type={isAdmin ? 'text' : 'email'}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder={isAdmin ? 'admin' : 'your@email.com'}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2F6BFF] hover:bg-[#2563EB] text-white"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isAdmin ? 'Login as Admin' : 'Login'}
              </Button>
            </form>

            {!isAdmin && (
              <div className="mt-4 text-center text-sm text-white/60">
                Don't have an account?{' '}
                <button
                  onClick={() => setView('patient-register')}
                  className="text-[#2F6BFF] hover:text-[#6B9FFF]"
                >
                  Register now
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Patient Registration
  if (view === 'patient-register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1B2D] to-[#1A2F4D] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-[#0F2742] border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setView('main')}
                  className="text-white/60 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </div>
              <CardTitle className="text-white">Create Patient Account</CardTitle>
              <CardDescription>
                Join HealthGuard to access healthcare services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePatientRegister} className="space-y-4">
                {/* Contact Information */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Email *</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Phone Number *</Label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        required
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">First Name</Label>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Last Name</Label>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Age *</Label>
                      <Input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="25"
                        required
                        min="18"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Gender</Label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}>Select...</option>
                        <option value="male" style={{ backgroundColor: '#374151', color: 'white' }}>Male</option>
                        <option value="female" style={{ backgroundColor: '#374151', color: 'white' }}>Female</option>
                        <option value="other" style={{ backgroundColor: '#374151', color: 'white' }}>Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Health Information */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Health Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Height (cm)</Label>
                      <Input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="170"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Weight (kg)</Label>
                      <Input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="70"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Blood Group</Label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}>Select...</option>
                        <option value="O+" style={{ backgroundColor: '#374151', color: 'white' }}>O+</option>
                        <option value="O-" style={{ backgroundColor: '#374151', color: 'white' }}>O-</option>
                        <option value="A+" style={{ backgroundColor: '#374151', color: 'white' }}>A+</option>
                        <option value="A-" style={{ backgroundColor: '#374151', color: 'white' }}>A-</option>
                        <option value="B+" style={{ backgroundColor: '#374151', color: 'white' }}>B+</option>
                        <option value="B-" style={{ backgroundColor: '#374151', color: 'white' }}>B-</option>
                        <option value="AB+" style={{ backgroundColor: '#374151', color: 'white' }}>AB+</option>
                        <option value="AB-" style={{ backgroundColor: '#374151', color: 'white' }}>AB-</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Home Location</Label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, State"
                        className="bg-white/5 border-white/10 text-white"
                      />
                      <p className="text-xs text-white/40">(Anonymous to other users)</p>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Password *</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={6}
                          className="bg-white/5 border-white/10 text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Confirm Password *</Label>
                      <div className="relative">
                        <Input
                          type={showPassword2 ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={6}
                          className="bg-white/5 border-white/10 text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword2(!showPassword2)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                        >
                          {showPassword2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#2F6BFF] hover:bg-[#2563EB] text-white mt-6"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Continue with Verification
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // OTP Verification
  if (view === 'otp-verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1B2D] to-[#1A2F4D] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#0F2742] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Verify Your Email</CardTitle>
            <CardDescription>
              We sent an OTP to {otpEmail}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOtpVerify} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Enter 6-digit OTP *</Label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="bg-white/5 border-white/10 text-white text-center text-2xl tracking-widest font-mono"
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-300">
                <AlertCircle className="w-4 h-4 inline-block mr-2" />
                OTP valid for 10 minutes
              </div>

              <Button
                type="submit"
                disabled={otpLoading || otp.length !== 6}
                className="w-full bg-[#2F6BFF] hover:bg-[#2563EB] text-white"
              >
                {otpLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Verify & Create Account
              </Button>

              <button
                type="button"
                onClick={() => setView('patient-register')}
                className="w-full text-white/60 hover:text-white text-sm"
              >
                Change email
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Clinic Registration
  if (view === 'clinic-register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1B2D] to-[#1A2F4D] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-[#0F2742] border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setView('main')}
                  className="text-white/60 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </div>
              <CardTitle className="text-white">Register Clinic/Hospital</CardTitle>
              <CardDescription>
                Set up your healthcare facility on HealthGuard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleClinicRegister} className="space-y-4">
                {/* Clinic Information */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Clinic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Clinic/Hospital Name *</Label>
                      <Input
                        value={clinicName}
                        onChange={(e) => setClinicName(e.target.value)}
                        placeholder="Your Clinic Name"
                        required
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Email *</Label>
                      <Input
                        type="email"
                        value={clinicEmail}
                        onChange={(e) => setClinicEmail(e.target.value)}
                        placeholder="clinic@example.com"
                        required
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Phone *</Label>
                      <Input
                        type="tel"
                        value={clinicPhone}
                        onChange={(e) => setClinicPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        required
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Location *</Label>
                      <Input
                        value={clinicLocation}
                        onChange={(e) => setClinicLocation(e.target.value)}
                        placeholder="City, State"
                        required
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* License Information */}
                <div>
                  <h3 className="text-white font-semibold mb-3">License Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">License Number</Label>
                      <Input
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="License #"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Registration Number</Label>
                      <Input
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        placeholder="Registration #"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Admin Account */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Admin Account</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Admin Password *</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="••••••••••"
                          required
                          minLength={8}
                          className="bg-white/5 border-white/10 text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Confirm Password *</Label>
                      <div className="relative">
                        <Input
                          type={showPassword2 ? 'text' : 'password'}
                          value={adminPasswordConfirm}
                          onChange={(e) => setAdminPasswordConfirm(e.target.value)}
                          placeholder="••••••••••"
                          required
                          minLength={8}
                          className="bg-white/5 border-white/10 text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword2(!showPassword2)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                        >
                          {showPassword2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscription Plan */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Choose Subscription Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      onClick={() => setSubscriptionPlan('monthly')}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                        subscriptionPlan === 'monthly'
                          ? 'border-[#2F6BFF] bg-[#2F6BFF]/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <h4 className="text-white font-semibold">Monthly Plan</h4>
                      <p className="text-2xl font-bold text-[#2F6BFF] my-2">$49.99</p>
                      <p className="text-sm text-white/60">Up to 50 patients</p>
                      <p className="text-sm text-white/60">Basic features</p>
                    </div>
                    <div
                      onClick={() => setSubscriptionPlan('yearly')}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                        subscriptionPlan === 'yearly'
                          ? 'border-[#2F6BFF] bg-[#2F6BFF]/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">Yearly Plan</h4>
                        <Badge className="bg-green-500">Save 20%</Badge>
                      </div>
                      <p className="text-2xl font-bold text-[#2F6BFF] my-2">$99.99</p>
                      <p className="text-sm text-white/60">Unlimited patients</p>
                      <p className="text-sm text-white/60">Premium features</p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#2F6BFF] hover:bg-[#2563EB] text-white mt-6"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Complete Registration
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
