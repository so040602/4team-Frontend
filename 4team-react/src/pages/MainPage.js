import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/MainPage.css';
import axios from 'axios';

const MainPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = (e) => {
       if(e.key === 'Enter' && searchQuery.trim() !== ''){
            navigate(`/searchrecipe?searchQuery=${searchQuery}`);       
       }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // 파일을 선택하여 첫 번째 파일만 가져옵니다.
        if (file){
            setSelectedImage(file);
        }
    }

    const handleImageSearch = () => {
        document.getElementById('file-input').click();
    };

    useEffect(() => {
        if (selectedImage) {
            handleImageSubmit(); // selectedImage가 업데이트되면 자동 실행
        }
    }, [selectedImage]); // selectedImage 값이 변경될 때마다 실행

    const handleImageSubmit = async () => {
        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            console.log(1);
            const response = await axios.post('http://192.168.0.28:5000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data.prediction);

            setSearchQuery(response.data.prediction);
        } catch (error) {
            setError(error);
        }
    }



    return (
        <div className="main-page">
            <div className="main-page-content">
                {/* 헤더 */}
                <header className="header">
                    <div className="header-content">
                        <h1 className="header-title">오늘의 레시피</h1>
                        <div className="search-bar">
                            <span className="search-icon">🔍</span>
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="레시피나 재료를 검색해보세요"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e)=>{handleSearch(e);}}
                            />
                            <div>
                                <button className='search-icon'
                                onClick={handleImageSearch}>🎨</button>
                                <input
                                    type='file'
                                    id='file-input'
                                    accept='image/*'
                                    onChange={handleImageChange}
                                    style={{display:'none'}}
                                >
                                </input>  
                            </div> 
                        </div>
                        <div className="header-actions">
                            <button className="notification-btn">🔔</button>
                            <Link to="/mypage" className="profile-btn">👤</Link>
                        </div>
                    </div>
                </header>

                {/* 상단 네비게이션 */}
                <nav className="top-nav">
                    <div className="nav-content">
                        <Link to="/" className="nav-item active">홈</Link>
                        <Link to="/recipes" className="nav-item">레시피</Link>
                        <Link to="/refriUI" className="nav-item">냉장고 파먹기</Link>
                        <Link to="/reviews" className="nav-item">리뷰</Link>
                        <Link to="/chatbot/Chatbot" className="nav-item">챗봇</Link>
                    </div>
                </nav>

                <main className="main-content">
                    {/* 히어로 섹션 */}
                    <section className="hero-section">
                        <div className="content-container">
                            <div className="banner-slider">
                                <div className="banner-slide">
                                    <div className="banner-content">
                                        <h2>특별한 연말 레시피</h2>
                                        <p>사랑하는 사람들과 함께 나누는 따뜻한 요리</p>
                                        <button className="banner-button">자세히 보기</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 메뉴 아이콘 섹션 */}
                    <section className="menu-icons-section">
                        <div className="content-container">
                            <div className="menu-icons-grid">
                                <Link to="/refriUI" className="menu-icon-item">
                                    <div className="icon-wrapper yellow">
                                        <img src="/icons/fridge.svg" alt="냉장고 파먹기" />
                                    </div>
                                    <span>냉장고 파먹기</span>
                                </Link>
                                <Link to="/MenuList" className="menu-icon-item">
                                    <div className="icon-wrapper pink">
                                        <img src="/icons/heart.svg" alt="오늘 뭐먹지?" />
                                    </div>
                                    <span>오늘 뭐먹지?</span>
                                </Link>
                                <Link to="/recipes/popular" className="menu-icon-item">
                                    <div className="icon-wrapper purple">
                                        <span className="badge">999+</span>
                                        <img src="/icons/star.svg" alt="인기 레시피" />
                                    </div>
                                    <span>인기 레시피</span>
                                </Link>
                                <Link to="/LinkList" className="menu-icon-item">
                                    <div className="icon-wrapper red">
                                        <img src="/icons/book.svg" alt="레시피 북" />
                                    </div>
                                    <span>맛이슈</span>
                                </Link>
                                <Link to="/Searchpage" className="menu-icon-item">
                                    <div className="icon-wrapper green">
                                        <span className="badge sale">SALE</span>
                                        <img src="/icons/sale.svg" alt="할인/특가" />
                                    </div>
                                    <span>식자재</span>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* 추천 레시피 섹션 */}
                    <section className="recipe-section recommended-recipes">
                        <div className="content-container">
                            <h2 className="recipe-section-title">오늘의 추천 레시피</h2>
                            <div className="recipe-grid">
                                {/* 추천 레시피 카드 컴포넌트들이 들어갈 자리 */}
                            </div>
                        </div>
                    </section>

                    {/* 최신 레시피 섹션 */}
                    <section className="recipe-section latest-recipes">
                        <div className="content-container">
                            <h2 className="recipe-section-title">최신 레시피</h2>
                            <div className="recipe-grid">
                                {/* 최신 레시피 카드 컴포넌트들이 들어갈 자리 */}
                            </div>
                        </div>
                    </section>
                </main>

                {/* 플로팅 버튼 */}
                <Link to="/recipe/create" className="floating-button" aria-label="새 레시피 작성">
                    <span className="plus-icon">+</span>
                    <span className="button-tooltip">레시피 작성</span>
                </Link>

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
                        <span>냉장고</span>
                    </Link>
                    <Link to="/reviews" className="nav-item">
                        <div className="nav-icon">⭐</div>
                        <span>리뷰</span>
                    </Link>
                    <Link to="/chatbot/Chatbot" className="nav-item">
                        <div className="nav-icon">💬</div>
                        <span>챗봇</span>
                    </Link>
                </nav>
            </div>
        </div>
    );
};

export default MainPage;
