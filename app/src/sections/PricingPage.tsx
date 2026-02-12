import { useState } from 'react';
import { useApp } from '@/App';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Check, 
  Sparkles, 
  ArrowLeft, 
  Zap, 
  Building2, 
  Users,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals and small practices',
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Zap,
    features: [
      'Core AI triage',
      'Basic scheduling',
      'Up to 100 patients',
      'Email support',
      'Standard analytics',
    ],
    cta: 'Get started',
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing clinics and healthcare teams',
    monthlyPrice: 29,
    yearlyPrice: 290,
    icon: Users,
    features: [
      'Everything in Starter',
      'Advanced automation',
      'Custom workflows',
      'Up to 1,000 patients',
      'Priority support',
      'Advanced reporting',
      'API access',
    ],
    cta: 'Start trial',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations and hospital systems',
    monthlyPrice: null,
    yearlyPrice: null,
    icon: Building2,
    features: [
      'Everything in Professional',
      'Unlimited patients',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'On-premise option',
      'Advanced security',
      'Training & onboarding',
    ],
    cta: 'Contact sales',
    popular: false,
  },
];

const featureComparison = [
  { feature: 'AI Triage', starter: true, professional: true, enterprise: true },
  { feature: 'Smart Scheduling', starter: true, professional: true, enterprise: true },
  { feature: 'Patient Portal', starter: true, professional: true, enterprise: true },
  { feature: 'Basic Analytics', starter: true, professional: true, enterprise: true },
  { feature: 'Custom Workflows', starter: false, professional: true, enterprise: true },
  { feature: 'API Access', starter: false, professional: true, enterprise: true },
  { feature: 'Advanced Reporting', starter: false, professional: true, enterprise: true },
  { feature: 'Dedicated Support', starter: false, professional: true, enterprise: true },
  { feature: 'Custom Integrations', starter: false, professional: false, enterprise: true },
  { feature: 'SLA Guarantee', starter: false, professional: false, enterprise: true },
  { feature: 'On-premise Option', starter: false, professional: false, enterprise: true },
  { feature: 'Advanced Security', starter: false, professional: false, enterprise: true },
];

export function PricingPage() {
  const { setCurrentView, isAuthenticated } = useApp();
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState('starter');

  const handleSelectPlan = async (planId: string) => {
    if (!isAuthenticated) {
      setCurrentView('auth');
      toast.info('Please sign in to select a plan');
      return;
    }

    setLoadingPlan(planId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoadingPlan(null);
    setCurrentPlan(planId);
    toast.success(`You've selected the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan!`);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] dark:bg-[#0B1B2D]">
      {/* Header */}
      <header className="bg-white dark:bg-[#0B1B2D] border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentView(isAuthenticated ? 'dashboard' : 'landing')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#2F6BFF] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-[#0B1B2D] dark:text-white">
                  HealthGuard AI
                </span>
              </div>
            </div>
            {!isAuthenticated && (
              <Button 
                onClick={() => setCurrentView('auth')}
                variant="outline"
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#2F6BFF] mb-4 block">
            Pricing
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0B1B2D] dark:text-white mb-4">
            Simple plans for every stage
          </h1>
          <p className="text-lg text-[#6B7A8F] dark:text-[#8B9AAF] max-w-2xl mx-auto">
            Start free. Upgrade when you need more seats, integrations, and automation.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${!isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-sm ${isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="hg-pill hg-pill-accent text-xs">
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan === plan.id;
            
            return (
              <Card 
                key={plan.id}
                className={`hg-card hg-card-hover relative ${
                  plan.popular ? 'border-[#2F6BFF] border-2' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="hg-pill hg-pill-accent text-xs">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-[#2F6BFF]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#2F6BFF]" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-6">
                    {plan.monthlyPrice !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-[#0B1B2D] dark:text-white">
                          ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-[#6B7A8F] dark:text-[#8B9AAF]">
                          /{isYearly ? 'year' : 'month'}
                        </span>
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-[#0B1B2D] dark:text-white">
                        Custom
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#2F6BFF] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-[#0B1B2D] dark:text-white/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={loadingPlan === plan.id || isCurrentPlan}
                    className={`w-full ${
                      plan.popular 
                        ? 'hg-btn-primary' 
                        : 'hg-btn-secondary'
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isCurrentPlan ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Current Plan
                      </>
                    ) : (
                      plan.cta
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-[#0B1B2D] dark:text-white text-center mb-8">
            Compare all features
          </h2>
          
          <Card className="hg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold text-[#0B1B2D] dark:text-white">Feature</th>
                    <th className="text-center p-4 font-semibold text-[#0B1B2D] dark:text-white">Starter</th>
                    <th className="text-center p-4 font-semibold text-[#2F6BFF]">Professional</th>
                    <th className="text-center p-4 font-semibold text-[#0B1B2D] dark:text-white">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((row, index) => (
                    <tr key={index} className="border-b border-border last:border-0">
                      <td className="p-4 text-sm text-[#0B1B2D] dark:text-white/90">{row.feature}</td>
                      <td className="p-4 text-center">
                        {row.starter ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4 text-center bg-[#2F6BFF]/5">
                        {row.professional ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.enterprise ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Billing Info */}
        {isAuthenticated && (
          <Card className="hg-card max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your past invoices and payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: 'Mar 1, 2026', amount: '$29.00', status: 'Paid', invoice: '#INV-001' },
                  { date: 'Feb 1, 2026', amount: '$29.00', status: 'Paid', invoice: '#INV-002' },
                  { date: 'Jan 1, 2026', amount: '$29.00', status: 'Paid', invoice: '#INV-003' },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.date}</p>
                      <p className="text-xs text-muted-foreground">{item.invoice}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{item.amount}</span>
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-medium mb-4">Payment Method</h4>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                  <div className="w-10 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">•••• •••• •••• 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/27</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
