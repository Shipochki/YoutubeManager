import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function SignUpPage() {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await signUp(email, password);
            setDone(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Sign up failed');
        } finally {
            setLoading(false);
        }
    }

    if (done) {
        return (
            <div className="auth-page">
                <div className="auth-card">
                    <h1>Check your email</h1>
                    <p>We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then <Link to="/sign-in">sign in</Link>.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create account</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </label>
                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={8}
                            autoComplete="new-password"
                        />
                    </label>
                    <label>
                        Confirm password
                        <input
                            type="password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </label>
                    {error && <p className="auth-error" role="alert">{error}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating account…' : 'Create account'}
                    </button>
                </form>
                <p>
                    Already have an account? <Link to="/sign-in">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
