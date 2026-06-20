import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { Project, ProjectDetail, ProjectStatus } from '../../types';
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

export default function ProjectsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Project | null>(null);

    const { data: projects = [], isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: () => api.get<Project[]>('/api/projects'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/api/projects/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
    });

    function openCreate() {
        setEditing(null);
        setShowForm(true);
    }

    function openEdit(project: Project, e: React.MouseEvent) {
        e.stopPropagation();
        setEditing(project);
        setShowForm(true);
    }

    function onSaved(project: ProjectDetail) {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        setShowForm(false);
        setEditing(null);
        if (!editing) navigate(`/projects/${project.id}`);
    }

    if (isLoading) return <p>Loading…</p>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Projects</h1>
                    {projects.length > 0 && (
                        <p className="page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
                    )}
                </div>
                <button className="btn btn-primary" onClick={openCreate}>+ New project</button>
            </div>

            {projects.length === 0 ? (
                <div className="empty-state">
                    <p>No projects yet. Create your first video project to start tracking.</p>
                </div>
            ) : (
                <div className="project-grid">
                    {projects.map(project => (
                        <div
                            key={project.id}
                            className="project-card"
                            onClick={() => navigate(`/projects/${project.id}`)}
                        >
                            <div className="project-card-header">
                                <span className={`badge badge-status-${project.status.toLowerCase()}`}>
                                    {STATUS_LABELS[project.status]}
                                </span>
                                {project.shortsCount > 0 && (
                                    <span className="project-shorts-count">
                                        {project.shortsCount} short{project.shortsCount !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                            <h2 className="project-card-title">{project.title}</h2>
                            {project.description && (
                                <p className="project-card-desc">{project.description}</p>
                            )}
                            <div className="project-card-meta">
                                {project.publishedDate ? (
                                    <span>Published {formatDate(project.publishedDate)}</span>
                                ) : project.targetPublishDate ? (
                                    <span>Target: {formatDate(project.targetPublishDate)}</span>
                                ) : (
                                    <span>No target date</span>
                                )}
                            </div>
                            <div className="project-card-actions">
                                <button
                                    className="btn btn-ghost"
                                    onClick={e => openEdit(project, e)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-ghost btn-danger"
                                    onClick={e => {
                                        e.stopPropagation();
                                        deleteMutation.mutate(project.id);
                                    }}
                                    disabled={deleteMutation.isPending}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <ProjectForm
                    project={editing}
                    onClose={() => { setShowForm(false); setEditing(null); }}
                    onSaved={onSaved}
                />
            )}
        </div>
    );
}
