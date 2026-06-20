import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { session, loading } = useAuth();

    if (loading) return null;
    if (!session) return <Navigate to="/sign-in" replace />;

    return <>{children}</>;
}
