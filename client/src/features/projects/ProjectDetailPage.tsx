import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { ProjectDetail, ProjectStatus, CreateShortRequest } from '../../types';
import ProjectForm from './ProjectForm';

const STATUS_LABELS: Record<ProjectStatus, string> = {
    Draft: 'Draft',
    InProgress: 'In Progress',
    Published: 'Published',
    Archived: 'Archived',
};

function formatDate(iso: string | null | undefined): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

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

            {/* Placeholder sections for Phase 5 */}
            <section className="detail-section">
                <div className="detail-section-header">
                    <h2>Expenses</h2>
                </div>
                <p className="detail-empty">Coming in Phase 5.</p>
            </section>

            <section className="detail-section">
                <div className="detail-section-header">
                    <h2>Revenue</h2>
                </div>
                <p className="detail-empty">Coming in Phase 5.</p>
            </section>

            <section className="detail-section">
                <div className="detail-section-header">
                    <h2>Time logs</h2>
                </div>
                <p className="detail-empty">Coming in Phase 5.</p>
            </section>

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
