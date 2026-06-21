import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { DashboardData } from '../../types';

function fmtMoney(val: number) {
    const abs = Math.abs(val).toFixed(2);
    return val < 0 ? `-$${abs}` : `$${abs}`;
}

function formatDate(iso: string | null | undefined): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function DashboardPage() {
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => api.get<DashboardData>('/api/dashboard'),
    });

    if (isLoading) return <p>Loading…</p>;
    if (!data) return null;

    const profitColor = (val: number) =>
        val > 0 ? 'var(--profit-positive)' : val < 0 ? 'var(--profit-negative)' : 'var(--text-h)';

    return (
        <div>
            <div className="page-header">
                <h1>Dashboard</h1>
                <p className="page-subtitle">Channel overview</p>
            </div>

            {/* Top stats */}
            <div className="metrics-grid" style={{ marginBottom: 32 }}>
                <div className="metric-card">
                    <div className="metric-label">Monthly recurring</div>
                    <div className="metric-value" style={{ color: data.monthlyRecurringTotal > 0 ? 'var(--profit-negative)' : 'var(--text-h)' }}>
                        ${data.monthlyRecurringTotal.toFixed(2)}
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Published this month</div>
                    <div className="metric-value">{data.publishedProjectsThisMonth}</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Total projects</div>
                    <div className="metric-value">{data.totalProjects}</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Total hours</div>
                    <div className="metric-value">{data.totalHours.toFixed(1)} hrs</div>
                </div>
            </div>

            {/* Channel financials */}
            <section className="detail-section" style={{ marginBottom: 32 }}>
                <div className="detail-section-header">
                    <h2>Channel financials (all time)</h2>
                </div>
                <div className="metrics-grid">
                    <div className="metric-card">
                        <div className="metric-label">Total revenue</div>
                        <div className="metric-value" style={{ color: 'var(--profit-positive)' }}>
                            ${data.totalRevenue.toFixed(2)}
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-label">Total expenses</div>
                        <div className="metric-value" style={{ color: data.totalDirectExpenses > 0 ? 'var(--profit-negative)' : 'var(--text-h)' }}>
                            ${data.totalDirectExpenses.toFixed(2)}
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-label">Gross profit</div>
                        <div className="metric-value" style={{ color: profitColor(data.totalGrossProfit) }}>
                            {fmtMoney(data.totalGrossProfit)}
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent published projects */}
            {data.recentProjects.length > 0 && (
                <section className="detail-section">
                    <div className="detail-section-header">
                        <h2>Recently published</h2>
                    </div>
                    <ul className="expense-list">
                        {data.recentProjects.map(p => (
                            <li
                                key={p.id}
                                className="expense-item dashboard-project-row"
                                onClick={() => navigate(`/projects/${p.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="expense-info">
                                    <div className="expense-name">{p.title}</div>
                                    <div className="expense-meta">
                                        <span>{formatDate(p.publishedDate)}</span>
                                        {p.totalHours > 0 && <span>{p.totalHours.toFixed(1)} hrs</span>}
                                    </div>
                                </div>
                                <span
                                    className="expense-amount"
                                    style={{ color: profitColor(p.grossProfit) }}
                                >
                                    {fmtMoney(p.grossProfit)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {data.totalProjects === 0 && (
                <div className="empty-state">
                    <p>No projects yet. Create your first project to start tracking channel economics.</p>
                </div>
            )}
        </div>
    );
}
