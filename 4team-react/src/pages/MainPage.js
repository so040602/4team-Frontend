import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainPage.css';

const MainPage = () => {
    return (
        <div>
            {/* 헤더 */}
            <header className="header">
                <h1 className="header-title">오늘의 레시피</h1>
                <nav className="desktop-nav">
                    <Link to="/" className="desktop-nav-item active">홈</Link>
                    <Link to="/recipes" className="desktop-nav-item">레시피</Link>
                    <Link to="/refrigerator" className="desktop-nav-item">냉장고 파먹기</Link>
                    <Link to="/reviews" className="desktop-nav-item">리뷰</Link>
                    <Link to="/chatbot" className="desktop-nav-item">챗봇</Link>
                </nav>
                <div className="header-profile">👤</div>
            </header>

            <div className="container">
                {/* 검색바 */}
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input type="text" className="search-input" placeholder="레시피나 재료를 검색해보세요" />
                </div>

                {/* 카테고리 */}
                <div className="category-scroll">
                    <button className="category-item active">전체</button>
                    <button className="category-item">한식</button>
                    <button className="category-item">양식</button>
                    <button className="category-item">중식</button>
                    <button className="category-item">일식</button>
                    <button className="category-item">디저트</button>
                </div>

                {/* 추천 레시피 */}
                <h2 className="section-title">오늘의 추천 레시피</h2>
                <div className="featured-scroll">
                    {/* 추천 레시피 카드는 API 데이터로 구현 예정 */}
                </div>

                {/* 최신 레시피 */}
                <h2 className="section-title">최신 레시피</h2>
                <div className="recipe-grid">
                    {/* 최신 레시피 카드는 API 데이터로 구현 예정 */}
                </div>
            </div>

            {/* 플로팅 버튼 */}
            <Link to="/recipe/create" className="floating-button">+</Link>

            {/* 모바일 하단 네비게이션 */}
            <nav className="bottom-nav">
                <Link to="/" className="nav-item active">
                    <div className="nav-icon">🏠</div>
                    <span>홈</span>
                </Link>
                <Link to="/recipes" className="nav-item">
                    <div className="nav-icon">📖</div>
                    <span>레시피</span>
                </Link>
                <Link to="/refrigerator" className="nav-item">
                    <div className="nav-icon">🗄️</div>
                    <span>냉장고 파먹기</span>
                </Link>
                <Link to="/reviews" className="nav-item">
                    <div className="nav-icon">⭐</div>
                    <span>리뷰</span>
                </Link>
                <Link to="/chatbot" className="nav-item">
                    <div className="nav-icon">💬</div>
                    <span>챗봇</span>
                </Link>
            </nav>
        </div>
    );
};

export default MainPage;
