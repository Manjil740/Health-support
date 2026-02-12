import { useEffect, useState, useRef } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Leaf, 
  TreePine, 
  Car, 
  Zap, 
  Droplets, 
  Wind,
  TrendingDown,
  Globe,
  Users,
  Building2,
  Award,
  Share2,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      countRef.current = Math.floor(progress * end);
      setCount(countRef.current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
    
    return () => {
      startTimeRef.current = null;
    };
  }, [end, duration]);

  return count;
}

const impactData = [
  { month: 'Jan', co2: 120, visits: 450 },
  { month: 'Feb', co2: 135, visits: 520 },
  { month: 'Mar', co2: 98, visits: 480 },
  { month: 'Apr', co2: 85, visits: 610 },
  { month: 'May', co2: 72, visits: 580 },
  { month: 'Jun', co2: 65, visits: 670 },
];

const clinicComparison = [
  { name: 'Your Clinic', reduction: 18, visits: 1250 },
  { name: 'City Average', reduction: 8, visits: 980 },
  { name: 'National Average', reduction: 5, visits: 850 },
];

const achievements = [
  { 
    id: 'tree-planter', 
    name: 'Tree Planter', 
    description: 'Saved equivalent of 10 trees',
    icon: TreePine,
    unlocked: true,
    progress: 100,
  },
  { 
    id: 'carbon-saver', 
    name: 'Carbon Saver', 
    description: 'Reduced 1 ton of CO2',
    icon: Wind,
    unlocked: true,
    progress: 100,
  },
  { 
    id: 'travel-reducer', 
    name: 'Travel Reducer', 
    description: 'Saved 1000 km of patient travel',
    icon: Car,
    unlocked: false,
    progress: 78,
  },
  { 
    id: 'energy-champion', 
    name: 'Energy Champion', 
    description: 'Saved 1000 kWh of energy',
    icon: Zap,
    unlocked: false,
    progress: 65,
  },
];

export function ImpactPage() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Animated counters
  const co2Saved = useAnimatedCounter(isVisible ? 847 : 0, 2000);
  const treesPlanted = useAnimatedCounter(isVisible ? 42 : 0, 2000);
  const travelReduced = useAnimatedCounter(isVisible ? 12580 : 0, 2000);
  const energySaved = useAnimatedCounter(isVisible ? 3420 : 0, 2000);
  const waterSaved = useAnimatedCounter(isVisible ? 15600 : 0, 2000);
  const visitsOptimized = useAnimatedCounter(isVisible ? 2340 : 0, 2000);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleShare = () => {
    toast.success('Impact report shared!');
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <Leaf className="w-3 h-3 mr-1" />
                  Sustainability
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-[#0B1B2D] dark:text-white">
                Your Environmental Impact
              </h1>
              <p className="text-muted-foreground mt-1">
                See how HealthGuard AI helps reduce your healthcare carbon footprint
              </p>
            </div>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Report
            </Button>
          </div>
        </div>

        {/* Main Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="hg-card border-green-200 dark:border-green-800">
            <CardContent className="p-5 text-center">
              <Wind className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {co2Saved.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">kg CO₂ saved</p>
            </CardContent>
          </Card>
          
          <Card className="hg-card border-green-200 dark:border-green-800">
            <CardContent className="p-5 text-center">
              <TreePine className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {treesPlanted}
              </p>
              <p className="text-xs text-muted-foreground">trees equivalent</p>
            </CardContent>
          </Card>
          
          <Card className="hg-card border-green-200 dark:border-green-800">
            <CardContent className="p-5 text-center">
              <Car className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {travelReduced.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">km travel saved</p>
            </CardContent>
          </Card>
          
          <Card className="hg-card border-green-200 dark:border-green-800">
            <CardContent className="p-5 text-center">
              <Zap className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {energySaved.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">kWh saved</p>
            </CardContent>
          </Card>
          
          <Card className="hg-card border-green-200 dark:border-green-800">
            <CardContent className="p-5 text-center">
              <Droplets className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {waterSaved.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">L water saved</p>
            </CardContent>
          </Card>
          
          <Card className="hg-card border-green-200 dark:border-green-800">
            <CardContent className="p-5 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {visitsOptimized.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">visits optimized</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* CO2 Reduction Chart */}
            <Card className="hg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Wind className="w-5 h-5 text-green-500" />
                      CO₂ Emissions Reduction
                    </CardTitle>
                    <CardDescription>Monthly carbon footprint reduction</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -46%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={impactData}>
                      <defs>
                        <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="co2" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        fill="url(#co2Gradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Clinic Comparison */}
            <Card className="hg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-green-500" />
                  How You Compare
                </CardTitle>
                <CardDescription>CO₂ reduction vs other clinics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clinicComparison} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                      <XAxis type="number" stroke="#6B7280" fontSize={12} />
                      <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={12} width={120} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                        }} 
                      />
                      <Bar dataKey="reduction" fill="#10B981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Impact Breakdown */}
            <Card className="hg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-500" />
                  Impact Breakdown
                </CardTitle>
                <CardDescription>How AI optimization reduces emissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Reduced Unnecessary Visits</span>
                      <span className="text-sm text-green-600">18% reduction</span>
                    </div>
                    <Progress value={18} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      AI triage helps patients get the right care without unnecessary trips
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Optimized Scheduling</span>
                      <span className="text-sm text-green-600">12% more efficient</span>
                    </div>
                    <Progress value={12} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Smart scheduling reduces wait times and travel
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Remote Monitoring</span>
                      <span className="text-sm text-green-600">9% fewer visits</span>
                    </div>
                    <Progress value={9} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Continuous monitoring reduces check-up frequency
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Digital Records</span>
                      <span className="text-sm text-green-600">Paperless</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Fully digital system eliminates paper waste
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Achievements & Stats */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card className="hg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-500" />
                  Achievements
                </CardTitle>
                <CardDescription>Unlock badges for your impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div 
                        key={achievement.id}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          achievement.unlocked 
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
                            : 'border-border bg-secondary/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            achievement.unlocked 
                              ? 'bg-green-500 text-white' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className={`font-semibold ${achievement.unlocked ? '' : 'text-muted-foreground'}`}>
                                {achievement.name}
                              </p>
                              {achievement.unlocked && (
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  Unlocked
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            {!achievement.unlocked && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span>{achievement.progress}%</span>
                                </div>
                                <Progress value={achievement.progress} className="h-1.5" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* This Month's Impact */}
            <Card className="hg-card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-800 dark:text-green-200">
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700 dark:text-green-300">CO₂ Saved</span>
                    <span className="font-bold text-green-800 dark:text-green-200">142 kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700 dark:text-green-300">Travel Reduced</span>
                    <span className="font-bold text-green-800 dark:text-green-200">2,340 km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700 dark:text-green-300">Visits Optimized</span>
                    <span className="font-bold text-green-800 dark:text-green-200">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700 dark:text-green-300">Energy Saved</span>
                    <span className="font-bold text-green-800 dark:text-green-200">680 kWh</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Global Impact */}
            <Card className="hg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-500" />
                  Global Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      12,847
                    </p>
                    <p className="text-sm text-muted-foreground">tons CO₂ saved globally</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      642,000
                    </p>
                    <p className="text-sm text-muted-foreground">trees equivalent</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      1.2M
                    </p>
                    <p className="text-sm text-muted-foreground">patients using AI triage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
