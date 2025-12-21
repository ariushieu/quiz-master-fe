import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="page" style={{ paddingBottom: '80px', overflowX: 'hidden' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>
                {/* Hero Section */}
                <div className="hero fade-in" style={{
                    textAlign: 'center',
                    padding: '80px 24px 100px',
                    position: 'relative',
                }}>
                    {/* Background decoration */}
                    <div style={{
                        position: 'absolute',
                        top: '-20%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100%',
                        maxWidth: '800px',
                        height: '800px',
                        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(15, 15, 20, 0) 70%)',
                        zIndex: -1,
                        pointerEvents: 'none',
                        filter: 'blur(40px)'
                    }}></div>

                    <div className="badge-new" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '8px 20px',
                        background: 'rgba(124, 58, 237, 0.1)',
                        border: '1px solid rgba(124, 58, 237, 0.2)',
                        color: '#a78bfa',
                        borderRadius: '30px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        marginBottom: '32px',
                        letterSpacing: '0.5px'
                    }}>
                        ✨ The Smarter Way to Learn
                    </div>

                    <h1 className="hero-title" style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        marginBottom: '24px',
                        lineHeight: '1.1',
                        fontWeight: '800'
                    }}>
                        Master Anything with <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 2em rgba(167, 139, 250, 0.3))'
                        }}>QuizMaster</span>
                    </h1>

                    <p className="hero-desc" style={{
                        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                        maxWidth: '650px',
                        margin: '0 auto 48px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6'
                    }}>
                        Create flashcards, study with spaced repetition, and explore community sets.
                        Unlock your potential with the ultimate learning tool that adapts to you.
                    </p>

                    <div className="hero-actions" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {user ? (
                            <>
                                <Link to="/sets" className="btn btn-primary btn-lg" style={{
                                    minWidth: '180px',
                                    padding: '16px 32px',
                                    fontSize: '1.1rem',
                                    boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)'
                                }}>
                                    My Study Sets
                                </Link>
                                <Link to="/explore" className="btn btn-secondary btn-lg" style={{
                                    border: '1px solid var(--border)',
                                    minWidth: '180px',
                                    padding: '16px 32px',
                                    fontSize: '1.1rem',
                                    background: 'var(--bg-elevated)'
                                }}>
                                    Explore Library
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg" style={{
                                    minWidth: '200px',
                                    padding: '16px 32px',
                                    fontSize: '1.1rem',
                                    boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)'
                                }}>
                                    Get Started Free
                                </Link>
                                <Link to="/explore" className="btn btn-secondary btn-lg" style={{
                                    border: '1px solid var(--border)',
                                    padding: '16px 32px',
                                    fontSize: '1.1rem',
                                    background: 'var(--bg-elevated)'
                                }}>
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
                        <div className="card feature-card" style={{
                            border: '1px solid var(--border)',
                            background: 'var(--bg-elevated)',
                            padding: '32px',
                            transition: 'transform 0.2s',
                            height: '100%'
                        }}>
                            <div className="feature-icon" style={{
                                background: 'rgba(66, 153, 225, 0.1)',
                                color: '#63b3ed',
                                width: '56px', height: '56px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '16px', marginBottom: '24px', fontSize: '1.75rem'
                            }}>📚</div>
                            <h3 className="feature-title" style={{ marginBottom: '12px', fontSize: '1.4rem', fontWeight: 'bold' }}>Smart Flashcards</h3>
                            <p className="feature-desc" style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>
                                Create beautiful flashcards instantly. Flip to learn, swipe to review. Optimized for memory retention.
                            </p>
                        </div>

                        <div className="card feature-card" style={{
                            border: '1px solid var(--border)',
                            background: 'var(--bg-elevated)',
                            padding: '32px',
                            transition: 'transform 0.2s',
                            height: '100%'
                        }}>
                            <div className="feature-icon" style={{
                                background: 'rgba(72, 187, 120, 0.1)',
                                color: '#68d391',
                                width: '56px', height: '56px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '16px', marginBottom: '24px', fontSize: '1.75rem'
                            }}>🧠</div>
                            <h3 className="feature-title" style={{ marginBottom: '12px', fontSize: '1.4rem', fontWeight: 'bold' }}>Spaced Repetition</h3>
                            <p className="feature-desc" style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>
                                Our SM-2 algorithm ensures you review material at the perfect moment—just before you're about to forget it.
                            </p>
                        </div>

                        <div className="card feature-card" style={{
                            border: '1px solid var(--border)',
                            background: 'var(--bg-elevated)',
                            padding: '32px',
                            transition: 'transform 0.2s',
                            height: '100%'
                        }}>
                            <div className="feature-icon" style={{
                                background: 'rgba(159, 122, 234, 0.1)',
                                color: '#b794f4',
                                width: '56px', height: '56px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '16px', marginBottom: '24px', fontSize: '1.75rem'
                            }}>🌎</div>
                            <h3 className="feature-title" style={{ marginBottom: '12px', fontSize: '1.4rem', fontWeight: 'bold' }}>Community Library</h3>
                            <p className="feature-desc" style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>
                                Explore thousands of high-quality public sets shared by the QuizMaster community.
                            </p>
                        </div>
                    </div>
                </div>

                {/* About Section - Responsive via grid class */}
                <div id="about" className="section fade-in" style={{ animationDelay: '0.3s', marginBottom: '100px' }}>
                    <div className="card" style={{ padding: '48px 32px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                        {/* Decorative glow */}
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }}></div>

                        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <h2 style={{ marginBottom: '16px', fontSize: '2.2rem', fontWeight: 'bold' }}>About QuizMaster</h2>
                                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto' }}>
                                    <strong>QuizMaster</strong> is built with a passion for efficient learning. We combine cognitive science with modern design to make studying engaging and effective.
                                </p>
                            </div>

                            {/* Uses responsive grid class instead of inline grid */}
                            <div className="grid grid-2" style={{ gap: '40px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px' }}>
                                    <h4 style={{ marginBottom: '12px', fontSize: '1.4rem', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>🔬</span> Scientific Method
                                    </h4>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                        We use the proven <strong>Spaced Repetition (SM-2)</strong> algorithm to optimize your study schedule. No more cramming—just consistent, long-term retention.
                                    </p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px' }}>
                                    <h4 style={{ marginBottom: '12px', fontSize: '1.4rem', color: '#f472b6', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                <div style={{
                    padding: '80px 24px',
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(15, 15, 20, 0.9) 100%)',
                    borderRadius: '32px',
                    textAlign: 'center',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)'
                }} className="fade-in">
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '24px', fontWeight: '800' }}>Ready to boost your memory?</h2>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                            Join thousands of learners mastering new languages, subjects, and skills every day.
                        </p>
                        <Link to={user ? "/create" : "/register"} className="btn btn-primary btn-lg" style={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            padding: '18px 48px',
                            borderRadius: '50px',
                            boxShadow: '0 0 30px rgba(124, 58, 237, 0.5)'
                        }}>
                            {user ? 'Create Your First Set' : 'Join Now - It\'s Free'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
