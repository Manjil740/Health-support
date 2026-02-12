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
    FileText, Plus, Trash2, Edit, Search, Loader2, Eye, X, Stethoscope,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    apiGetMedicalRecords, apiCreateMedicalRecord, apiUpdateMedicalRecord, apiDeleteMedicalRecord,
} from '@/lib/api';

interface MedicalRecord {
    id: number;
    title: string;
    description: string;
    diagnosis: string;
    symptoms: string;
    record_date: string;
    created_at: string;
}

export function MedicalRecordsPage() {
    const { demoMode } = useApp();
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [viewRecord, setViewRecord] = useState<MedicalRecord | null>(null);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [symptoms, setSymptoms] = useState('');

    const load = async () => {
        if (demoMode) {
            setRecords([
                { id: 1, title: 'Annual Physical Exam', description: 'Routine physical examination.', diagnosis: 'Healthy', symptoms: 'None', record_date: '2026-01-15', created_at: '2026-01-15' },
                { id: 2, title: 'Flu Symptoms', description: 'High fever, body aches.', diagnosis: 'Influenza A', symptoms: 'Fever, body aches, fatigue', record_date: '2026-02-01', created_at: '2026-02-01' },
                { id: 3, title: 'Blood Work', description: 'CBC and metabolic panel.', diagnosis: 'Mild iron deficiency', symptoms: 'Fatigue, dizziness', record_date: '2026-02-10', created_at: '2026-02-10' },
            ]);
            setLoading(false); return;
        }
        try { setLoading(true); setRecords(await apiGetMedicalRecords()); }
        catch (err: any) { toast.error('Failed to load', { description: err.message }); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const resetForm = () => { setTitle(''); setDescription(''); setDiagnosis(''); setSymptoms(''); setEditId(null); setShowForm(false); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true);
        try {
            if (editId) { await apiUpdateMedicalRecord(editId, { title, description, diagnosis, symptoms }); toast.success('Updated'); }
            else { await apiCreateMedicalRecord({ title, description, diagnosis, symptoms }); toast.success('Created'); }
            resetForm(); load();
        } catch (err: any) { toast.error('Failed', { description: err.message }); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        try { await apiDeleteMedicalRecord(id); toast.success('Deleted'); load(); }
        catch (err: any) { toast.error('Failed', { description: err.message }); }
    };

    const startEdit = (r: MedicalRecord) => {
        setEditId(r.id); setTitle(r.title); setDescription(r.description || '');
        setDiagnosis(r.diagnosis || ''); setSymptoms(r.symptoms || ''); setShowForm(true);
    };

    const filtered = records.filter(r => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return r.title?.toLowerCase().includes(q) || r.diagnosis?.toLowerCase().includes(q) || r.symptoms?.toLowerCase().includes(q);
    });

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Medical Records</h1>
                        <p className="text-muted-foreground">View and manage your health records</p>
                    </div>
                    <Button className="hg-btn-primary gap-2" onClick={() => { resetForm(); setShowForm(true); }}>
                        <Plus className="w-4 h-4" /> New Record
                    </Button>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search by title, diagnosis, or symptoms..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                </div>

                {showForm && (
                    <Card className="hg-card border-[#2F6BFF]/20 animate-fade-in">
                        <CardHeader>
                            <CardTitle>{editId ? 'Edit Record' : 'New Medical Record'}</CardTitle>
                            <CardDescription>Enter the medical record details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2"><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Annual Physical" required /></div>
                                <div className="space-y-2"><Label>Diagnosis</Label><Input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="e.g. Influenza A" /></div>
                                <div className="space-y-2"><Label>Symptoms</Label><Input value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="e.g. Fever, cough" /></div>
                                <div className="space-y-2 sm:col-span-2"><Label>Description</Label>
                                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Detailed notes..." className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#2F6BFF]" />
                                </div>
                                <div className="sm:col-span-2 flex gap-3">
                                    <Button type="submit" className="hg-btn-primary" disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editId ? 'Update' : 'Create'}</Button>
                                    <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {viewRecord && (
                    <Card className="hg-card border-[#2F6BFF]/20 animate-fade-in">
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2"><Stethoscope className="w-5 h-5 text-[#2F6BFF]" />{viewRecord.title}</CardTitle>
                                <CardDescription>Recorded on {new Date(viewRecord.record_date || viewRecord.created_at).toLocaleDateString()}</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setViewRecord(null)}><X className="w-4 h-4" /></Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {viewRecord.diagnosis && <div><p className="text-sm font-medium text-muted-foreground">Diagnosis</p><p className="font-semibold">{viewRecord.diagnosis}</p></div>}
                            {viewRecord.symptoms && (
                                <div><p className="text-sm font-medium text-muted-foreground">Symptoms</p>
                                    <div className="flex flex-wrap gap-2 mt-1">{viewRecord.symptoms.split(',').map((s, i) => (
                                        <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-full text-xs font-medium">{s.trim()}</span>
                                    ))}</div>
                                </div>
                            )}
                            {viewRecord.description && <div><p className="text-sm font-medium text-muted-foreground">Description</p><p className="whitespace-pre-wrap">{viewRecord.description}</p></div>}
                        </CardContent>
                    </Card>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#2F6BFF]" /></div>
                ) : filtered.length === 0 ? (
                    <Card className="hg-card">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">{searchQuery ? 'No matching records' : 'No medical records yet'}</h3>
                            <p className="text-muted-foreground mb-4">{searchQuery ? 'Try adjusting your search.' : 'Create your first record.'}</p>
                            {!searchQuery && <Button className="hg-btn-primary gap-2" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> New Record</Button>}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {filtered.map(r => (
                            <Card key={r.id} className="hg-card hover:shadow-lg transition-shadow group">
                                <CardContent className="py-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#2F6BFF]/10 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5 text-[#2F6BFF]" /></div>
                                            <div>
                                                <h3 className="font-semibold leading-tight">{r.title}</h3>
                                                <p className="text-xs text-muted-foreground">{new Date(r.record_date || r.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" onClick={() => setViewRecord(r)}><Eye className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => startEdit(r)}><Edit className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(r.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                    {r.diagnosis && <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs font-medium mb-2">{r.diagnosis}</span>}
                                    {r.description && <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
