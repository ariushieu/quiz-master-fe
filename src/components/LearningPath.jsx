import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { setsAPI, statsAPI } from '../services/api';
import confetti from 'canvas-confetti';

const QUEST_STEPS = [
    {
        id: 'explore',
        title: 'Discover Community',
        description: 'Visit the Explore page to see public sets',
        path: '/explore',
        icon: '🌍'
    },
    {
        id: 'create',
        title: 'First Creation',
        description: 'Create your first Flashcard Set',
        path: '/create',
        icon: '✨'
    },
    {
        id: 'study',
        title: 'Start Learning',
        description: 'Complete a study session',
        path: '/sets', // Generic path, user needs to pick a set
        icon: '📚'
    },
    {
        id: 'quiz',
        title: 'Test Yourself',
        description: 'Take a specific Quiz',
        path: '/sets',
        icon: '🎯'
    }
];

export default function LearningPath() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [progress, setProgress] = useState({
        explore: false,
        create: false,
        study: false,
        quiz: false
    });
    const [loading, setLoading] = useState(true);
    const [showRewardModal, setShowRewardModal] = useState(false);
    const [hasBadge, setHasBadge] = useState(false);

    useEffect(() => {
        checkBadgeAndProgress();
    }, []);

    const checkBadgeAndProgress = async () => {
        setLoading(true);
        try {
            // 1. Check Achievements (Source of Truth for completeness)
            const achievementsData = await statsAPI.getAchievements();
            // Look in 'achievements' array, not specialBadges
            const ownsBadge = achievementsData.achievements.some(a => a.id === 'newcomer' && a.unlocked);
            setHasBadge(ownsBadge);

            if (ownsBadge) {
                // If user has result, clear local storage just in case it wasn't cleared
                clearLocalQuestData();
                setLoading(false);
                return;
            }

            // 2. Hybrid Progress Check: LocalStorage (Fast) OR Backend (Reliable)

            // -- LocalStorage Readings --
            const localExplore = localStorage.getItem('quest_explore') === 'true';
            const localCreate = localStorage.getItem('quest_create') === 'true';
            const localStudy = localStorage.getItem('quest_study') === 'true';
            const localQuiz = localStorage.getItem('quest_quiz') === 'true';

            // -- Backend Readings --
            let backendCreate = false;
            let backendStudy = false;
            let backendQuiz = false;

            try {
                // Parallel fetch for speed
                const [userData, sets] = await Promise.all([
                    statsAPI.getMe(),
                    setsAPI.getAll()
                ]);

                backendCreate = sets && sets.length > 0;
                backendStudy = userData.stats?.totalCardsStudied > 0;
                backendQuiz = userData.stats?.totalQuizzesTaken > 0;
            } catch (e) {
                console.warn("Backend sync failed, relying on local", e);
            }

            // OR Logic
            const finalExplore = localExplore;
            const finalCreate = localCreate || backendCreate;
            const finalStudy = localStudy || backendStudy;
            const finalQuiz = localQuiz || backendQuiz;

            // Sync back to local if backend found it
            if (backendCreate && !localCreate) localStorage.setItem('quest_create', 'true');
            if (backendStudy && !localStudy) localStorage.setItem('quest_study', 'true');
            if (backendQuiz && !localQuiz) localStorage.setItem('quest_quiz', 'true');

            setProgress({
                explore: finalExplore,
                create: finalCreate,
                study: finalStudy,
                quiz: finalQuiz
            });

        } catch (error) {
            console.error("Failed to check quest status", error);
        } finally {
            setLoading(false);
        }
    };

    const clearLocalQuestData = () => {
        localStorage.removeItem('quest_explore');
        localStorage.removeItem('quest_create');
        localStorage.removeItem('quest_study');
        localStorage.removeItem('quest_quiz');
        localStorage.removeItem('quest_completed');
    };

    const completedCount = Object.values(progress).filter(Boolean).length;
    const totalCount = QUEST_STEPS.length;
    const progressPercentage = (completedCount / totalCount) * 100;
    const isComplete = completedCount === totalCount;

    const handleClaimReward = async () => {
        try {
            await statsAPI.claimQuest();

            confetti({
                particleCount: 200,
                spread: 90,
                origin: { y: 0.6 },
                colors: ['#7c3aed', '#f472b6', '#22c55e']
            });

            // Delay modal to show confetti first
            setTimeout(() => {
                setShowRewardModal(true);
            }, 2000);

            setHasBadge(true);
            // Clear local storage immediately after claim
            clearLocalQuestData();
        } catch (error) {
            console.error("Failed to claim badge", error);
            alert("Failed to claim reward. Please try again.");
        }
    };

    if (hasBadge && !showRewardModal) return null;
    if (loading && !hasBadge) return null;

    return (
        <>
            <motion.div
                layout
                className="card mb-3"
                style={{
                    border: '1px solid var(--primary-subtle)',
                    background: 'linear-gradient(to right, var(--bg-elevated), rgba(124, 58, 237, 0.05))',
                    padding: '0',
                    overflow: 'hidden'
                }}
            >
                {/* Header */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        padding: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <div className="flex" style={{ alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            padding: '10px',
                            background: 'var(--primary)',
                            borderRadius: 'var(--radius-md)',
                            color: 'white',
                            fontSize: '1.2rem',
                            boxShadow: 'var(--shadow-glow)'
                        }}>
                            🚀
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Newcomer Quest</h3>
                            <p className="text-secondary" style={{ fontSize: '0.85rem', margin: 0 }}>
                                Complete steps to unlock your first badge!
                            </p>
                        </div>
                    </div>
                    <div className="flex" style={{ alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: 'var(--primary-light)'
                            }}>{completedCount}/{totalCount}</span>
                        </div>
                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            className="text-muted"
                        >
                            ▼
                        </motion.div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar" style={{ borderRadius: 0 }}>
                    <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1 }}
                    />
                </div>

                {/* Content */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ padding: '24px' }}
                        >
                            <div className="grid grid-4" style={{ gap: '16px' }}>
                                {QUEST_STEPS.map((step) => {
                                    const isDone = progress[step.id];
                                    return (
                                        <div
                                            key={step.id}
                                            onClick={() => !isDone && navigate(step.path)}
                                            style={{
                                                background: isDone ? 'rgba(34, 197, 94, 0.1)' : 'var(--bg-surface)',
                                                border: `1px solid ${isDone ? 'var(--success)' : 'var(--border)'}`,
                                                borderRadius: 'var(--radius-md)',
                                                padding: '16px',
                                                cursor: isDone ? 'default' : 'pointer',
                                                transition: 'var(--transition-base)',
                                                position: 'relative',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                height: '100%'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isDone) {
                                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isDone) {
                                                    e.currentTarget.style.borderColor = 'var(--border)';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                <span style={{ fontSize: '1.5rem' }}>{step.icon}</span>
                                                {isDone && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        style={{
                                                            background: 'var(--success)',
                                                            color: 'white',
                                                            padding: '2px',
                                                            borderRadius: '50%',
                                                            width: '20px',
                                                            height: '20px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </motion.div>
                                                )}
                                            </div>
                                            <h4 style={{
                                                fontSize: '1rem',
                                                marginBottom: '4px',
                                                color: isDone ? 'var(--success)' : 'var(--text-primary)'
                                            }}>
                                                {step.title}
                                            </h4>
                                            <p className="text-muted" style={{ fontSize: '0.8rem', flex: 1 }}>
                                                {step.description}
                                            </p>

                                            {!isDone && (
                                                <div style={{
                                                    marginTop: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    color: 'var(--primary-light)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    Go Now &rarr;
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {isComplete && !showRewardModal && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}
                                >
                                    <button
                                        onClick={handleClaimReward}
                                        className="btn btn-primary btn-lg"
                                        style={{
                                            gap: '10px',
                                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                                            border: 'none',
                                            padding: '12px 32px'
                                        }}
                                    >
                                        <span>🏆</span> Claim Your Newcomer Achievement
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Reward Modal */}
            <AnimatePresence>
                {showRewardModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(5px)'
                    }}>
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="card"
                            style={{
                                maxWidth: '400px',
                                textAlign: 'center',
                                border: '1px solid var(--primary)',
                                boxShadow: 'var(--shadow-glow)'
                            }}
                        >
                            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🚀</div>
                            <h2 style={{
                                fontSize: '2rem',
                                background: 'linear-gradient(to right, var(--primary-light), var(--accent))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginBottom: '10px'
                            }}>Achievement Unlocked!</h2>
                            <h3 style={{ color: 'white', marginBottom: '8px' }}>Newcomer</h3>
                            <p className="text-secondary" style={{ marginBottom: '24px' }}>
                                You've mastered the basics of QuizMaster. Keep learning and growing!
                            </p>

                            <button
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%' }}
                                onClick={() => {
                                    setShowRewardModal(false);
                                    setIsOpen(false);
                                }}
                            >
                                Awesome!
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
