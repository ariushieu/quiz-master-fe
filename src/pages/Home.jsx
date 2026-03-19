import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '1100px' }}>
                {/* Hero Section */}
                <div className="hero fade-in" style={{ padding: '80px 24px 100px' }}>

                    <div className="badge-new" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '8px 20px',
                        background: 'var(--color-primary-light)',
                        border: '1px solid var(--color-primary-hover)',
                        color: 'var(--color-primary)',
                        borderRadius: '30px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        marginBottom: '32px',
                        letterSpacing: '0.5px'
                    }}>
                        ✨ The Smarter Way to Learn
                    </div>

                    <h1 className="hero-title" style={{ marginBottom: '24px' }}>
                        Master Anything with <br />
                        <span>QuizMaster</span>
                    </h1>

                    <p className="hero-desc" style={{ maxWidth: '650px', margin: '0 auto 48px' }}>
                        Create flashcards, study with spaced repetition, and explore community sets.
                        Unlock your potential with the ultimate learning tool that adapts to you.
                    </p>

                    <div className="hero-actions">
                        {user ? (
                            <>
                                <Link to="/sets" className="btn btn-primary btn-lg" style={{ minWidth: '180px' }}>
                                    My Study Sets
                                </Link>
                                <Link to="/explore" className="btn btn-secondary btn-lg" style={{ minWidth: '180px' }}>
                                    Explore Library
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg" style={{ minWidth: '200px' }}>
                                    Get Started Free
                                </Link>
                                <Link to="/explore" className="btn btn-secondary btn-lg">
                                    Browse Library
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="section fade-in" style={{ animationDelay: '0.2s', marginBottom: '100px' }}>
                    <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '50px', fontSize: '2rem', fontWeight: '700' }}>Why QuizMaster?</h2>

                    <div className="grid grid-3">
                        <div className="card feature-card">
                            <div className="feature-icon" style={{ width: '56px', height: '56px', fontSize: '1.75rem', marginBottom: '24px' }}>
                                📚
                            </div>
                            <h3 className="feature-title" style={{ marginBottom: '12px', fontSize: '1.4rem' }}>Smart Flashcards</h3>
                            <p className="feature-desc">
                                Create beautiful flashcards instantly. Flip to learn, swipe to review. Optimized for memory retention.
                            </p>
                        </div>

                        <div className="card feature-card">
                            <div className="feature-icon" style={{ width: '56px', height: '56px', fontSize: '1.75rem', marginBottom: '24px' }}>
                                🧠
                            </div>
                            <h3 className="feature-title" style={{ marginBottom: '12px', fontSize: '1.4rem' }}>Spaced Repetition</h3>
                            <p className="feature-desc">
                                Our SM-2 algorithm ensures you review material at the perfect moment—just before you're about to forget it.
                            </p>
                        </div>

                        <div className="card feature-card">
                            <div className="feature-icon" style={{ width: '56px', height: '56px', fontSize: '1.75rem', marginBottom: '24px' }}>
                                🌎
                            </div>
                            <h3 className="feature-title" style={{ marginBottom: '12px', fontSize: '1.4rem' }}>Community Library</h3>
                            <p className="feature-desc">
                                Explore thousands of high-quality public sets shared by the QuizMaster community.
                            </p>
                        </div>
                    </div>
                </div>

                {/* About Section - Responsive via grid class */}
                <div id="about" className="section fade-in" style={{ animationDelay: '0.3s', marginBottom: '100px' }}>
                    <div className="card" style={{ padding: '48px 32px', border: '1px solid var(--border)' }}>

                        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <h2 style={{ marginBottom: '16px', fontSize: '2.2rem', fontWeight: 'bold' }}>About QuizMaster</h2>
                                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto' }}>
                                    <strong>QuizMaster</strong> is built with a passion for efficient learning. We combine cognitive science with modern design to make studying engaging and effective.
                                </p>
                            </div>

                            {/* Uses responsive grid class instead of inline grid */}
                            <div className="grid grid-2" style={{ gap: '40px' }}>
                                <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--color-surface)' }}>
                                    <h4 style={{ marginBottom: '12px', fontSize: '1.4rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>🔬</span> Scientific Method
                                    </h4>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                        We use the proven <strong>Spaced Repetition (SM-2)</strong> algorithm to optimize your study schedule. No more cramming—just consistent, long-term retention.
                                    </p>
                                </div>
                                <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--color-surface)' }}>
                                    <h4 style={{ marginBottom: '12px', fontSize: '1.4rem', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>🔥</span> Habit Building
                                    </h4>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                        Our streak system, badges, and leaderboards are designed to keep you motivated. Consistency is the key to mastery, and we make it fun.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div
                    style={{
                        padding: '80px 24px',
                        background: 'var(--color-surface)',
                        borderRadius: 'var(--card-radius)',
                        textAlign: 'center',
                        border: '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-card)',
                    }}
                    className="fade-in"
                >
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '24px', fontWeight: '800' }}>Ready to boost your memory?</h2>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                            Join thousands of learners mastering new languages, subjects, and skills every day.
                        </p>
                        <Link to={user ? "/create" : "/register"} className="btn btn-primary btn-lg" style={{ borderRadius: '999px' }}>
                            {user ? 'Create Your First Set' : 'Join Now - It\'s Free'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
