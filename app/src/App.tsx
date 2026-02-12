import { useState, useEffect, createContext, useContext } from 'react';
import { AuthScreen } from './sections/AuthScreen';
import { LandingPage } from './sections/LandingPage';
import { PatientDashboard } from './sections/PatientDashboard';
import { DoctorDashboard } from './sections/DoctorDashboard';
import { HealthcareWorkerDashboard } from './sections/HealthcareWorkerDashboard';
import { ClinicAdminDashboard } from './sections/ClinicAdminDashboard';
import { PlatformAdminDashboard } from './sections/PlatformAdminDashboard';
import { PricingPage } from './sections/PricingPage';
import { SettingsPage } from './sections/SettingsPage';
import { ProfilePage } from './sections/ProfilePage';
import { ImpactPage } from './sections/ImpactPage';
import { DoctorReviews } from './sections/DoctorReviews';
import { AIInsights } from './sections/AIInsights';
import { DiagnosisHistory } from './sections/DiagnosisHistory';
import { VideoCall } from './sections/VideoCall';
import { Emergency } from './sections/Emergency';
import { NutritionDashboard } from './sections/NutritionDashboard';
import { DietPlans } from './sections/DietPlans';
import { MedicineReminders } from './sections/MedicineReminders';
import { DemoModeBar } from './components/DemoModeBar';
import { Toaster } from '@/components/ui/sonner';

export type UserRole = 'patient' | 'doctor' | 'healthcare_worker' | 'clinic_admin' | 'platform_admin' | null;
export type Theme = 'light' | 'dark' | 'system' | 'high-contrast';

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  user: any;
  setUser: (user: any) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  demoMode: boolean;
  setDemoMode: (value: boolean) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

export const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  currentRole: null,
  setCurrentRole: () => {},
  user: null,
  setUser: () => {},
  theme: 'light',
  setTheme: () => {},
  demoMode: false,
  setDemoMode: () => {},
  currentView: 'landing',
  setCurrentView: () => {},
  accentColor: '#2F6BFF',
  setAccentColor: () => {},
});

export const useApp = () => useContext(AppContext);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [demoMode, setDemoMode] = useState(false);
  const [currentView, setCurrentView] = useState('landing');
  const [accentColor, setAccentColor] = useState('#2F6BFF');

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
    
    // Update accent color CSS variable
    root.style.setProperty('--hg-accent', accentColor);
  }, [theme, accentColor]);

  // Load saved preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('hg-theme') as Theme;
    const savedAccent = localStorage.getItem('hg-accent');
    if (savedTheme) setTheme(savedTheme);
    if (savedAccent) setAccentColor(savedAccent);
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('hg-theme', theme);
    localStorage.setItem('hg-accent', accentColor);
  }, [theme, accentColor]);

  const renderContent = () => {
    if (!isAuthenticated) {
      if (currentView === 'pricing') return <PricingPage />;
      if (currentView === 'landing') return <LandingPage />;
      return <AuthScreen />;
    }

    switch (currentView) {
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'impact':
        return <ImpactPage />;
      case 'pricing':
        return <PricingPage />;
      case 'doctor-reviews':
        return <DoctorReviews />;
      case 'ai-insights':
        return <AIInsights />;
      case 'diagnosis-history':
        return <DiagnosisHistory />;
      case 'video-call':
        return <VideoCall />;
      case 'emergency':
        return <Emergency />;
      case 'nutrition':
        return <NutritionDashboard />;
      case 'diet-plans':
        return <DietPlans />;
      case 'medicine-reminders':
        return <MedicineReminders />;
      default:
        switch (currentRole) {
          case 'patient':
            return <PatientDashboard />;
          case 'doctor':
            return <DoctorDashboard />;
          case 'healthcare_worker':
            return <HealthcareWorkerDashboard />;
          case 'clinic_admin':
            return <ClinicAdminDashboard />;
          case 'platform_admin':
            return <PlatformAdminDashboard />;
          default:
            return <PatientDashboard />;
        }
    }
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      currentRole,
      setCurrentRole,
      user,
      setUser,
      theme,
      setTheme,
      demoMode,
      setDemoMode,
      currentView,
      setCurrentView,
      accentColor,
      setAccentColor,
    }}>
      <div className="min-h-screen bg-background transition-colors duration-300">
        {demoMode && <DemoModeBar />}
        {renderContent()}
        <Toaster position="top-right" richColors />
        <div className="grain-overlay" />
      </div>
    </AppContext.Provider>
  );
}

export default App;
