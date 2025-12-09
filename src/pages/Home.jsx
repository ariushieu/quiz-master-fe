import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="page" style={{ paddingBottom: '80px' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                {/* Hero Section */}
                <div className="hero fade-in" style={{
                    textAlign: 'center',
                    padding: '80px 20px 100px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Background decoration */}
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '800px',
                        height: '800px',
                        background: 'radial-gradient(circle, rgba(66, 153, 225, 0.1) 0%, rgba(255,255,255,0) 70%)',
                        zIndex: -1,
                        pointerEvents: 'none'
                    }}></div>

                    <div className="badge-new" style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        background: 'rgba(66, 153, 225, 0.1)',
                        color: 'var(--primary-color)',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginBottom: '24px'
                    }}>
                        The Smarter Way to Learn
                    </div>

                    <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '24px' }}>
                        Master Anything with <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #4299e1 0%, #667eea 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>QuizMaster</span>
                    </h1>

                    <p className="hero-desc" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 40px', color: 'var(--text-secondary)' }}>
                        Create flashcards, study with spaced repetition, and explore community sets.
                        Unlock your potential with the ultimate learning tool.
                    </p>

                    <div className="hero-actions" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {user ? (
                            <>
                                <Link to="/sets" className="btn btn-primary btn-lg" style={{ minWidth: '160px' }}>
                                    My Study Sets
                                </Link>
                                <Link to="/explore" className="btn btn-secondary btn-lg" style={{
                                    background: 'white',
                                    border: '2px solid var(--border-color)',
                                    minWidth: '160px'
                                }}>
                                    Explore Library
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg" style={{ minWidth: '180px' }}>
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
                <div id="features" className="section fade-in" style={{ animationDelay: '0.2s', marginBottom: '80px' }}>
                    <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Why QuizMaster?</h2>
                    <div className="grid grid-3">
                        <div className="card feature-card" style={{ border: 'none', background: 'var(--bg-card)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', padding: '32px' }}>
                            <div className="feature-icon" style={{ background: '#ebf8ff', color: '#4299e1', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', marginBottom: '16px', fontSize: '1.5rem' }}>📚</div>
                            <h3 className="feature-title" style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Smart Flashcards</h3>
                            <p className="feature-desc" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                Create beautiful flashcards instantly. Flip to learn, swipe to review.
                            </p>
                        </div>

                        <div className="card feature-card" style={{ border: 'none', background: 'var(--bg-card)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', padding: '32px' }}>
                            <div className="feature-icon" style={{ background: '#f0fff4', color: '#48bb78', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', marginBottom: '16px', fontSize: '1.5rem' }}>🧠</div>
                            <h3 className="feature-title" style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Spaced Repetition</h3>
                            <p className="feature-desc" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                Our SM-2 algorithm schedules reviews at the perfect time so you never forget.
                            </p>
                        </div>

                        <div className="card feature-card" style={{ border: 'none', background: 'var(--bg-card)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', padding: '32px' }}>
                            <div className="feature-icon" style={{ background: '#faf5ff', color: '#9f7aea', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', marginBottom: '16px', fontSize: '1.5rem' }}>🌎</div>
                            <h3 className="feature-title" style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Community Library</h3>
                            <p className="feature-desc" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                Explore thousands of public sets shared by the QuizMaster community.
                            </p>
                        </div>
                    </div>
                </div>

                {/* About Section (Restored) */}
                <div id="about" className="section fade-in" style={{ animationDelay: '0.3s', marginBottom: '80px' }}>
                    <div className="card" style={{ padding: '48px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                            <h2 style={{ marginBottom: '24px', fontSize: '2rem' }}>About QuizMaster</h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.8' }}>
                                <strong>QuizMaster</strong> is built with a passion for learning. We believe that masterful learning should be efficient, engaging, and accessible to everyone.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', textAlign: 'left', marginTop: '40px', alignItems: 'start' }}>
                                <div>
                                    <h4 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>Scientific Method</h4>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                        We use the proven <strong>Spaced Repetition (SM-2)</strong> algorithm to optimize your study schedule, ensuring you remember more in less time.
                                    </p>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>Habit Building</h4>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                        Our streak system and leaderboards are designed to keep you motivated. Consistency is the key to mastery.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats / Social Proof */}
                <div style={{
                    padding: '60px',
                    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
                    borderRadius: '24px',
                    color: 'white',
                    textAlign: 'center'
                }} className="fade-in">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Ready to boost your memory?</h2>
                    <p style={{ fontSize: '1.2rem', color: '#a0aec0', marginBottom: '32px' }}>
                        Join thousands of learners mastering new languages and skills every day.
                    </p>
                    <Link to={user ? "/create" : "/register"} className="btn btn-primary btn-lg" style={{
                        background: 'white',
                        color: '#1a202c',
                        border: 'none',
                        fontWeight: 'bold',
                        padding: '16px 48px'
                    }}>
                        {user ? 'Create Your First Set' : 'Join Now - It\'s Free'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
