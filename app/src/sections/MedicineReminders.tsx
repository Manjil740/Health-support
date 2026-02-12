import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Pill, 
  Clock, 
  Bell, 
  CheckCircle2, 
  Plus,
  Calendar,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

const medications = [
  {
    id: 1,
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    time: '8:00 AM',
    withFood: true,
    active: true,
    taken: true,
    nextDose: 'Tomorrow, 8:00 AM',
    remaining: 15,
    total: 30,
    color: 'blue',
  },
  {
    id: 2,
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    time: '12:00 PM, 8:00 PM',
    withFood: true,
    active: true,
    taken: false,
    nextDose: 'Today, 8:00 PM',
    remaining: 45,
    total: 60,
    color: 'green',
  },
  {
    id: 3,
    name: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    time: '9:00 PM',
    withFood: false,
    active: true,
    taken: false,
    nextDose: 'Today, 9:00 PM',
    remaining: 22,
    total: 30,
    color: 'purple',
  },
  {
    id: 4,
    name: 'Vitamin D3',
    dosage: '2000 IU',
    frequency: 'Once daily',
    time: '8:00 AM',
    withFood: true,
    active: false,
    taken: false,
    nextDose: 'Paused',
    remaining: 60,
    total: 90,
    color: 'amber',
  },
];

const todaysSchedule = [
  { time: '8:00 AM', medications: ['Lisinopril', 'Vitamin D3'], taken: true },
  { time: '12:00 PM', medications: ['Metformin'], taken: true },
  { time: '8:00 PM', medications: ['Metformin'], taken: false },
  { time: '9:00 PM', medications: ['Atorvastatin'], taken: false },
];

export function MedicineReminders() {
  const [meds, setMeds] = useState(medications);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    time: '',
    frequency: 'Once daily',
    withFood: false,
  });

  const handleToggleActive = (id: number) => {
    setMeds(meds.map(m => m.id === id ? { ...m, active: !m.active } : m));
    toast.success('Reminder updated');
  };

  const handleTakeMedication = (_id: number) => {
    toast.success('Medication marked as taken!');
  };

  const handleDelete = (id: number) => {
    setMeds(meds.filter(m => m.id !== id));
    toast.success('Medication removed');
  };

  const handleAddMedication = () => {
    toast.success('Medication added successfully!');
    setShowAddDialog(false);
    setNewMed({ name: '', dosage: '', time: '', frequency: 'Once daily', withFood: false });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0B1B2D] dark:text-white">
              Medicine Reminders
            </h1>
            <p className="text-muted-foreground mt-1">
              Never miss a dose with smart reminders
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="hg-btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Medication Name</Label>
                  <Input 
                    placeholder="e.g., Lisinopril"
                    value={newMed.name}
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Dosage</Label>
                  <Input 
                    placeholder="e.g., 10mg"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input 
                    type="time"
                    value={newMed.time}
                    onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Frequency</Label>
                  <Input 
                    placeholder="e.g., Once daily"
                    value={newMed.frequency}
                    onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={newMed.withFood}
                    onCheckedChange={(checked) => setNewMed({ ...newMed, withFood: checked })}
                  />
                  <Label>Take with food</Label>
                </div>
                <Button onClick={handleAddMedication} className="w-full hg-btn-primary">
                  Add Medication
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Today's Schedule */}
        <Card className="hg-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2F6BFF]" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysSchedule.map((slot, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    slot.taken ? 'bg-green-50 dark:bg-green-900/10' : 'bg-secondary/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      slot.taken ? 'bg-green-100 text-green-600' : 'bg-[#2F6BFF]/10 text-[#2F6BFF]'
                    }`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{slot.time}</p>
                      <p className="text-sm text-muted-foreground">{slot.medications.join(', ')}</p>
                    </div>
                  </div>
                  {slot.taken ? (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Taken
                    </Badge>
                  ) : (
                    <Button size="sm" onClick={() => handleTakeMedication(idx)}>
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Take Now
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medication List */}
        <h2 className="text-xl font-semibold mb-4">Your Medications</h2>
        <div className="space-y-4">
          {meds.map((med) => (
            <Card key={med.id} className={`hg-card ${!med.active ? 'opacity-60' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-${med.color}-100 flex items-center justify-center`}>
                      <Pill className={`w-7 h-7 text-${med.color}-600`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{med.name}</h3>
                        <Badge variant="outline">{med.dosage}</Badge>
                        {med.withFood && (
                          <Badge variant="secondary" className="text-xs">With food</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{med.frequency}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {med.time}
                        </span>
                        <span className="text-muted-foreground">
                          Next: {med.nextDose}
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Remaining</span>
                          <span>{med.remaining} / {med.total}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-${med.color}-500`}
                            style={{ width: `${(med.remaining / med.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={med.active}
                        onCheckedChange={() => handleToggleActive(med.id)}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(med.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    {med.remaining < 10 && (
                      <Badge className="bg-amber-100 text-amber-700">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Low stock
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reminder Settings */}
        <Card className="hg-card mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#2F6BFF]" />
              Reminder Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Get notified on your device</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div>
                  <p className="font-medium">Email Reminders</p>
                  <p className="text-sm text-muted-foreground">Receive email notifications</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div>
                  <p className="font-medium">SMS Reminders</p>
                  <p className="text-sm text-muted-foreground">Get text message alerts</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div>
                  <p className="font-medium">Refill Alerts</p>
                  <p className="text-sm text-muted-foreground">Notify when running low</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
