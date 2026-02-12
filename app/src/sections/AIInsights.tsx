import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Brain,
  Moon,
  Apple,
  Dumbbell,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

// Before/After comparison data
const heartRateComparison = {
  before: [
    { day: 'Mon', resting: 78, active: 145 },
    { day: 'Tue', resting: 80, active: 148 },
    { day: 'Wed', resting: 82, active: 150 },
    { day: 'Thu', resting: 79, active: 146 },
    { day: 'Fri', resting: 81, active: 149 },
    { day: 'Sat', resting: 77, active: 142 },
    { day: 'Sun', resting: 76, active: 140 },
  ],
  after: [
    { day: 'Mon', resting: 68, active: 125 },
    { day: 'Tue', resting: 67, active: 122 },
    { day: 'Wed', resting: 69, active: 128 },
    { day: 'Thu', resting: 68, active: 124 },
    { day: 'Fri', resting: 66, active: 120 },
    { day: 'Sat', resting: 65, active: 118 },
    { day: 'Sun', resting: 66, active: 119 },
  ],
};

const aiRecommendations = [
  {
    id: 1,
    category: 'exercise',
    title: 'Cardiovascular Training',
    description: 'Based on your heart rate patterns, we recommend 30 minutes of moderate cardio 4x per week.',
    confidence: 94,
    impact: 'high',
    exercises: [
      { name: 'Brisk Walking', duration: '30 min', intensity: 'Moderate' },
      { name: 'Cycling', duration: '25 min', intensity: 'Moderate' },
      { name: 'Swimming', duration: '20 min', intensity: 'Low Impact' },
    ],
  },
  {
    id: 2,
    category: 'diet',
    title: 'Anti-Inflammatory Diet',
    description: 'Your inflammation markers suggest reducing processed foods and increasing omega-3s.',
    confidence: 89,
    impact: 'medium',
    foods: [
      { name: 'Fatty Fish', benefit: 'Omega-3 rich', frequency: '3x/week' },
      { name: 'Leafy Greens', benefit: 'Antioxidants', frequency: 'Daily' },
      { name: 'Berries', benefit: 'Anti-inflammatory', frequency: 'Daily' },
    ],
  },
  {
    id: 3,
    category: 'sleep',
    title: 'Sleep Optimization',
    description: 'Your sleep data shows irregular patterns. Consistent bedtime could improve recovery.',
    confidence: 91,
    impact: 'high',
    tips: [
      'Target bedtime: 10:30 PM',
      'Avoid screens 1 hour before bed',
      'Keep room temperature at 65°F',
    ],
  },
];

const patternAnalysis = {
  detected: [
    { pattern: 'Heart rate improves 12% after morning exercise', confidence: 94 },
    { pattern: 'Sleep quality drops when caffeine consumed after 2 PM', confidence: 87 },
    { pattern: 'Blood pressure optimal on days with 8K+ steps', confidence: 91 },
    { pattern: 'Stress levels correlate with meeting frequency', confidence: 82 },
  ],
  predictions: [
    { prediction: 'Risk of hypertension reduced by 35% in 6 months', confidence: 88 },
    { prediction: 'Sleep efficiency will improve to 92% with changes', confidence: 85 },
    { prediction: 'Cardiovascular fitness will reach excellent range', confidence: 79 },
  ],
};

export function AIInsights() {
  const [activeTab, setActiveTab] = useState('comparison');
  const [selectedRecommendation, setSelectedRecommendation] = useState(aiRecommendations[0]);

  const handleApplyRecommendation = () => {
    toast.success('Recommendation added to your plan!');
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-[#0B1B2D] dark:text-white">
            AI Health Insights
          </h1>
          <p className="text-muted-foreground mt-1">
            Personalized analysis and recommendations based on your health data
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="comparison">Before/After</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>

          {/* Before/After Comparison */}
          <TabsContent value="comparison" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="hg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-500" />
                      Before (6 months ago)
                    </CardTitle>
                    <Badge variant="destructive">Baseline</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={heartRateComparison.before}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="resting" 
                          stroke="#EF4444" 
                          strokeWidth={2}
                          name="Resting HR"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10">
                      <p className="text-sm text-muted-foreground">Avg Resting HR</p>
                      <p className="text-2xl font-bold text-red-600">79 bpm</p>
                    </div>
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10">
                      <p className="text-sm text-muted-foreground">BMI</p>
                      <p className="text-2xl font-bold text-red-600">28.5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      After (Current)
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-700">Improved</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={heartRateComparison.after}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="resting" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          name="Resting HR"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/10">
                      <p className="text-sm text-muted-foreground">Avg Resting HR</p>
                      <p className="text-2xl font-bold text-green-600">67 bpm</p>
                      <p className="text-xs text-green-600">↓ 15% improvement</p>
                    </div>
                    <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/10">
                      <p className="text-sm text-muted-foreground">BMI</p>
                      <p className="text-2xl font-bold text-green-600">24.2</p>
                      <p className="text-xs text-green-600">↓ 15% reduction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Health Metrics Comparison */}
            <Card className="hg-card">
              <CardHeader>
                <CardTitle>Health Metrics Comparison</CardTitle>
                <CardDescription>Key health indicators improvement over 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { label: 'BMI', before: 28.5, after: 24.2, unit: '', target: 24 },
                    { label: 'Body Fat %', before: 24, after: 18, unit: '%', target: 15 },
                    { label: 'VO2 Max', before: 35, after: 42, unit: '', target: 45 },
                    { label: 'Flexibility', before: 45, after: 68, unit: '%', target: 70 },
                  ].map((metric) => {
                    const improvement = ((metric.after - metric.before) / metric.before * 100).toFixed(1);
                    const isPositive = metric.after > metric.before;
                    return (
                      <div key={metric.label} className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <span className="text-lg text-muted-foreground line-through">
                            {metric.before}{metric.unit}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          <span className="text-2xl font-bold text-green-600">
                            {metric.after}{metric.unit}
                          </span>
                        </div>
                        <Badge className={isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {isPositive ? '+' : ''}{improvement}%
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Recommendations */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recommendation List */}
              <div className="lg:col-span-1 space-y-3">
                {aiRecommendations.map((rec) => (
                  <button
                    key={rec.id}
                    onClick={() => setSelectedRecommendation(rec)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedRecommendation.id === rec.id
                        ? 'border-[#2F6BFF] bg-[#2F6BFF]/5'
                        : 'border-border hover:border-[#2F6BFF]/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {rec.category === 'exercise' && <Dumbbell className="w-4 h-4 text-blue-500" />}
                      {rec.category === 'diet' && <Apple className="w-4 h-4 text-green-500" />}
                      {rec.category === 'sleep' && <Moon className="w-4 h-4 text-purple-500" />}
                      <span className="font-semibold text-sm">{rec.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{rec.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {rec.confidence}% confidence
                      </Badge>
                      <Badge 
                        className={rec.impact === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}
                      >
                        {rec.impact} impact
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>

              {/* Recommendation Details */}
              <Card className="hg-card lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#2F6BFF]/10 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-[#2F6BFF]" />
                      </div>
                      <div>
                        <CardTitle>{selectedRecommendation.title}</CardTitle>
                        <CardDescription>{selectedRecommendation.description}</CardDescription>
                      </div>
                    </div>
                    <Button onClick={handleApplyRecommendation} className="hg-btn-primary">
                      Add to Plan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedRecommendation.exercises && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Recommended Exercises</h4>
                      {selectedRecommendation.exercises.map((exercise, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                          <div>
                            <p className="font-medium">{exercise.name}</p>
                            <p className="text-sm text-muted-foreground">{exercise.intensity}</p>
                          </div>
                          <Badge variant="outline">{exercise.duration}</Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedRecommendation.foods && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Recommended Foods</h4>
                      {selectedRecommendation.foods.map((food, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                          <div>
                            <p className="font-medium">{food.name}</p>
                            <p className="text-sm text-muted-foreground">{food.benefit}</p>
                          </div>
                          <Badge variant="outline">{food.frequency}</Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedRecommendation.tips && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Recommendations</h4>
                      {selectedRecommendation.tips.map((tip, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <p>{tip}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pattern Analysis */}
          <TabsContent value="patterns" className="space-y-6">
            <Card className="hg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#2F6BFF]" />
                  Detected Patterns
                </CardTitle>
                <CardDescription>AI-identified correlations in your health data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patternAnalysis.detected.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
                      <div className="w-10 h-10 rounded-xl bg-[#2F6BFF]/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-[#2F6BFF]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.pattern}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={item.confidence} className="w-24 h-2" />
                          <span className="text-sm text-muted-foreground">{item.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Predictions */}
          <TabsContent value="predictions" className="space-y-6">
            <Card className="hg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Health Predictions
                </CardTitle>
                <CardDescription>AI-powered forecasts based on your current trajectory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patternAnalysis.predictions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.prediction}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{item.confidence}% confidence</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
