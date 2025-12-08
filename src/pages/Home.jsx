import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="page">
            <div className="container">
                {/* Hero Section */}
                <div className="hero">
                    <h1 className="hero-title">
                        Master Anything with <span>QuizMaster</span>
                    </h1>

                    <p className="hero-desc">
                        Create flashcards, study with spaced repetition, and test your knowledge.
                        The smarter way to learn and remember anything.
                    </p>

                    <div className="hero-actions">
                        {user ? (
                            <>
                                <Link to="/sets" className="btn btn-primary btn-lg">
                                    My Study Sets
                                </Link>
                                <Link to="/create" className="btn btn-secondary btn-lg">
                                    Create New Set
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Get Started Free
                                </Link>
                                <Link to="/login" className="btn btn-secondary btn-lg">
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="section" style={{ marginTop: '60px' }}>
                    <h2 className="section-title">✨ Features</h2>
                    <div className="grid grid-3">
                        <div className="feature-card">
                            <div className="feature-icon">📚</div>
                            <h3 className="feature-title">Flashcards</h3>
                            <p className="feature-desc">
                                Create beautiful flashcards with terms and definitions. Flip to reveal answers.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🔄</div>
                            <h3 className="feature-title">Spaced Repetition</h3>
                            <p className="feature-desc">
                                SM-2 algorithm schedules reviews at optimal intervals for maximum retention.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">✅</div>
                            <h3 className="feature-title">Quiz Mode</h3>
                            <p className="feature-desc">
                                Test yourself with multiple choice quizzes to reinforce learning.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🔥</div>
                            <h3 className="feature-title">Streak Tracking</h3>
                            <p className="feature-desc">
                                Build daily study habits with streak counting. Study 10 cards/day to keep streaks!
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🏆</div>
                            <h3 className="feature-title">Leaderboard</h3>
                            <p className="feature-desc">
                                Compete with others and climb the leaderboard by maintaining study streaks.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🔊</div>
                            <h3 className="feature-title">Text-to-Speech</h3>
                            <p className="feature-desc">
                                Listen to pronunciations with built-in TTS supporting multiple languages.
                            </p>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div id="about" className="section" style={{ marginTop: '60px', marginBottom: '60px' }}>
                    <h2 className="section-title">📖 About</h2>
                    <div className="about-content">
                        <p>
                            <strong>QuizMaster</strong> là ứng dụng học flashcard được xây dựng với tình yêu dành cho việc học tập.
                            Chúng tôi tin rằng học tập có thể vừa hiệu quả vừa thú vị!
                        </p>
                        <p>
                            Sử dụng thuật toán <strong>Spaced Repetition (SM-2)</strong> - phương pháp khoa học giúp bạn nhớ lâu hơn
                            với ít thời gian ôn tập hơn. Mỗi card được lên lịch review dựa trên mức độ bạn nhớ nó.
                        </p>
                        <p>
                            Xây dựng thói quen học tập với hệ thống <strong>Streak</strong> - chỉ cần học 10 cards mỗi ngày để duy trì chuỗi ngày học!
                            Theo dõi tiến độ, đạt achievements, và so sánh với bạn bè trên bảng xếp hạng.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
