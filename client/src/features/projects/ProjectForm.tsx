import { useState } from 'react';
import { api } from '../../lib/api';
import type {
    Project,
    ProjectDetail,
    CreateProjectRequest,
    UpdateProjectRequest,
    ProjectStatus,
} from '../../types';

interface Props {
    project: Project | ProjectDetail | null;
    onClose: () => void;
    onSaved: (project: ProjectDetail) => void;
}

const STATUSES: { value: ProjectStatus; label: string }[] = [
    { value: 'Draft', label: 'Draft' },
    { value: 'InProgress', label: 'In Progress' },
    { value: 'Published', label: 'Published' },
    { value: 'Archived', label: 'Archived' },
];

function toInputDate(iso: string | null | undefined): string {
    if (!iso) return '';
    return iso.split('T')[0];
}

export default function ProjectForm({ project, onClose, onSaved }: Props) {
    const [title, setTitle] = useState(project?.title ?? '');
    const [description, setDescription] = useState(project?.description ?? '');
    const [status, setStatus] = useState<ProjectStatus>(project?.status ?? 'Draft');
    const [targetDate, setTargetDate] = useState(toInputDate(project?.targetPublishDate));
    const [publishedDate, setPublishedDate] = useState(toInputDate(project?.publishedDate));
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const isEdit = project !== null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSaving(true);
        try {
            let result: ProjectDetail;
            if (isEdit) {
                const body: UpdateProjectRequest = {
                    title,
                    description: description.trim() || null,
                    status,
                    targetPublishDate: targetDate || null,
                    publishedDate: publishedDate || null,
                };
                result = await api.put<ProjectDetail>(`/api/projects/${project.id}`, body);
            } else {
                const body: CreateProjectRequest = {
                    title,
                    description: description.trim() || null,
                    status,
                    targetPublishDate: targetDate || null,
                };
                result = await api.post<ProjectDetail>('/api/projects', body);
            }
            onSaved(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h2>{isEdit ? 'Edit project' : 'New project'}</h2>
                <form onSubmit={handleSubmit}>
                    <label className="form-label">
                        Title
                        <input
                            className="form-input"
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            placeholder="e.g. How I Built a YouTube Tracker"
                            autoFocus
                        />
                    </label>
                    <label className="form-label">
                        Status
                        <select
                            className="form-input"
                            value={status}
                            onChange={e => setStatus(e.target.value as ProjectStatus)}
                        >
                            {STATUSES.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </label>
                    <label className="form-label">
                        Target publish date
                        <input
                            className="form-input"
                            type="date"
                            value={targetDate}
                            onChange={e => setTargetDate(e.target.value)}
                        />
                    </label>
                    {(isEdit || status === 'Published') && (
                        <label className="form-label">
                            Published date
                            <input
                                className="form-input"
                                type="date"
                                value={publishedDate}
                                onChange={e => setPublishedDate(e.target.value)}
                            />
                        </label>
                    )}
                    <label className="form-label">
                        Description (optional)
                        <textarea
                            className="form-input"
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="What is this video about?"
                            style={{ resize: 'vertical' }}
                        />
                    </label>
                    {error && <p className="auth-error" role="alert">{error}</p>}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
