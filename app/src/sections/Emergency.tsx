import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Phone, 
  MapPin, 
  Navigation, 
  Ambulance, 
  AlertTriangle,
  Clock,
  Hospital,
  Stethoscope,
  HeartPulse,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

const emergencyContacts = [
  { name: 'Emergency Services', number: '911', type: 'emergency', icon: Phone },
  { name: 'Poison Control', number: '1-800-222-1222', type: 'poison', icon: Shield },
  { name: 'Crisis Hotline', number: '988', type: 'mental', icon: HeartPulse },
];

const nearbyHospitals = [
  { 
    id: 1, 
    name: 'City General Hospital', 
    distance: '0.8 miles', 
    time: '4 min',
    type: 'General',
    er: true,
    rating: 4.5,
    address: '123 Main St, San Francisco, CA',
    phone: '(415) 555-0100',
    open: true,
  },
  { 
    id: 2, 
    name: 'St. Mary Medical Center', 
    distance: '1.2 miles', 
    time: '6 min',
    type: 'Trauma Center',
    er: true,
    rating: 4.7,
    address: '456 Oak Ave, San Francisco, CA',
    phone: '(415) 555-0200',
    open: true,
  },
  { 
    id: 3, 
    name: 'Pacific Heart Institute', 
    distance: '2.1 miles', 
    time: '10 min',
    type: 'Cardiac',
    er: false,
    rating: 4.9,
    address: '789 Pine St, San Francisco, CA',
    phone: '(415) 555-0300',
    open: true,
  },
  { 
    id: 4, 
    name: 'Children\'s Hospital', 
    distance: '3.5 miles', 
    time: '15 min',
    type: 'Pediatric',
    er: true,
    rating: 4.8,
    address: '321 Elm St, San Francisco, CA',
    phone: '(415) 555-0400',
    open: true,
  },
];

const emergencySymptoms = [
  { symptom: 'Chest pain or pressure', urgent: true },
  { symptom: 'Difficulty breathing', urgent: true },
  { symptom: 'Severe bleeding', urgent: true },
  { symptom: 'Loss of consciousness', urgent: true },
  { symptom: 'Severe allergic reaction', urgent: true },
  { symptom: 'Signs of stroke (FAST)', urgent: true },
  { symptom: 'High fever with rash', urgent: false },
  { symptom: 'Persistent vomiting', urgent: false },
];

export function Emergency() {
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [locating, setLocating] = useState(false);
  const [_selectedHospital] = useState<typeof nearbyHospitals[0] | null>(null);

  const handleEmergency = () => {
    setShowEmergencyDialog(true);
  };

  const handleCallEmergency = (number: string) => {
    toast.info(`Dialing ${number}...`);
    window.location.href = `tel:${number}`;
  };

  const handleLocate = () => {
    setLocating(true);
    setTimeout(() => {
      setLocating(false);
      toast.success('Location found! Showing nearest hospitals.');
    }, 2000);
  };

  const handleGetDirections = (hospital: typeof nearbyHospitals[0]) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.address)}`;
    window.open(url, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Emergency Button */}
        <Card className="mb-6 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
              Emergency Assistance
            </h1>
            <p className="text-red-600 dark:text-red-300 mb-6">
              If you are experiencing a life-threatening emergency, call 911 immediately
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg"
                onClick={() => handleCallEmergency('911')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call 911
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 px-8 py-6 text-lg"
                onClick={handleEmergency}
              >
                <Ambulance className="w-5 h-5 mr-2" />
                Find Nearest ER
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {emergencyContacts.map((contact) => (
            <Card key={contact.name} className="hg-card hg-card-hover">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <contact.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-lg font-bold text-[#2F6BFF]">{contact.number}</p>
                  </div>
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => handleCallEmergency(contact.number)}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nearby Hospitals */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Nearby Hospitals</h2>
          <Button variant="outline" onClick={handleLocate} disabled={locating}>
            <Navigation className="w-4 h-4 mr-2" />
            {locating ? 'Locating...' : 'Update Location'}
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          {nearbyHospitals.map((hospital) => (
            <Card key={hospital.id} className="hg-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Hospital className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{hospital.name}</h3>
                        {hospital.er && (
                          <Badge className="bg-red-100 text-red-700">ER Available</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{hospital.address}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {hospital.distance}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {hospital.time} drive
                        </span>
                        <Badge variant="outline">{hospital.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleGetDirections(hospital)}
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Directions
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCallEmergency(hospital.phone)}
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map Placeholder */}
        <Card className="hg-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#2F6BFF]" />
              Hospital Locations
            </CardTitle>
            <CardDescription>Google Maps integration would display here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-[#2F6BFF] mx-auto mb-3" />
                <p className="text-muted-foreground">Google Maps API Integration</p>
                <p className="text-sm text-muted-foreground">Would show nearest hospitals with real-time directions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* When to Seek Emergency Care */}
        <Card className="hg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              When to Seek Emergency Care
            </CardTitle>
            <CardDescription>Recognize the signs that require immediate medical attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {emergencySymptoms.map((item, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    item.urgent 
                      ? 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800' 
                      : 'bg-secondary/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    item.urgent ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {item.urgent ? <AlertTriangle className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                  </div>
                  <span className={item.urgent ? 'font-medium' : ''}>{item.symptom}</span>
                  {item.urgent && <Badge className="ml-auto bg-red-100 text-red-700 text-xs">Urgent</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Dialog */}
        <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                Emergency Assistance
              </DialogTitle>
              <DialogDescription>
                We are locating the nearest emergency room for you
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200">
                <p className="font-semibold text-red-700 mb-1">Nearest ER: City General Hospital</p>
                <p className="text-sm text-red-600">0.8 miles away • 4 minutes</p>
                <p className="text-sm text-red-600">123 Main St, San Francisco, CA</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  onClick={() => handleCallEmergency('911')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call 911
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => handleGetDirections(nearbyHospitals[0])}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
