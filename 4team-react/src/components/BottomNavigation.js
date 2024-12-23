import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/BottomNavigation.css';

const BottomNavigation = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bottom-nav">
            <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                <div className="nav-icon">🏠</div>
                <span>홈</span>
            </Link>
            <Link to="/recipes" className={`nav-item ${isActive('/recipes') ? 'active' : ''}`}>
                <div className="nav-icon">📖</div>
                <span>레시피</span>
            </Link>
            <Link to="/refriUI" className={`nav-item ${isActive('/refriUI') ? 'active' : ''}`}>
                <div className="nav-icon">🗄️</div>
                <span>냉장고 파먹기</span>
            </Link>
            <Link to="/reviews" className={`nav-item ${isActive('/reviews') ? 'active' : ''}`}>
                <div className="nav-icon">⭐</div>
                <span>리뷰</span>
            </Link>
            <Link to="/chatbot/Chatbot" className={`nav-item ${isActive('/chatbot/Chatbot') ? 'active' : ''}`}>
                <div className="nav-icon">💬</div>
                <span>챗봇</span>
            </Link>
        </nav>
    );
};

export default BottomNavigation;
