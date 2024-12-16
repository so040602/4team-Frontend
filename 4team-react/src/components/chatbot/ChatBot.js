import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const chatBoxRef = useRef(null);

    useEffect(() => {
        // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // 사용자 메시지 추가
        const userMessage = { type: 'user', content: inputMessage };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: inputMessage })
            });
            const data = await response.text();
            
            // AI 응답 추가
            const aiMessage = { type: 'ai', content: data };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error:', error);
            // 에러 메시지 추가
            const errorMessage = { type: 'error', content: '죄송합니다. 오류가 발생했습니다.' };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    return (
        <div className="chat-container">
            <h1>OpenAPI 챗봇</h1>
            <div className="chat-box" ref={chatBoxRef}>
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.type}`}>
                        <strong>{message.type === 'user' ? '사용자' : 'AI'}:</strong> {message.content}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    className="user-input"
                />
            </form>
        </div>
    );
};

export default ChatBot;
