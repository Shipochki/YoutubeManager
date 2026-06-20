import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    async function handleSignOut() {
        await signOut();
        navigate('/sign-in');
    }

    return (
        <div className="app-layout">
            <nav className="nav">
                <span className="nav-brand">YouTube Tracker</span>
                <div className="nav-links">
                    <NavLink to="/" end>Dashboard</NavLink>
                    <NavLink to="/recurring-expenses">Recurring Expenses</NavLink>
                </div>
                <button className="btn btn-ghost" onClick={handleSignOut}>Sign out</button>
            </nav>
            <main className="page">{children}</main>
        </div>
    );
}
