import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type {
    ProjectDetail, ProjectStatus, CreateShortRequest,
    ProjectExpense, CreateProjectExpenseRequest,
    RevenueEntry, CreateRevenueEntryRequest,
    TimeLog, CreateTimeLogRequest,
} from '../../types';
import ProjectForm from './ProjectForm';

const STATUS_LABELS: Record<ProjectStatus, string> = {
    Draft: 'Draft',
    InProgress: 'In Progress',
    Published: 'Published',
    Archived: 'Archived',
};

export default function ProjectDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showEditForm, setShowEditForm] = useState(false);
    const [showShortForm, setShowShortForm] = useState(false);
    const [shortTitle, setShortTitle] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [shortDate, setShortDate] = useState('');

    const { data: project, isLoading } = useQuery({
        queryKey: ['projects', Number(id)],
        queryFn: () => api.get<ProjectDetail>(`/api/projects/${id}`),
        enabled: !!id,
    });

    const addShortMutation = useMutation({
        mutationFn: (body: CreateShortRequest) =>
            api.post(`/api/projects/${id}/shorts`, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', Number(id)] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setShowShortForm(false);
            setShortTitle('');
            setShortUrl('');
            setShortDate('');
        },
    });

    const deleteShortMutation = useMutation({
        mutationFn: (shortId: number) =>
            api.delete(`/api/projects/${id}/shorts/${shortId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', Number(id)] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    function handleAddShort(e: React.FormEvent) {
        e.preventDefault();
        addShortMutation.mutate({
            title: shortTitle,
            youtubeUrl: shortUrl.trim() || null,
            publishedDate: shortDate || null,
        });
    }

    if (isLoading) return <p>Loading…</p>;
    if (!project) return <p>Project not found.</p>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <button className="btn btn-ghost" style={{ marginBottom: 8, paddingLeft: 0 }} onClick={() => navigate('/projects')}>
                        ← Projects
                    </button>
                    <h1 style={{ marginTop: 0 }}>{project.title}</h1>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span className={`badge badge-status-${project.status.toLowerCase()}`}>
                            {STATUS_LABELS[project.status]}
                        </span>
                        {project.targetPublishDate && !project.publishedDate && (
                            <span className="page-subtitle">Target: {formatDate(project.targetPublishDate)}</span>
                        )}
                        {project.publishedDate && (
                            <span className="page-subtitle">Published {formatDate(project.publishedDate)}</span>
                        )}
                    </div>
                </div>
                <button className="btn btn-secondary" onClick={() => setShowEditForm(true)}>Edit project</button>
            </div>

            {project.description && (
                <p style={{ marginBottom: 32, color: 'var(--text)' }}>{project.description}</p>
            )}

            {/* Shorts section */}
            <section className="detail-section">
                <div className="detail-section-header">
                    <h2>Shorts ({project.shorts.length})</h2>
                    <button className="btn btn-secondary" onClick={() => setShowShortForm(v => !v)}>
                        {showShortForm ? 'Cancel' : '+ Add short'}
                    </button>
                </div>

                {showShortForm && (
                    <form className="inline-form" onSubmit={handleAddShort}>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Short title"
                            value={shortTitle}
                            onChange={e => setShortTitle(e.target.value)}
                            required
                            autoFocus
                        />
                        <input
                            className="form-input"
                            type="url"
                            placeholder="YouTube URL (optional)"
                            value={shortUrl}
                            onChange={e => setShortUrl(e.target.value)}
                        />
                        <input
                            className="form-input"
                            type="date"
                            value={shortDate}
                            onChange={e => setShortDate(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary" disabled={addShortMutation.isPending}>
                            {addShortMutation.isPending ? 'Adding…' : 'Add'}
                        </button>
                    </form>
                )}

                {project.shorts.length === 0 && !showShortForm ? (
                    <p className="detail-empty">No shorts linked to this project yet.</p>
                ) : (
                    <ul className="expense-list">
                        {project.shorts.map(s => (
                            <li key={s.id} className="expense-item">
                                <div className="expense-info">
                                    <div className="expense-name">{s.title}</div>
                                    {s.youtubeUrl && (
                                        <div className="expense-meta">
                                            <a href={s.youtubeUrl} target="_blank" rel="noopener noreferrer"
                                               className="expense-category" style={{ textDecoration: 'none' }}>
                                                ↗ YouTube
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <span className="page-subtitle">{formatDate(s.publishedDate)}</span>
                                <div className="expense-actions">
                                    <button
                                        className="btn btn-ghost btn-danger"
                                        onClick={() => deleteShortMutation.mutate(s.id)}
                                        disabled={deleteShortMutation.isPending}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* ── Expenses ── */}
            <ExpensesSection projectId={Number(id)} />

            {/* ── Revenue ── */}
            <RevenueSection projectId={Number(id)} />

            {/* ── Time logs ── */}
            <TimeLogsSection projectId={Number(id)} />

            {showEditForm && (
                <ProjectForm
                    project={project}
                    onClose={() => setShowEditForm(false)}
                    onSaved={() => {
                        queryClient.invalidateQueries({ queryKey: ['projects', Number(id)] });
                        queryClient.invalidateQueries({ queryKey: ['projects'] });
                        setShowEditForm(false);
                    }}
                />
            )}
        </div>
    );
}

// ── Expenses Section ─────────────────────────────────────────────────────────

function ExpensesSection({ projectId }: { projectId: number }) {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');

    const { data: expenses = [] } = useQuery({
        queryKey: ['projects', projectId, 'expenses'],
        queryFn: () => api.get<ProjectExpense[]>(`/api/projects/${projectId}/expenses`),
    });

    const addMutation = useMutation({
        mutationFn: (body: CreateProjectExpenseRequest) =>
            api.post<ProjectExpense>(`/api/projects/${projectId}/expenses`, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'expenses'] });
            setShowForm(false);
            setDesc(''); setAmount(''); setCategory(''); setDate('');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/api/projects/${projectId}/expenses/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'expenses'] }),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        addMutation.mutate({
            description: desc,
            amount: parseFloat(amount),
            category,
            date,
        });
    }

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <section className="detail-section">
            <div className="detail-section-header">
                <h2>Expenses {expenses.length > 0 && <span className="financials-total expense-total">${total.toFixed(2)}</span>}</h2>
                <button className="btn btn-secondary" onClick={() => setShowForm(v => !v)}>
                    {showForm ? 'Cancel' : '+ Add expense'}
                </button>
            </div>

            {showForm && (
                <form className="inline-form" onSubmit={handleSubmit}>
                    <input className="form-input" placeholder="Description" value={desc}
                        onChange={e => setDesc(e.target.value)} required autoFocus />
                    <input className="form-input" type="number" placeholder="Amount" min="0" step="0.01"
                        value={amount} onChange={e => setAmount(e.target.value)} required />
                    <input className="form-input" placeholder="Category" value={category}
                        onChange={e => setCategory(e.target.value)} required />
                    <input className="form-input" type="date" value={date}
                        onChange={e => setDate(e.target.value)} required />
                    <button className="btn btn-primary" type="submit" disabled={addMutation.isPending}>
                        {addMutation.isPending ? 'Adding…' : 'Add'}
                    </button>
                </form>
            )}

            {expenses.length === 0 && !showForm ? (
                <p className="detail-empty">No expenses recorded yet.</p>
            ) : (
                <ul className="expense-list">
                    {expenses.map(e => (
                        <li key={e.id} className="expense-item">
                            <div className="expense-info">
                                <div className="expense-name">{e.description}</div>
                                <div className="expense-meta">
                                    <span className="expense-category">{e.category}</span>
                                    <span>{formatDate(e.date)}</span>
                                </div>
                            </div>
                            <span className="expense-amount">${e.amount.toFixed(2)}</span>
                            <div className="expense-actions">
                                <button className="btn btn-ghost btn-danger"
                                    onClick={() => deleteMutation.mutate(e.id)}
                                    disabled={deleteMutation.isPending}>Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

// ── Revenue Section ──────────────────────────────────────────────────────────

function RevenueSection({ projectId }: { projectId: number }) {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [source, setSource] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');

    const { data: entries = [] } = useQuery({
        queryKey: ['projects', projectId, 'revenue'],
        queryFn: () => api.get<RevenueEntry[]>(`/api/projects/${projectId}/revenue`),
    });

    const addMutation = useMutation({
        mutationFn: (body: CreateRevenueEntryRequest) =>
            api.post<RevenueEntry>(`/api/projects/${projectId}/revenue`, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'revenue'] });
            setShowForm(false);
            setSource(''); setAmount(''); setDate(''); setNotes('');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/api/projects/${projectId}/revenue/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'revenue'] }),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        addMutation.mutate({
            source,
            amount: parseFloat(amount),
            date,
            notes: notes.trim() || null,
        });
    }

    const total = entries.reduce((sum, r) => sum + r.amount, 0);

    return (
        <section className="detail-section">
            <div className="detail-section-header">
                <h2>Revenue {entries.length > 0 && <span className="financials-total revenue-total">${total.toFixed(2)}</span>}</h2>
                <button className="btn btn-secondary" onClick={() => setShowForm(v => !v)}>
                    {showForm ? 'Cancel' : '+ Add revenue'}
                </button>
            </div>

            {showForm && (
                <form className="inline-form" onSubmit={handleSubmit}>
                    <input className="form-input" placeholder="Source (e.g. AdSense, Sponsorship)"
                        value={source} onChange={e => setSource(e.target.value)} required autoFocus />
                    <input className="form-input" type="number" placeholder="Amount" min="0" step="0.01"
                        value={amount} onChange={e => setAmount(e.target.value)} required />
                    <input className="form-input" type="date" value={date}
                        onChange={e => setDate(e.target.value)} required />
                    <input className="form-input" placeholder="Notes (optional)" value={notes}
                        onChange={e => setNotes(e.target.value)} />
                    <button className="btn btn-primary" type="submit" disabled={addMutation.isPending}>
                        {addMutation.isPending ? 'Adding…' : 'Add'}
                    </button>
                </form>
            )}

            {entries.length === 0 && !showForm ? (
                <p className="detail-empty">No revenue recorded yet.</p>
            ) : (
                <ul className="expense-list">
                    {entries.map(r => (
                        <li key={r.id} className="expense-item">
                            <div className="expense-info">
                                <div className="expense-name">{r.source}</div>
                                <div className="expense-meta">
                                    <span>{formatDate(r.date)}</span>
                                    {r.notes && <span>{r.notes}</span>}
                                </div>
                            </div>
                            <span className="expense-amount revenue-amount">${r.amount.toFixed(2)}</span>
                            <div className="expense-actions">
                                <button className="btn btn-ghost btn-danger"
                                    onClick={() => deleteMutation.mutate(r.id)}
                                    disabled={deleteMutation.isPending}>Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

// ── Time Logs Section ────────────────────────────────────────────────────────

function TimeLogsSection({ projectId }: { projectId: number }) {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [category, setCategory] = useState('');
    const [hours, setHours] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');

    const { data: logs = [] } = useQuery({
        queryKey: ['projects', projectId, 'timelogs'],
        queryFn: () => api.get<TimeLog[]>(`/api/projects/${projectId}/timelogs`),
    });

    const addMutation = useMutation({
        mutationFn: (body: CreateTimeLogRequest) =>
            api.post<TimeLog>(`/api/projects/${projectId}/timelogs`, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'timelogs'] });
            setShowForm(false);
            setCategory(''); setHours(''); setDate(''); setNotes('');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/api/projects/${projectId}/timelogs/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'timelogs'] }),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        addMutation.mutate({
            category,
            hours: parseFloat(hours),
            date,
            notes: notes.trim() || null,
        });
    }

    const totalHours = logs.reduce((sum, t) => sum + t.hours, 0);

    return (
        <section className="detail-section">
            <div className="detail-section-header">
                <h2>Time logs {logs.length > 0 && <span className="financials-total">{totalHours.toFixed(1)} hrs</span>}</h2>
                <button className="btn btn-secondary" onClick={() => setShowForm(v => !v)}>
                    {showForm ? 'Cancel' : '+ Add time log'}
                </button>
            </div>

            {showForm && (
                <form className="inline-form" onSubmit={handleSubmit}>
                    <input className="form-input" placeholder="Category (e.g. Filming, Editing)"
                        value={category} onChange={e => setCategory(e.target.value)} required autoFocus />
                    <input className="form-input" type="number" placeholder="Hours" min="0.1" step="0.1"
                        value={hours} onChange={e => setHours(e.target.value)} required />
                    <input className="form-input" type="date" value={date}
                        onChange={e => setDate(e.target.value)} required />
                    <input className="form-input" placeholder="Notes (optional)" value={notes}
                        onChange={e => setNotes(e.target.value)} />
                    <button className="btn btn-primary" type="submit" disabled={addMutation.isPending}>
                        {addMutation.isPending ? 'Adding…' : 'Add'}
                    </button>
                </form>
            )}

            {logs.length === 0 && !showForm ? (
                <p className="detail-empty">No time logged yet.</p>
            ) : (
                <ul className="expense-list">
                    {logs.map(t => (
                        <li key={t.id} className="expense-item">
                            <div className="expense-info">
                                <div className="expense-name">{t.category}</div>
                                <div className="expense-meta">
                                    <span>{formatDate(t.date)}</span>
                                    {t.notes && <span>{t.notes}</span>}
                                </div>
                            </div>
                            <span className="expense-amount">{t.hours.toFixed(1)} hrs</span>
                            <div className="expense-actions">
                                <button className="btn btn-ghost btn-danger"
                                    onClick={() => deleteMutation.mutate(t.id)}
                                    disabled={deleteMutation.isPending}>Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

function formatDate(iso: string | null | undefined): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
