import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { aiAPI } from '../services/ai';

export default function AIChat({ term, definition, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Auto-ask initial question when opened
        askAI(`Explain this flashcard:\nTerm: "${term}"\nDefinition: "${definition}"\n\nProvide explanation, examples, and memory tips.`);
    }, [term, definition]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const askAI = async (question) => {
        if (loading) return;

        setMessages(prev => [...prev, { role: 'user', content: question }]);
        setLoading(true);

        try {
            const response = await aiAPI.chat(term, definition, question, messages);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `❌ Lỗi: ${error.message}`
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const question = input.trim();
        setInput('');
        askAI(question);
    };

    const quickQuestions = [
        'Cho thêm ví dụ',
        'Giải thích đơn giản hơn',
        'Từ đồng nghĩa?',
        'Từ trái nghĩa?'
    ];

    return (
        <div className="ai-chat-overlay" onClick={onClose}>
            <div className="ai-chat-container" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="ai-chat-header">
                    <div className="ai-chat-title">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                        AI Assistant
                    </div>
                    <button className="ai-chat-close" onClick={onClose}>×</button>
                </div>

                {/* Card Info */}
                <div className="ai-chat-card-info">
                    <span className="ai-chat-term">{term}</span>
                    <span className="ai-chat-sep">→</span>
                    <span className="ai-chat-def">{definition}</span>
                </div>

                {/* Messages */}
                <div className="ai-chat-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`ai-chat-msg ${msg.role}`}>
                            {msg.role === 'assistant' ? (
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            ) : (
                                <p>{msg.content}</p>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="ai-chat-msg assistant">
                            <div className="ai-typing">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                {messages.length > 0 && !loading && (
                    <div className="ai-quick-questions">
                        {quickQuestions.map((q, i) => (
                            <button key={i} onClick={() => askAI(q)} className="ai-quick-btn">
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <form className="ai-chat-input-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Hỏi thêm về từ này..."
                        className="ai-chat-input"
                        disabled={loading}
                    />
                    <button type="submit" className="ai-chat-send" disabled={loading || !input.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
