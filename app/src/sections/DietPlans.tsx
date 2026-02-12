import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Apple, 
  Leaf, 
  Beef,
  Fish,
  Clock,
  Flame,
  Download,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

const dietPlans = [
  {
    id: 'mediterranean',
    name: 'Mediterranean Diet',
    description: 'Heart-healthy eating based on traditional Mediterranean cuisine',
    icon: Fish,
    color: 'blue',
    calories: '2000-2200',
    duration: 'Ongoing',
    benefits: ['Heart health', 'Brain function', 'Longevity'],
    meals: {
      breakfast: ['Greek yogurt with berries', 'Whole grain toast', 'Olive oil drizzle'],
      lunch: ['Grilled salmon', 'Quinoa salad', 'Mixed greens'],
      dinner: ['Chicken souvlaki', 'Roasted vegetables', 'Hummus'],
      snacks: ['Nuts', 'Fresh fruit', 'Olives'],
    },
    restrictions: ['Limit red meat', 'Minimize processed foods'],
  },
  {
    id: 'keto',
    name: 'Ketogenic Diet',
    description: 'Low-carb, high-fat diet for weight loss and metabolic health',
    icon: Beef,
    color: 'red',
    calories: '1800-2000',
    duration: '8-12 weeks',
    benefits: ['Weight loss', 'Blood sugar control', 'Mental clarity'],
    meals: {
      breakfast: ['Eggs with avocado', 'Bacon', 'Bulletproof coffee'],
      lunch: ['Grilled chicken', 'Caesar salad', 'Olive oil dressing'],
      dinner: ['Salmon', 'Asparagus', 'Butter sauce'],
      snacks: ['Cheese', 'Macadamia nuts', 'Celery with almond butter'],
    },
    restrictions: ['No sugar', 'No grains', 'Limit carbs to 20-50g/day'],
  },
  {
    id: 'plant-based',
    name: 'Plant-Based Diet',
    description: 'Nutrient-rich diet focused on whole plant foods',
    icon: Leaf,
    color: 'green',
    calories: '1900-2100',
    duration: 'Ongoing',
    benefits: ['Reduced inflammation', 'Heart health', 'Environmental'],
    meals: {
      breakfast: ['Oatmeal with fruit', 'Chia seeds', 'Plant milk'],
      lunch: ['Buddha bowl', 'Chickpeas', 'Tahini dressing'],
      dinner: ['Lentil curry', 'Brown rice', 'Steamed vegetables'],
      snacks: ['Hummus with veggies', 'Fruit', 'Trail mix'],
    },
    restrictions: ['No animal products', 'Minimize processed foods'],
  },
  {
    id: 'dash',
    name: 'DASH Diet',
    description: 'Dietary Approaches to Stop Hypertension',
    icon: Apple,
    color: 'purple',
    calories: '2000',
    duration: 'Ongoing',
    benefits: ['Lower blood pressure', 'Heart health', 'Weight management'],
    meals: {
      breakfast: ['Whole grain cereal', 'Banana', 'Low-fat milk'],
      lunch: ['Turkey sandwich', 'Vegetable soup', 'Fresh fruit'],
      dinner: ['Grilled fish', 'Sweet potato', 'Broccoli'],
      snacks: ['Low-fat yogurt', 'Unsalted nuts', 'Raw vegetables'],
    },
    restrictions: ['Limit sodium', 'Reduce saturated fat'],
  },
];

const aiRecommendedPlan = {
  name: 'Anti-Inflammatory Plan',
  reason: 'Based on your inflammation markers and health goals',
  confidence: 92,
  dailyCalories: 2100,
  macros: { protein: 25, carbs: 45, fats: 30 },
  keyFoods: ['Fatty fish', 'Leafy greens', 'Berries', 'Turmeric', 'Ginger'],
};

export function DietPlans() {
  const [selectedPlan, setSelectedPlan] = useState<typeof dietPlans[0] | null>(null);
  const [activeTab, setActiveTab] = useState('recommended');

  const handleStartPlan = () => {
    toast.success(`Started ${selectedPlan?.name}!`);
    setSelectedPlan(null);
  };

  const handleDownload = () => {
    toast.success('Diet plan downloaded');
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0B1B2D] dark:text-white">
            Diet Plans
          </h1>
          <p className="text-muted-foreground mt-1">
            Personalized nutrition plans for your health goals
          </p>
        </div>

        {/* AI Recommended */}
        <Card className="hg-card mb-8 border-[#2F6BFF]/30 bg-[#2F6BFF]/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#2F6BFF] flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <Badge className="bg-[#2F6BFF] text-white mb-2">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Recommended
                  </Badge>
                  <h2 className="text-xl font-bold">{aiRecommendedPlan.name}</h2>
                  <p className="text-muted-foreground">{aiRecommendedPlan.reason}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant="secondary">{aiRecommendedPlan.confidence}% match</Badge>
                    <Badge variant="outline">{aiRecommendedPlan.dailyCalories} kcal/day</Badge>
                  </div>
                </div>
              </div>
              <Button className="hg-btn-primary">
                Start This Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="heart-health">Heart Health</TabsTrigger>
            <TabsTrigger value="weight-loss">Weight Loss</TabsTrigger>
            <TabsTrigger value="specialty">Specialty</TabsTrigger>
          </TabsList>

          <TabsContent value="recommended" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {dietPlans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <Card key={plan.id} className="hg-card hg-card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-${plan.color}-100 flex items-center justify-center`}>
                          <Icon className={`w-7 h-7 text-${plan.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {plan.benefits.map((benefit) => (
                              <Badge key={benefit} variant="secondary" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Flame className="w-4 h-4" />
                              {plan.calories} kcal
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {plan.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setSelectedPlan(plan)}
                        >
                          View Details
                        </Button>
                        <Button className="flex-1 hg-btn-primary">
                          Start Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="heart-health">
            <Card className="hg-card p-8 text-center">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Heart-Healthy Plans</h3>
              <p className="text-muted-foreground">Plans designed to improve cardiovascular health</p>
            </Card>
          </TabsContent>

          <TabsContent value="weight-loss">
            <Card className="hg-card p-8 text-center">
              <TrendingDown className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Weight Loss Plans</h3>
              <p className="text-muted-foreground">Calorie-controlled plans for healthy weight loss</p>
            </Card>
          </TabsContent>

          <TabsContent value="specialty">
            <Card className="hg-card p-8 text-center">
              <Leaf className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Specialty Diets</h3>
              <p className="text-muted-foreground">Plans for specific health conditions</p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Plan Details Dialog */}
        <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedPlan && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <selectedPlan.icon className="w-6 h-6" />
                    {selectedPlan.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  <p className="text-muted-foreground">{selectedPlan.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Daily Calories</p>
                      <p className="text-xl font-bold">{selectedPlan.calories}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="text-xl font-bold">{selectedPlan.duration}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Sample Meal Plan</h4>
                    <div className="space-y-3">
                      {Object.entries(selectedPlan.meals).map(([meal, foods]) => (
                        <div key={meal} className="p-3 rounded-xl bg-secondary/50">
                          <p className="font-medium capitalize mb-1">{meal}</p>
                          <p className="text-sm text-muted-foreground">{foods.join(', ')}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Key Restrictions</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlan.restrictions.map((restriction) => (
                        <Badge key={restriction} variant="outline">
                          {restriction}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleStartPlan} className="flex-1 hg-btn-primary">
                      Start This Plan
                    </Button>
                    <Button variant="outline" onClick={handleDownload}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

import { Heart, TrendingDown } from 'lucide-react';
