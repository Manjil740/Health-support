import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Moon, 
  Sun, 
  Monitor, 
  Eye, 
  Type, 
  Bell, 
  Shield, 
  User, 
  Globe,
  Palette,
  Check,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { toast } from 'sonner';

const accentColors = [
  { name: 'Blue', value: '#2F6BFF', class: 'bg-[#2F6BFF]' },
  { name: 'Green', value: '#10B981', class: 'bg-[#10B981]' },
  { name: 'Purple', value: '#8B5CF6', class: 'bg-[#8B5CF6]' },
  { name: 'Orange', value: '#F59E0B', class: 'bg-[#F59E0B]' },
  { name: 'Pink', value: '#EC4899', class: 'bg-[#EC4899]' },
  { name: 'Red', value: '#EF4444', class: 'bg-[#EF4444]' },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export function SettingsPage() {
  const { theme, setTheme, accentColor, setAccentColor } = useApp();
  const [fontSize, setFontSize] = useState(100);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [labResults, setLabResults] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleSaveAppearance = () => {
    toast.success('Appearance settings saved');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0B1B2D] dark:text-white">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Customize your HealthGuard AI experience
          </p>
        </div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="hg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme
                </CardTitle>
                <CardDescription>Choose your preferred color scheme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === 'light' 
                        ? 'border-[#2F6BFF] bg-[#2F6BFF]/5' 
                        : 'border-border hover:border-[#2F6BFF]/30'
                    }`}
                  >
                    <Sun className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                    <p className="text-sm font-medium">Light</p>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === 'dark' 
                        ? 'border-[#2F6BFF] bg-[#2F6BFF]/5' 
                        : 'border-border hover:border-[#2F6BFF]/30'
                    }`}
                  >
                    <Moon className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
                    <p className="text-sm font-medium">Dark</p>
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === 'system' 
                        ? 'border-[#2F6BFF] bg-[#2F6BFF]/5' 
                        : 'border-border hover:border-[#2F6BFF]/30'
                    }`}
                  >
                    <Monitor className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm font-medium">System</p>
                  </button>
                  <button
                    onClick={() => setTheme('high-contrast')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === 'high-contrast' 
                        ? 'border-[#2F6BFF] bg-[#2F6BFF]/5' 
                        : 'border-border hover:border-[#2F6BFF]/30'
                    }`}
                  >
                    <Eye className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">High Contrast</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="hg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Accent Color
                </CardTitle>
                <CardDescription>Choose your preferred accent color</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      className={`w-12 h-12 rounded-xl ${color.class} transition-all ${
                        accentColor === color.value 
                          ? 'ring-4 ring-offset-2 ring-[#2F6BFF] scale-110' 
                          : 'hover:scale-105'
                      }`}
                      title={color.name}
                    >
                      {accentColor === color.value && (
                        <Check className="w-5 h-5 text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Typography
                </CardTitle>
                <CardDescription>Adjust text size and readability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Font Size</Label>
                    <span className="text-sm text-muted-foreground">{fontSize}%</span>
                  </div>
                  <Slider
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                    min={80}
                    max={150}
                    step={10}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Adjust the base font size throughout the application
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <Switch
                    checked={reducedMotion}
                    onCheckedChange={setReducedMotion}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="hg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Language
                </CardTitle>
                <CardDescription>Select your preferred language</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        selectedLanguage === lang.code 
                          ? 'border-[#2F6BFF] bg-[#2F6BFF]/5' 
                          : 'border-border hover:border-[#2F6BFF]/30'
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveAppearance} className="hg-btn-primary">
                Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="hg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Control how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on your devices
                    </p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminded about upcoming appointments
                    </p>
                  </div>
                  <Switch
                    checked={appointmentReminders}
                    onCheckedChange={setAppointmentReminders}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Lab Results</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new lab results are available
                    </p>
                  </div>
                  <Switch
                    checked={labResults}
                    onCheckedChange={setLabResults}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive news, updates, and promotional content
                    </p>
                  </div>
                  <Switch
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveNotifications} className="hg-btn-primary">
                Save Preferences
              </Button>
            </div>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="hg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy Controls
                </CardTitle>
                <CardDescription>Manage your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow other users to see your profile
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">AI Usage Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Share anonymized data to improve AI recommendations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Activity Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Log account activity for security purposes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div>
                  <Label className="font-medium mb-3 block">Data Export</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Download a copy of your personal data
                  </p>
                  <Button variant="outline">
                    Request Data Export
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="font-medium text-destructive mb-3 block">Delete Account</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card className="hg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Information
                </CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue="Demo" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue="User" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" defaultValue="demo@healthguard.ai" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input type="tel" placeholder="+1 (555) 000-0000" />
                </div>
              </CardContent>
            </Card>

            <Card className="hg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="font-medium mb-3 block">Change Password</Label>
                  <div className="space-y-3">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <Button className="mt-3" variant="outline">
                    Update Password
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="font-medium mb-3 block">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">
                    Enable 2FA
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="font-medium mb-3 block">Active Sessions</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <Laptop className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Chrome on MacOS</p>
                          <p className="text-xs text-muted-foreground">Current session</p>
                        </div>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">iPhone 15</p>
                          <p className="text-xs text-muted-foreground">Last active 2 hours ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="hg-btn-primary">
                Save Changes
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
