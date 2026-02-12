import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Apple, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Flame,
  Droplets,
  Wheat,
  Beef,
  Leaf,
  Info,
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { toast } from 'sonner';

const macroData = [
  { name: 'Protein', value: 25, color: '#3B82F6' },
  { name: 'Carbs', value: 45, color: '#10B981' },
  { name: 'Fats', value: 30, color: '#F59E0B' },
];

const goodFoods = [
  { name: 'Salmon', category: 'Protein', benefit: 'Omega-3 fatty acids', calories: 208, tags: ['heart-healthy', 'anti-inflammatory'] },
  { name: 'Blueberries', category: 'Fruit', benefit: 'Antioxidants', calories: 57, tags: ['brain-health', 'low-glycemic'] },
  { name: 'Spinach', category: 'Vegetable', benefit: 'Iron & Vitamins', calories: 23, tags: ['iron-rich', 'low-calorie'] },
  { name: 'Quinoa', category: 'Grain', benefit: 'Complete protein', calories: 120, tags: ['gluten-free', 'high-fiber'] },
  { name: 'Greek Yogurt', category: 'Dairy', benefit: 'Probiotics', calories: 59, tags: ['gut-health', 'protein'] },
  { name: 'Almonds', category: 'Nuts', benefit: 'Healthy fats', calories: 164, tags: ['heart-healthy', 'satiety'] },
  { name: 'Broccoli', category: 'Vegetable', benefit: 'Vitamin C & Fiber', calories: 34, tags: ['immune-support', 'detox'] },
  { name: 'Sweet Potato', category: 'Vegetable', benefit: 'Beta-carotene', calories: 86, tags: ['eye-health', 'fiber'] },
];

const badFoods = [
  { name: 'Processed Meats', category: 'Protein', concern: 'High sodium & preservatives', alternative: 'Fresh lean meats' },
  { name: 'Sugary Drinks', category: 'Beverage', concern: 'Empty calories & sugar spike', alternative: 'Water, herbal tea' },
  { name: 'Trans Fats', category: 'Fat', concern: 'Raises bad cholesterol', alternative: 'Olive oil, avocado' },
  { name: 'Refined Carbs', category: 'Grain', concern: 'Blood sugar spikes', alternative: 'Whole grains' },
  { name: 'Fast Food', category: 'Mixed', concern: 'High calories & sodium', alternative: 'Home-cooked meals' },
  { name: 'Artificial Sweeteners', category: 'Additive', concern: 'May affect gut health', alternative: 'Natural sweeteners' },
];

const dailyNutrition = {
  calories: { current: 1850, target: 2200 },
  protein: { current: 95, target: 120 },
  carbs: { current: 180, target: 200 },
  fats: { current: 65, target: 70 },
  fiber: { current: 22, target: 30 },
  water: { current: 6, target: 8 },
};

export function NutritionDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogFood = () => {
    toast.success('Food logged successfully!');
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0B1B2D] dark:text-white">
            Nutrition Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your nutrition and make healthier food choices
          </p>
        </div>

        {/* Daily Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="hg-card">
            <CardContent className="p-5">
              <Flame className="w-6 h-6 text-orange-500 mb-2" />
              <p className="text-2xl font-bold">{dailyNutrition.calories.current}</p>
              <p className="text-xs text-muted-foreground">/ {dailyNutrition.calories.target} kcal</p>
              <Progress value={(dailyNutrition.calories.current / dailyNutrition.calories.target) * 100} className="mt-2" />
            </CardContent>
          </Card>
          <Card className="hg-card">
            <CardContent className="p-5">
              <Beef className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{dailyNutrition.protein.current}g</p>
              <p className="text-xs text-muted-foreground">/ {dailyNutrition.protein.target}g protein</p>
              <Progress value={(dailyNutrition.protein.current / dailyNutrition.protein.target) * 100} className="mt-2" />
            </CardContent>
          </Card>
          <Card className="hg-card">
            <CardContent className="p-5">
              <Wheat className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-2xl font-bold">{dailyNutrition.carbs.current}g</p>
              <p className="text-xs text-muted-foreground">/ {dailyNutrition.carbs.target}g carbs</p>
              <Progress value={(dailyNutrition.carbs.current / dailyNutrition.carbs.target) * 100} className="mt-2" />
            </CardContent>
          </Card>
          <Card className="hg-card">
            <CardContent className="p-5">
              <Droplets className="w-6 h-6 text-cyan-500 mb-2" />
              <p className="text-2xl font-bold">{dailyNutrition.water.current}</p>
              <p className="text-xs text-muted-foreground">/ {dailyNutrition.water.target} glasses</p>
              <Progress value={(dailyNutrition.water.current / dailyNutrition.water.target) * 100} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="good-foods">Healthy Foods</TabsTrigger>
            <TabsTrigger value="avoid">Foods to Avoid</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Macro Breakdown */}
              <Card className="hg-card">
                <CardHeader>
                  <CardTitle>Macro Breakdown</CardTitle>
                  <CardDescription>Today's macronutrient distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    {macroData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Nutrition Goals */}
              <Card className="hg-card">
                <CardHeader>
                  <CardTitle>Daily Goals</CardTitle>
                  <CardDescription>Progress towards your nutrition targets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(dailyNutrition).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm capitalize">{key}</span>
                        <span className="text-sm text-muted-foreground">
                          {value.current} / {value.target}
                          {key === 'water' ? ' glasses' : key === 'calories' ? ' kcal' : 'g'}
                        </span>
                      </div>
                      <Progress value={(value.current / value.target) * 100} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="hg-card">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleLogFood}>
                    <Apple className="w-4 h-4 mr-2" />
                    Log Food
                  </Button>
                  <Button variant="outline">
                    <Leaf className="w-4 h-4 mr-2" />
                    View Diet Plans
                  </Button>
                  <Button variant="outline">
                    <Info className="w-4 h-4 mr-2" />
                    Nutrition Tips
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="good-foods" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {goodFoods.map((food) => (
                <Card key={food.name} className="hg-card hg-card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <Badge variant="outline" className="text-xs">{food.calories} cal</Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{food.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{food.category}</p>
                    <p className="text-xs text-green-600 mb-3">{food.benefit}</p>
                    <div className="flex flex-wrap gap-1">
                      {food.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="avoid" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badFoods.map((food) => (
                <Card key={food.name} className="hg-card border-red-200 dark:border-red-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{food.name}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{food.category}</p>
                        <p className="text-sm text-red-600 mb-2">{food.concern}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-muted-foreground">Instead: {food.alternative}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
