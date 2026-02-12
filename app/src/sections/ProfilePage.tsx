import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Stethoscope, 
  Building2, 
  Award,
  FileText,
  Clock,
  Edit2,
  Camera,
  Check,
  X,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

const roleSpecificData: Record<string, any> = {
  patient: {
    medicalInfo: {
      bloodType: 'O+',
      height: '5\'10"',
      weight: '165 lbs',
      allergies: ['Penicillin', 'Shellfish'],
      conditions: ['Hypertension'],
      medications: ['Lisinopril', 'Metformin'],
    },
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1 (555) 123-4567',
    },
  },
  doctor: {
    professionalInfo: {
      specialty: 'Cardiology',
      license: 'MD-12345-CA',
      education: 'Stanford University School of Medicine',
      experience: '15 years',
      certifications: ['Board Certified', 'ACLS', 'BLS'],
      languages: ['English', 'Spanish'],
    },
    practiceInfo: {
      hospital: 'City Health Group',
      department: 'Cardiology Department',
      office: 'Building A, Room 302',
      phone: '+1 (555) 987-6543',
    },
  },
  healthcare_worker: {
    professionalInfo: {
      title: 'Registered Nurse',
      license: 'RN-67890-CA',
      education: 'UCLA School of Nursing',
      experience: '8 years',
      certifications: ['RN', 'BLS', 'PALS'],
      department: 'Emergency Department',
    },
  },
  clinic_admin: {
    professionalInfo: {
      title: 'Clinic Administrator',
      department: 'Administration',
      employeeId: 'ADM-001',
      startDate: '2019-03-15',
    },
  },
  platform_admin: {
    professionalInfo: {
      title: 'Platform Administrator',
      department: 'Engineering',
      employeeId: 'ENG-001',
      startDate: '2020-01-10',
    },
  },
};

const activityHistory = [
  { action: 'Updated profile picture', date: '2 days ago', type: 'profile' },
  { action: 'Completed annual checkup', date: '1 week ago', type: 'medical' },
  { action: 'Changed password', date: '2 weeks ago', type: 'security' },
  { action: 'Updated emergency contact', date: '1 month ago', type: 'profile' },
  { action: 'Logged in from new device', date: '1 month ago', type: 'security' },
];

export function ProfilePage() {
  const { user, currentRole } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const roleData = currentRole ? roleSpecificData[currentRole] : roleSpecificData.patient;

  const getRoleDisplayName = () => {
    const names: Record<string, string> = {
      patient: 'Patient',
      doctor: 'Doctor',
      healthcare_worker: 'Healthcare Worker',
      clinic_admin: 'Clinic Administrator',
      platform_admin: 'Platform Administrator',
    };
    return names[currentRole || 'patient'];
  };

  const getRoleBadgeColor = () => {
    const colors: Record<string, string> = {
      patient: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      doctor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      healthcare_worker: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      clinic_admin: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      platform_admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[currentRole || 'patient'];
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="hg-card mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-[#2F6BFF]/10 text-[#2F6BFF] text-3xl">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#2F6BFF] rounded-full flex items-center justify-center text-white hover:bg-[#2F6BFF]/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-[#0B1B2D] dark:text-white">
                    {user?.name || 'Demo User'}
                  </h1>
                  <Badge className={getRoleBadgeColor()}>
                    {getRoleDisplayName()}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{user?.email || 'demo@healthguard.ai'}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    San Francisco, CA
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    +1 (555) 000-0000
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined March 2024
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="hg-btn-primary">
                      <Check className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Basic Information */}
            <Card className="hg-card">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                      defaultValue={user?.name || 'Demo User'} 
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      type="email" 
                      defaultValue={user?.email || 'demo@healthguard.ai'}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input 
                      type="tel" 
                      defaultValue="+1 (555) 000-0000"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input 
                      type="date" 
                      defaultValue="1985-06-15"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea 
                    defaultValue="123 Main Street, San Francisco, CA 94102"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea 
                    defaultValue="Healthcare professional passionate about patient care and medical innovation."
                    disabled={!isEditing}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact (for patients) */}
            {currentRole === 'patient' && roleData.emergencyContact && (
              <Card className="hg-card">
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                  <CardDescription>Who to contact in case of emergency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input 
                        defaultValue={roleData.emergencyContact.name}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Input 
                        defaultValue={roleData.emergencyContact.relationship}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input 
                        type="tel"
                        defaultValue={roleData.emergencyContact.phone}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="professional" className="space-y-6">
            {/* Professional Information */}
            {roleData.professionalInfo && (
              <Card className="hg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {roleData.professionalInfo.specialty && (
                      <div className="space-y-2">
                        <Label>Specialty</Label>
                        <Input defaultValue={roleData.professionalInfo.specialty} disabled={!isEditing} />
                      </div>
                    )}
                    {roleData.professionalInfo.title && (
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input defaultValue={roleData.professionalInfo.title} disabled={!isEditing} />
                      </div>
                    )}
                    {roleData.professionalInfo.license && (
                      <div className="space-y-2">
                        <Label>License Number</Label>
                        <Input defaultValue={roleData.professionalInfo.license} disabled={!isEditing} />
                      </div>
                    )}
                    {roleData.professionalInfo.education && (
                      <div className="space-y-2">
                        <Label>Education</Label>
                        <Input defaultValue={roleData.professionalInfo.education} disabled={!isEditing} />
                      </div>
                    )}
                    {roleData.professionalInfo.experience && (
                      <div className="space-y-2">
                        <Label>Experience</Label>
                        <Input defaultValue={roleData.professionalInfo.experience} disabled={!isEditing} />
                      </div>
                    )}
                    {roleData.professionalInfo.department && (
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Input defaultValue={roleData.professionalInfo.department} disabled={!isEditing} />
                      </div>
                    )}
                  </div>
                  
                  {roleData.professionalInfo.certifications && (
                    <div className="space-y-2">
                      <Label>Certifications</Label>
                      <div className="flex flex-wrap gap-2">
                        {roleData.professionalInfo.certifications.map((cert: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            <Award className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {roleData.professionalInfo.languages && (
                    <div className="space-y-2">
                      <Label>Languages</Label>
                      <div className="flex flex-wrap gap-2">
                        {roleData.professionalInfo.languages.map((lang: string, index: number) => (
                          <Badge key={index} variant="outline">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Practice Information (for doctors) */}
            {currentRole === 'doctor' && roleData.practiceInfo && (
              <Card className="hg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Practice Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hospital/Clinic</Label>
                      <Input defaultValue={roleData.practiceInfo.hospital} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input defaultValue={roleData.practiceInfo.department} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label>Office</Label>
                      <Input defaultValue={roleData.practiceInfo.office} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label>Office Phone</Label>
                      <Input defaultValue={roleData.practiceInfo.phone} disabled={!isEditing} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Medical Information (for patients) */}
            {currentRole === 'patient' && roleData.medicalInfo && (
              <Card className="hg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Medical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Blood Type</Label>
                      <Input defaultValue={roleData.medicalInfo.bloodType} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Height</Label>
                      <Input defaultValue={roleData.medicalInfo.height} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight</Label>
                      <Input defaultValue={roleData.medicalInfo.weight} disabled />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Allergies</Label>
                    <div className="flex flex-wrap gap-2">
                      {roleData.medicalInfo.allergies.map((allergy: string, index: number) => (
                        <Badge key={index} variant="destructive">{allergy}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Medical Conditions</Label>
                    <div className="flex flex-wrap gap-2">
                      {roleData.medicalInfo.conditions.map((condition: string, index: number) => (
                        <Badge key={index} variant="secondary">{condition}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Current Medications</Label>
                    <div className="flex flex-wrap gap-2">
                      {roleData.medicalInfo.medications.map((med: string, index: number) => (
                        <Badge key={index} variant="outline">{med}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="hg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Activity History
                </CardTitle>
                <CardDescription>Recent account activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityHistory.map((activity, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          activity.type === 'security' 
                            ? 'bg-amber-100 text-amber-600' 
                            : activity.type === 'medical'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {activity.type === 'security' ? (
                            <Shield className="w-5 h-5" />
                          ) : activity.type === 'medical' ? (
                            <Stethoscope className="w-5 h-5" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="hg-card">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred Communication</Label>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Email</Badge>
                    <Badge variant="outline">SMS</Badge>
                    <Badge variant="outline">Push</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Appointment Reminders</Label>
                  <div className="flex gap-2">
                    <Badge variant="secondary">24 hours</Badge>
                    <Badge variant="secondary">1 hour</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Input defaultValue="English (US)" disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input defaultValue="Pacific Time (PT)" disabled={!isEditing} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
