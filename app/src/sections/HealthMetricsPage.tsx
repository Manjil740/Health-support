import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/App';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
    Activity, Plus, Trash2, Loader2, TrendingUp, Heart, Droplets, Scale, Thermometer, Wind,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    apiGetHealthMetrics, apiCreateHealthMetric, apiDeleteHealthMetric,
} from '@/lib/api';

interface HealthMetric {
    id: number;
    metric_type: string;
    value: string;
    unit: string;
    notes: string;
    recorded_at: string;
}

const metricTypes = [
    { id: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg', icon: Heart, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
    { id: 'heart_rate', label: 'Heart Rate', unit: 'bpm', icon: Activity, color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/30' },
    { id: 'weight', label: 'Weight', unit: 'kg', icon: Scale, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: 'blood_sugar', label: 'Blood Sugar', unit: 'mg/dL', icon: Droplets, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { id: 'temperature', label: 'Temperature', unit: '°F', icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { id: 'spo2', label: 'SpO2', unit: '%', icon: Wind, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
];

export function HealthMetricsPage() {
    const { demoMode } = useApp();
    const [metrics, setMetrics] = useState<HealthMetric[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [filterType, setFilterType] = useState<string>('all');
    const [metricType, setMetricType] = useState('blood_pressure');
    const [value, setValue] = useState('');
    const [unit, setUnit] = useState('mmHg');
    const [notes, setNotes] = useState('');

    const load = async () => {
        if (demoMode) {
            setMetrics([
                { id: 1, metric_type: 'blood_pressure', value: '120/80', unit: 'mmHg', notes: 'Normal', recorded_at: '2026-02-12T08:00:00' },
                { id: 2, metric_type: 'heart_rate', value: '72', unit: 'bpm', notes: 'Resting', recorded_at: '2026-02-12T08:05:00' },
                { id: 3, metric_type: 'weight', value: '70', unit: 'kg', notes: 'Morning', recorded_at: '2026-02-12T07:00:00' },
                { id: 4, metric_type: 'blood_sugar', value: '95', unit: 'mg/dL', notes: 'Fasting', recorded_at: '2026-02-12T07:30:00' },
                { id: 5, metric_type: 'temperature', value: '98.6', unit: '°F', notes: '', recorded_at: '2026-02-12T08:10:00' },
                { id: 6, metric_type: 'spo2', value: '98', unit: '%', notes: '', recorded_at: '2026-02-12T08:15:00' },
                { id: 7, metric_type: 'blood_pressure', value: '118/78', unit: 'mmHg', notes: '', recorded_at: '2026-02-11T08:00:00' },
            ]);
            setLoading(false); return;
        }
        try { setLoading(true); setMetrics(await apiGetHealthMetrics()); }
        catch (err: any) { toast.error('Failed to load', { description: err.message }); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const handleTypeSelect = (id: string) => {
        setMetricType(id);
        const mt = metricTypes.find(m => m.id === id);
        if (mt) setUnit(mt.unit);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true);
        try {
            await apiCreateHealthMetric({ metric_type: metricType, value, unit, notes });
            toast.success('Metric recorded!'); setValue(''); setNotes(''); setShowForm(false); load();
        } catch (err: any) { toast.error('Failed', { description: err.message }); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        try { await apiDeleteHealthMetric(id); toast.success('Deleted'); load(); }
        catch (err: any) { toast.error('Failed', { description: err.message }); }
    };

    const filtered = filterType === 'all' ? metrics : metrics.filter(m => m.metric_type === filterType);

    const latestByType = useMemo(() => {
        const map: Record<string, HealthMetric> = {};
        for (const m of metrics) {
            if (!map[m.metric_type] || m.recorded_at > map[m.metric_type].recorded_at) map[m.metric_type] = m;
        }
        return map;
    }, [metrics]);

    const getMeta = (type: string) => metricTypes.find(m => m.id === type) || metricTypes[0];

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Health Metrics</h1>
                        <p className="text-muted-foreground">Track and visualize your vital signs</p>
                    </div>
                    <Button className="hg-btn-primary gap-2" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Log Metric</Button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                    {metricTypes.map(mt => {
                        const Icon = mt.icon;
                        const latest = latestByType[mt.id];
                        return (
                            <Card key={mt.id} className={`hg-card cursor-pointer transition-all hover:shadow-lg ${filterType === mt.id ? 'ring-2 ring-[#2F6BFF]' : ''}`}
                                onClick={() => setFilterType(filterType === mt.id ? 'all' : mt.id)}>
                                <CardContent className="py-4 text-center">
                                    <div className={`w-10 h-10 ${mt.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}><Icon className={`w-5 h-5 ${mt.color}`} /></div>
                                    <p className="text-xs text-muted-foreground font-medium">{mt.label}</p>
                                    <p className="text-lg font-bold text-foreground mt-1">{latest ? latest.value : '—'}</p>
                                    <p className="text-xs text-muted-foreground">{mt.unit}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Form */}
                {showForm && (
                    <Card className="hg-card border-[#2F6BFF]/20 animate-fade-in">
                        <CardHeader><CardTitle>Log New Metric</CardTitle><CardDescription>Record a new measurement</CardDescription></CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label className="mb-2 block">Type</Label>
                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                        {metricTypes.map(mt => {
                                            const Icon = mt.icon;
                                            return (
                                                <button key={mt.id} type="button" onClick={() => handleTypeSelect(mt.id)}
                                                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-xs font-medium ${metricType === mt.id ? 'border-[#2F6BFF] bg-[#2F6BFF]/10 text-[#2F6BFF]' : 'border-border hover:border-[#2F6BFF]/50'
                                                        }`}>
                                                    <Icon className="w-4 h-4" />{mt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-2"><Label>Value</Label><Input value={value} onChange={e => setValue(e.target.value)} placeholder="e.g. 120/80" required /></div>
                                    <div className="space-y-2"><Label>Unit</Label><Input value={unit} onChange={e => setUnit(e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Notes</Label><Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. After exercise" /></div>
                                </div>
                                <div className="flex gap-3">
                                    <Button type="submit" className="hg-btn-primary" disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Record'}</Button>
                                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Trend Chart */}
                {filterType !== 'all' && filtered.length > 1 && (
                    <Card className="hg-card">
                        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-[#2F6BFF]" />{getMeta(filterType).label} Trend</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 h-32">
                                {[...filtered].reverse().slice(-10).map(m => {
                                    const numVal = parseFloat(m.value.split('/')[0]) || 0;
                                    const maxVal = Math.max(...filtered.map(f => parseFloat(f.value.split('/')[0]) || 0));
                                    const height = maxVal ? (numVal / maxVal) * 100 : 50;
                                    return (
                                        <div key={m.id} className="flex-1 flex flex-col items-center gap-1">
                                            <span className="text-[10px] text-muted-foreground">{m.value}</span>
                                            <div className="w-full bg-gradient-to-t from-[#2F6BFF] to-[#2F6BFF]/60 rounded-t-md transition-all" style={{ height: `${Math.max(height, 10)}%` }} />
                                            <span className="text-[9px] text-muted-foreground">{new Date(m.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* History */}
                {loading ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#2F6BFF]" /></div>
                ) : filtered.length === 0 ? (
                    <Card className="hg-card">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <Activity className="w-16 h-16 text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No metrics recorded</h3>
                            <p className="text-muted-foreground mb-4">Start tracking your vital signs.</p>
                            <Button className="hg-btn-primary gap-2" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Log Metric</Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">History</h2>
                        <div className="grid gap-3">
                            {filtered.map(m => {
                                const meta = getMeta(m.metric_type);
                                const Icon = meta.icon;
                                return (
                                    <Card key={m.id} className="hg-card hover:shadow-md transition-shadow group">
                                        <CardContent className="flex items-center gap-4 py-4">
                                            <div className={`w-10 h-10 ${meta.bg} rounded-xl flex items-center justify-center flex-shrink-0`}><Icon className={`w-5 h-5 ${meta.color}`} /></div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-semibold">{meta.label}</span>
                                                    <span className="text-xl font-bold">{m.value}</span>
                                                    <span className="text-sm text-muted-foreground">{m.unit}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{new Date(m.recorded_at).toLocaleString()} {m.notes && `· ${m.notes}`}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(m.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
