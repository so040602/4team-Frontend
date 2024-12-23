import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/TopNavigation.css';

const TopNavigation = () => {
    const location = useLocation();
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="top-nav">
                <div className="nav-content">
                <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>홈</Link>
                <Link to="/recipes" className={`nav-item ${isActive('/recipes') ? 'active' : ''}`}>레시피</Link>
                <Link to="/refriUI" className={`nav-item ${isActive('/refriUI') ? 'active' : ''}`}>냉장고 파먹기</Link>
                <Link to="/reviews" className={`nav-item ${isActive('/reviews') ? 'active' : ''}`}>리뷰</Link>
                <Link to="/chatbot/Chatbot" className={`nav-item ${isActive('/chatbot') ? 'active' : ''}`}>챗봇</Link>
                    </div>
                </nav>

    );
};

export default TopNavigation;