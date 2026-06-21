import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Clapperboard, RefreshCw, LogOut, Play } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    async function handleSignOut() {
        await signOut();
        navigate('/sign-in');
    }

    const avatarLetter = user?.email?.[0]?.toUpperCase() ?? '?';

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="sidebar-logo">
                        <Play size={15} fill="white" strokeWidth={0} />
                    </div>
                    <span className="sidebar-name">YT Tracker</span>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/" end className="sidebar-link">
                        <LayoutDashboard size={16} />
                        Dashboard
                    </NavLink>
                    <NavLink to="/projects" className="sidebar-link">
                        <Clapperboard size={16} />
                        Projects
                    </NavLink>
                    <NavLink to="/recurring-expenses" className="sidebar-link">
                        <RefreshCw size={16} />
                        Recurring Expenses
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">{avatarLetter}</div>
                        <span className="sidebar-user-email">{user?.email}</span>
                    </div>
                    <button className="sidebar-signout" onClick={handleSignOut}>
                        <LogOut size={15} />
                        Sign out
                    </button>
                </div>
            </aside>

            <div className="main-content">
                <div className="page">{children}</div>
            </div>
        </div>
    );
}
