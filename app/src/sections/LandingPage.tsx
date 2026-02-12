import { useEffect, useState } from 'react';
import { useApp } from '@/App';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Calendar, 
  Shield, 
  Leaf,
  ChevronRight,
  Menu,
  X,
  Play
} from 'lucide-react';

export function LandingPage() {
  const { setCurrentView, setDemoMode } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    setCurrentView('auth');
  };

  const handleDemo = () => {
    setDemoMode(true);
    setCurrentView('auth');
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] dark:bg-[#0B1B2D]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 dark:bg-[#0B1B2D]/80 backdrop-blur-lg shadow-sm' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#2F6BFF] rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-[#0B1B2D] dark:text-white">
                HealthGuard AI
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#platform" className="text-sm text-[#6B7A8F] dark:text-[#8B9AAF] hover:text-[#0B1B2D] dark:hover:text-white transition-colors">Platform</a>
              <a href="#clinics" className="text-sm text-[#6B7A8F] dark:text-[#8B9AAF] hover:text-[#0B1B2D] dark:hover:text-white transition-colors">Clinics</a>
              <a href="#sustainability" className="text-sm text-[#6B7A8F] dark:text-[#8B9AAF] hover:text-[#0B1B2D] dark:hover:text-white transition-colors">Sustainability</a>
              <a href="#security" className="text-sm text-[#6B7A8F] dark:text-[#8B9AAF] hover:text-[#0B1B2D] dark:hover:text-white transition-colors">Security</a>
              <button 
                onClick={() => setCurrentView('pricing')}
                className="text-sm text-[#6B7A8F] dark:text-[#8B9AAF] hover:text-[#0B1B2D] dark:hover:text-white transition-colors"
              >
                Pricing
              </button>
            </div>
            
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={handleGetStarted}
                className="text-sm"
              >
                Log in
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="hg-btn-primary text-sm"
              >
                Request demo
              </Button>
            </div>
            
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#0B1B2D] border-t border-border p-4">
            <div className="flex flex-col gap-4">
              <a href="#platform" className="text-sm py-2">Platform</a>
              <a href="#clinics" className="text-sm py-2">Clinics</a>
              <a href="#sustainability" className="text-sm py-2">Sustainability</a>
              <a href="#security" className="text-sm py-2">Security</a>
              <button onClick={() => setCurrentView('pricing')} className="text-sm py-2 text-left">Pricing</button>
              <hr className="border-border" />
              <Button variant="ghost" onClick={handleGetStarted} className="justify-start">Log in</Button>
              <Button onClick={handleGetStarted} className="hg-btn-primary">Request demo</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F6F8FA] via-[#F6F8FA] to-[#E8F0FE] dark:from-[#0B1B2D] dark:via-[#0B1B2D] dark:to-[#0F2440]" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-up">
            <div className="flex flex-wrap gap-3">
              <span className="hg-pill hg-pill-accent">
                <Sparkles className="w-4 h-4" />
                AI-Powered Healthcare
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0B1B2D] dark:text-white leading-[1.05]">
              AI that listens.
              <br />
              <span className="text-[#2F6BFF]">Care that follows.</span>
            </h1>
            
            <p className="text-lg text-[#6B7A8F] dark:text-[#8B9AAF] max-w-lg leading-relaxed">
              Describe symptoms in plain language. Get instant guidance, scheduling, 
              and continuity—without the wait.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleGetStarted}
                className="hg-btn-primary text-base px-8 py-4"
              >
                Start a symptom check
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline"
                onClick={handleDemo}
                className="px-8 py-4 rounded-2xl border-2"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch demo
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-4">
              <span className="hg-pill">
                <MessageSquare className="w-4 h-4 text-[#2F6BFF]" />
                AI Triage
              </span>
              <span className="hg-pill">
                <Calendar className="w-4 h-4 text-[#2F6BFF]" />
                Smart Scheduling
              </span>
              <span className="hg-pill">
                <Shield className="w-4 h-4 text-[#2F6BFF]" />
                Secure Records
              </span>
            </div>
          </div>
          
          {/* AI Chat Card */}
          <div className="relative animate-slide-in-right">
            <div className="hg-card p-6 max-w-md mx-auto lg:ml-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2F6BFF]/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#2F6BFF]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">AI Assistant</p>
                    <p className="text-xs text-[#6B7A8F]">Online</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#2F6BFF]" />
                  <div className="w-2 h-2 rounded-full bg-[#2F6BFF]" />
                  <div className="w-2 h-2 rounded-full bg-[#2F6BFF]" />
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-end">
                  <div className="bg-[#2F6BFF] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm">I have a tight chest and mild fever.</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%]">
                    <p className="text-sm text-foreground">
                      I'm noting chest tightness + fever. When did it start? 
                      Any pain radiating to your arm or jaw?
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type your symptoms..."
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-input bg-background text-sm"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2F6BFF]">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#2F6BFF]/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#2F6BFF]/5 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="platform" className="py-24 bg-white dark:bg-[#0B1B2D]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#2F6BFF] mb-4 block">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1B2D] dark:text-white">
              Three steps to better care
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Share symptoms',
                description: 'Type or speak. Our AI asks the right follow-ups.',
                icon: MessageSquare,
              },
              {
                step: '2',
                title: 'Get guidance',
                description: 'Triage, next steps, and care options—clear and calm.',
                icon: Sparkles,
              },
              {
                step: '3',
                title: 'Book & follow up',
                description: 'Schedule with the right provider and stay on track.',
                icon: Calendar,
              },
            ].map((item, index) => (
              <div 
                key={index}
                className="hg-card hg-card-hover p-8 relative"
              >
                <div className="w-14 h-14 rounded-2xl border-2 border-[#2F6BFF]/20 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-[#2F6BFF]">{item.step}</span>
                </div>
                <item.icon className="w-6 h-6 text-[#2F6BFF] mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-[#0B1B2D] dark:text-white">
                  {item.title}
                </h3>
                <p className="text-[#6B7A8F] dark:text-[#8B9AAF]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Clinics Section */}
      <section id="clinics" className="py-24 bg-[#F6F8FA] dark:bg-[#070F1A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="font-mono text-xs uppercase tracking-widest text-[#2F6BFF]">
                For Clinics
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0B1B2D] dark:text-white">
                Run your clinic with clarity
              </h2>
              <p className="text-lg text-[#6B7A8F] dark:text-[#8B9AAF] leading-relaxed">
                Real-time scheduling, patient context, and team coordination—so you 
                focus on care, not logistics.
              </p>
              <ul className="space-y-4">
                {[
                  'Live availability & waitlist',
                  'Patient context at a glance',
                  'Team tasks & handoffs',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#2F6BFF]/10 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-[#2F6BFF]" />
                    </div>
                    <span className="text-[#0B1B2D] dark:text-white">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="hg-btn-primary">
                Explore the clinic dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <div className="hg-card p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h3 className="font-semibold">Today's Schedule</h3>
                  <span className="text-sm text-[#6B7A8F]">March 15, 2026</span>
                </div>
                {[
                  { time: '9:00 AM', patient: 'Sarah Johnson', type: 'Follow-up', status: 'confirmed' },
                  { time: '10:30 AM', patient: 'Michael Chen', type: 'New patient', status: 'confirmed' },
                  { time: '2:00 PM', patient: 'Emily Davis', type: 'Consultation', status: 'pending' },
                  { time: '3:30 PM', patient: 'Robert Wilson', type: 'Check-up', status: 'confirmed' },
                ].map((apt, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50">
                    <span className="text-sm font-mono text-[#6B7A8F] w-20">{apt.time}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{apt.patient}</p>
                      <p className="text-xs text-[#6B7A8F]">{apt.type}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      apt.status === 'confirmed' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section id="sustainability" className="py-24 bg-white dark:bg-[#0B1B2D]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <span className="hg-pill hg-pill-accent mb-4 inline-flex">
              <Leaf className="w-4 h-4" />
              Sustainability
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1B2D] dark:text-white mt-4">
              Better care, smaller footprint
            </h2>
            <p className="text-lg text-[#6B7A8F] dark:text-[#8B9AAF] mt-4 max-w-2xl">
              Smarter triage and scheduling reduce unnecessary travel, emissions, 
              and resource use—without compromising outcomes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { value: '18%', label: 'Reduction in unnecessary visits' },
              { value: '12%', label: 'Lower travel-related emissions' },
              { value: '9%', label: 'Improved resource efficiency' },
            ].map((stat, index) => (
              <div key={index} className="hg-card p-8">
                <div className="h-1 w-16 bg-[#2F6BFF]/20 rounded-full mb-6" />
                <p className="text-5xl font-bold text-[#0B1B2D] dark:text-white mb-3">
                  {stat.value}
                </p>
                <p className="text-[#6B7A8F] dark:text-[#8B9AAF]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-[#0B1B2D] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-breathe">
            <Shield className="w-10 h-10 text-[#2F6BFF]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your data stays yours
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            Enterprise-grade security, strict access controls, and compliance 
            built in from day one.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['HIPAA-ready', 'End-to-end encryption', 'Audit logs'].map((badge, index) => (
              <span key={index} className="px-4 py-2 rounded-full bg-white/10 text-sm font-medium">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#F6F8FA] dark:bg-[#070F1A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0B1B2D] dark:text-white mb-6">
            Ready to modernize your care experience?
          </h2>
          <p className="text-lg text-[#6B7A8F] dark:text-[#8B9AAF] mb-10">
            Join thousands of healthcare providers and patients already using HealthGuard AI.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={handleGetStarted}
              className="hg-btn-primary text-base px-8 py-4"
            >
              Get started for free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCurrentView('pricing')}
              className="px-8 py-4 rounded-2xl border-2 text-base"
            >
              View pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-[#0B1B2D] border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2F6BFF] rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-[#0B1B2D] dark:text-white">
                HealthGuard AI
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[#6B7A8F] dark:text-[#8B9AAF]">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Security</a>
            </div>
            <p className="text-sm text-[#6B7A8F] dark:text-[#8B9AAF]">
              © 2026 HealthGuard AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
