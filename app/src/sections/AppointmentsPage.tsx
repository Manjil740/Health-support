import { useState, useEffect } from 'react';
import { useApp } from '@/App';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
    Calendar, Clock, Plus, Trash2, Edit, CheckCircle2, XCircle, Loader2, AlertCircle, User, Video,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    apiGetAppointments, apiCreateAppointment, apiUpdateAppointment, apiDeleteAppointment, apiStartVideoCall,
} from '@/lib/api';

interface Appointment {
    id: number;
    appointment_date: string;
    duration: number;
    status: string;
    reason: string;
    notes: string;
    doctor_name?: string;
    created_at: string;
}

const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    completed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export function AppointmentsPage() {
    const { demoMode } = useApp();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [reason, setReason] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [duration, setDuration] = useState('30');
    const [notes, setNotes] = useState('');
    const [doctorId, setDoctorId] = useState('');

    const loadAppointments = async () => {
        if (demoMode) {
            setAppointments([
                { id: 1, appointment_date: '2026-02-15T10:00:00', duration: 30, status: 'scheduled', reason: 'Annual checkup', notes: '', doctor_name: 'Dr. Smith', created_at: '2026-02-10' },
                { id: 2, appointment_date: '2026-02-20T14:30:00', duration: 45, status: 'confirmed', reason: 'Follow-up consultation', notes: 'Bring lab results', doctor_name: 'Dr. Johnson', created_at: '2026-02-11' },
            ]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await apiGetAppointments();
            setAppointments(data);
        } catch (err: any) {
            toast.error('Failed to load appointments', { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAppointments(); }, []);

    const resetForm = () => {
        setReason(''); setAppointmentDate(''); setDuration('30'); setNotes(''); setDoctorId('');
        setEditId(null); setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editId) {
                await apiUpdateAppointment(editId, { reason, appointment_date: appointmentDate, duration: parseInt(duration), notes });
                toast.success('Appointment updated');
            } else {
                await apiCreateAppointment({ reason, appointment_date: appointmentDate, duration: parseInt(duration), notes, doctor: doctorId ? parseInt(doctorId) : undefined });
                toast.success('Appointment booked!');
            }
            resetForm(); loadAppointments();
        } catch (err: any) {
            toast.error('Failed to save', { description: err.message });
        } finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        try { await apiDeleteAppointment(id); toast.success('Deleted'); loadAppointments(); }
        catch (err: any) { toast.error('Failed', { description: err.message }); }
    };

    const handleStatusChange = async (id: number, status: string) => {
        try { await apiUpdateAppointment(id, { status }); toast.success(`Appointment ${status}`); loadAppointments(); }
        catch (err: any) { toast.error('Failed', { description: err.message }); }
    };

    const handleStartVideoCall = async (id: number) => {
        try {
            const response = await apiStartVideoCall(id);
            toast.success('Starting video call...');
            // In a real implementation, this would navigate to a video call page
            // For now, we'll open the video call section
            window.location.hash = '#video-call';
        } catch (err: any) {
            toast.error('Failed to start video call', { description: err.message });
        }
    };

    const startEdit = (a: Appointment) => {
        setEditId(a.id); setReason(a.reason || ''); setAppointmentDate(a.appointment_date?.slice(0, 16) || '');
        setDuration(String(a.duration || 30)); setNotes(a.notes || ''); setShowForm(true);
    };

    const fmt = (iso: string) => {
        try { return new Date(iso).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); }
        catch { return iso; }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
                        <p className="text-muted-foreground">Manage your medical appointments</p>
                    </div>
                    <Button className="hg-btn-primary gap-2" onClick={() => { resetForm(); setShowForm(true); }}>
                        <Plus className="w-4 h-4" /> Book Appointment
                    </Button>
                </div>

                {/* Form */}
                {showForm && (
                    <Card className="hg-card border-[#2F6BFF]/20 animate-fade-in">
                        <CardHeader>
                            <CardTitle>{editId ? 'Edit Appointment' : 'Book New Appointment'}</CardTitle>
                            <CardDescription>{editId ? 'Update details' : 'Fill in the details'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2"><Label>Reason</Label><Input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Annual checkup" required /></div>
                                <div className="space-y-2"><Label>Date & Time</Label><Input type="datetime-local" value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} required /></div>
                                <div className="space-y-2"><Label>Duration (min)</Label><Input type="number" value={duration} onChange={e => setDuration(e.target.value)} min="15" step="15" /></div>
                                <div className="space-y-2"><Label>Doctor ID</Label><Input type="number" value={doctorId} onChange={e => setDoctorId(e.target.value)} placeholder="Optional" /></div>
                                <div className="space-y-2 sm:col-span-2"><Label>Notes</Label><Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." /></div>
                                <div className="sm:col-span-2 flex gap-3">
                                    <Button type="submit" className="hg-btn-primary" disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editId ? 'Update' : 'Book'}</Button>
                                    <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#2F6BFF]" /></div>
                ) : appointments.length === 0 ? (
                    <Card className="hg-card">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <Calendar className="w-16 h-16 text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No appointments yet</h3>
                            <p className="text-muted-foreground mb-4">Book your first appointment.</p>
                            <Button className="hg-btn-primary gap-2" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Book</Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {appointments.map(a => (
                            <Card key={a.id} className="hg-card hover:shadow-lg transition-shadow">
                                <CardContent className="flex items-center gap-4 py-5">
                                    <div className="w-14 h-14 bg-[#2F6BFF]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-6 h-6 text-[#2F6BFF]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold truncate">{a.reason || 'Appointment'}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[a.status] || statusColors.scheduled}`}>{a.status}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{fmt(a.appointment_date)} · {a.duration}min</span>
                                            {a.doctor_name && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{a.doctor_name}</span>}
                                        </div>
                                        {a.notes && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {a.notes}</p>}
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        {a.status === 'confirmed' && <Button variant="outline" size="sm" className="gap-1" onClick={() => handleStartVideoCall(a.id)}><Video className="w-4 h-4" /> Video Call</Button>}
                                        {a.status === 'scheduled' && <Button variant="ghost" size="icon" className="text-green-600" onClick={() => handleStatusChange(a.id, 'confirmed')}><CheckCircle2 className="w-4 h-4" /></Button>}
                                        <Button variant="ghost" size="icon" onClick={() => startEdit(a)}><Edit className="w-4 h-4" /></Button>
                                        {a.status !== 'cancelled' && <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleStatusChange(a.id, 'cancelled')}><XCircle className="w-4 h-4" /></Button>}
                                        <Button variant="ghost" size="icon" className="text-red-400" onClick={() => handleDelete(a.id)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
