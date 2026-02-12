import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar, 
  Stethoscope, 
  Pill, 
  Microscope,
  ChevronRight,
  Download,
  Share2,
  Search,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

const diagnoses = [
  {
    id: 1,
    date: '2026-02-10',
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    diagnosis: 'Hypertension Stage 1',
    icd10: 'I10',
    severity: 'moderate',
    status: 'active',
    symptoms: ['Headache', 'Dizziness', 'Fatigue'],
    notes: 'Patient presenting with elevated blood pressure. Recommended lifestyle changes and medication.',
    prescriptions: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
    ],
    tests: ['Blood Pressure Monitoring', 'ECG', 'Blood Work'],
    followUp: '2026-03-10',
  },
  {
    id: 2,
    date: '2026-01-15',
    doctor: 'Dr. Michael Chen',
    specialty: 'General Practitioner',
    diagnosis: 'Type 2 Diabetes',
    icd10: 'E11.9',
    severity: 'mild',
    status: 'managed',
    symptoms: ['Increased thirst', 'Frequent urination'],
    notes: 'HbA1c at 7.2%. Started on Metformin. Dietary counseling provided.',
    prescriptions: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
    ],
    tests: ['HbA1c', 'Fasting Glucose', 'Lipid Panel'],
    followUp: '2026-04-15',
  },
  {
    id: 3,
    date: '2025-11-20',
    doctor: 'Dr. Emily Davis',
    specialty: 'Dermatologist',
    diagnosis: 'Atopic Dermatitis',
    icd10: 'L20.9',
    severity: 'mild',
    status: 'resolved',
    symptoms: ['Itchy skin', 'Red patches'],
    notes: 'Prescribed topical corticosteroid. Condition resolved with treatment.',
    prescriptions: [
      { name: 'Hydrocortisone Cream', dosage: '1%', frequency: 'Apply twice daily' },
    ],
    tests: ['Skin Examination'],
    followUp: null,
  },
];

const labResults = [
  { id: 1, date: '2026-02-08', test: 'Complete Blood Count', result: 'Normal', value: 'All parameters within range' },
  { id: 2, date: '2026-02-08', test: 'Lipid Panel', result: 'Borderline', value: 'LDL slightly elevated' },
  { id: 3, date: '2026-01-14', test: 'HbA1c', result: 'Elevated', value: '7.2% (Target: <7%)' },
  { id: 4, date: '2025-12-10', test: 'Thyroid Function', result: 'Normal', value: 'TSH: 2.1 mIU/L' },
];

export function DiagnosisHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [_selectedDiagnosis] = useState(diagnoses[0]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      mild: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      moderate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      severe: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[severity] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      managed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const handleDownload = () => {
    toast.success('Medical record downloaded');
  };

  const handleShare = () => {
    toast.success('Share link copied to clipboard');
  };

  const filteredDiagnoses = diagnoses.filter(
    (d) =>
      (filterStatus === null || d.status === filterStatus) &&
      (d.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.doctor.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0B1B2D] dark:text-white">
                Diagnosis History
              </h1>
              <p className="text-muted-foreground mt-1">
                Complete medical history and diagnosis records
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Export Records
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="diagnoses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
            <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          </TabsList>

          <TabsContent value="diagnoses" className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search diagnoses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                {['active', 'managed', 'resolved'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(filterStatus === status ? null : status)}
                    className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all ${
                      filterStatus === status
                        ? 'bg-[#2F6BFF] text-white'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredDiagnoses.map((diagnosis) => (
                <Dialog key={diagnosis.id}>
                  <DialogTrigger asChild>
                    <Card className="hg-card hg-card-hover cursor-pointer">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#2F6BFF]/10 flex items-center justify-center">
                              <Stethoscope className="w-6 h-6 text-[#2F6BFF]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{diagnosis.diagnosis}</h3>
                                <Badge variant="outline">{diagnosis.icd10}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {diagnosis.doctor} • {diagnosis.specialty}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={getSeverityBadge(diagnosis.severity)}>
                                  {diagnosis.severity}
                                </Badge>
                                <Badge className={getStatusBadge(diagnosis.status)}>
                                  {diagnosis.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {diagnosis.date}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-[#2F6BFF]" />
                        {diagnosis.diagnosis}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 pt-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-[#2F6BFF]/10 text-[#2F6BFF]">
                            {diagnosis.doctor.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{diagnosis.doctor}</p>
                          <p className="text-sm text-muted-foreground">{diagnosis.specialty}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 rounded-xl bg-secondary/50">
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">{diagnosis.date}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-secondary/50">
                          <p className="text-sm text-muted-foreground">ICD-10</p>
                          <p className="font-medium">{diagnosis.icd10}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-secondary/50">
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge className={getStatusBadge(diagnosis.status)}>{diagnosis.status}</Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Symptoms</h4>
                        <div className="flex flex-wrap gap-2">
                          {diagnosis.symptoms.map((symptom) => (
                            <Badge key={symptom} variant="secondary">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Doctor's Notes</h4>
                        <p className="text-sm text-muted-foreground p-3 rounded-xl bg-secondary/50">
                          {diagnosis.notes}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Prescriptions</h4>
                        <div className="space-y-2">
                          {diagnosis.prescriptions.map((prescription, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                              <Pill className="w-5 h-5 text-[#2F6BFF]" />
                              <div>
                                <p className="font-medium">{prescription.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {prescription.dosage} • {prescription.frequency}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Tests Ordered</h4>
                        <div className="flex flex-wrap gap-2">
                          {diagnosis.tests.map((test) => (
                            <Badge key={test} variant="outline" className="flex items-center gap-1">
                              <Microscope className="w-3 h-3" />
                              {test}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {diagnosis.followUp && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10">
                          <Clock className="w-5 h-5 text-amber-500" />
                          <span className="text-sm">Follow-up scheduled for {diagnosis.followUp}</span>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" className="flex-1" onClick={handleDownload}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={handleShare}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lab-results" className="space-y-6">
            <div className="grid gap-4">
              {labResults.map((result) => (
                <Card key={result.id} className="hg-card">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                          <Microscope className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{result.test}</h3>
                          <p className="text-sm text-muted-foreground">{result.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          className={
                            result.result === 'Normal' 
                              ? 'bg-green-100 text-green-700' 
                              : result.result === 'Borderline'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }
                        >
                          {result.result}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{result.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <div className="relative pl-8 border-l-2 border-border space-y-8">
              {diagnoses.map((diagnosis) => (
                <div key={diagnosis.id} className="relative">
                  <div className="absolute -left-[41px] w-6 h-6 rounded-full bg-[#2F6BFF] border-4 border-white dark:border-[#0B1B2D]" />
                  <Card className="hg-card">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{diagnosis.date}</p>
                          <h3 className="font-semibold">{diagnosis.diagnosis}</h3>
                          <p className="text-sm text-muted-foreground">{diagnosis.doctor}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getStatusBadge(diagnosis.status)}>
                              {diagnosis.status}
                            </Badge>
                            <Badge variant="outline">{diagnosis.icd10}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
