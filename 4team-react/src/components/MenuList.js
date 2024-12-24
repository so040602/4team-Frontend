import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';

const FilterCard = styled.div.attrs(props => ({
    className: props.className,
    onClick: props.onClick
}))`
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 15px;
    padding: 20px;
    text-align: center;
    background-color: ${props => props.$active ? '#ff6b6b' : '#fff'};
    color: ${props => props.$active ? '#fff' : '#333'};
    border: 1px solid ${props => props.$active ? '#ff6b6b' : '#eee'};
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .period {
        font-size: 14px;
        margin-top: 8px;
        color: ${props => props.$active ? '#fff' : '#666'};
    }

    .icon {
        font-size: 24px;
        margin-bottom: 12px;
        color: ${props => props.$active ? '#fff' : '#ff6b6b'};
    }

    h5 {
        color: ${props => props.$active ? '#fff' : '#333'};
        font-weight: 600;
        margin: 0;
    }
`;

const MenuCard = styled.div`
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 15px;
    overflow: hidden;
    border: 1px solid #eee;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .card-header {
        height: 200px;
        overflow: hidden;
        padding: 0;
        background: none;
        border: none;
        position: relative;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        &:hover img {
            transform: scale(1.05);
        }
    }

    .card-body {
        padding: 1.25rem;
        background: #fff;

        .card-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 0.5rem;
        }

        .card-text {
            color: #666;
            font-size: 0.9rem;
            line-height: 1.5;
        }
    }
`;

const PageTitle = styled.h1`
    font-size: 2.2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
    position: relative;
    
    &:after {
        content: '';
        display: block;
        width: 60px;
        height: 3px;
        background-color: #ff6b6b;
        margin: 15px auto 0;
    }
`;

const SectionTitle = styled.h4`
    font-size: 1.5rem;
    font-weight: 600;
    color: #444;
    text-align: center;
    margin-bottom: 1.5rem;
    position: relative;
    
    &:after {
        content: '';
        display: block;
        width: 40px;
        height: 2px;
        background-color: #ff6b6b;
        margin: 10px auto 0;
    }
`;

const seasonConfig = {
    '봄': { 
        period: '3월 - 5월',
        icon: '🌸'
    },
    '여름': { 
        period: '6월 - 8월',
        icon: '☀️'
    },
    '가을': { 
        period: '9월 - 11월',
        icon: '🍁'
    },
    '겨울': { 
        period: '12월 - 2월',
        icon: '❄️'
    }
};

const mealTimeConfig = {
    '아침': { 
        period: '아침 식사',
        icon: '🌅'
    },
    '점심': { 
        period: '점심 식사',
        icon: '☀️'
    },
    '저녁': { 
        period: '저녁 식사',
        icon: '🌙'
    },
    '랜덤': { 
        period: '랜덤 추천',
        icon: '🎲'
    }
};

const MenuList = () => {
    const [menus, setMenus] = useState([]);
    const [activeFilters, setActiveFilters] = useState({
        mealTime: null,
        season: null
    });
    const [error, setError] = useState(null);
    const [isDesktop, setIsDesktop] = useState(window.matchMedia("(min-width: 769px)").matches);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 769px)");
        const handler = (e) => setIsDesktop(e.matches);
        mediaQuery.addListener(handler);
        return () => mediaQuery.removeListener(handler);
    }, []);

    const fetchMenus = async (type, value) => {
        try {
            setError(null);
            let mappedValue = value;
            let endpoint = type === 'mealTime' ? 'mealTime' : 'season';
            
            if (type === 'mealTime') {
                mappedValue = value;
            } else if (type === 'season') {
                mappedValue = value;
            }

            const url = `http://localhost:8989/menus/${endpoint}/${encodeURIComponent(mappedValue)}`;
            console.log('Fetching from URL:', url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data);
            setMenus(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error('Error fetching menus:', error);
            setError(`메뉴를 불러오는 중 오류가 발생했습니다: ${error.message}`);
            setMenus([]);
        }
    };

    const fetchRandomMenus = async () => {
        try {
            setError(null);
            const response = await fetch('http://localhost:8989/menus/random');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received random menus:', data);
            setMenus(Array.isArray(data) ? data : []);
            
            setActiveFilters({
                mealTime: '랜덤',
                season: null
            });
        } catch (error) {
            console.error('Error fetching random menus:', error);
            setError(`랜덤 메뉴를 불러오는 중 오류가 발생했습니다: ${error.message}`);
            setMenus([]);
        }
    };

    useEffect(() => {
        fetchRandomMenus();
    }, []);

    const handleFilterClick = (type, value) => {
        if (value === '랜덤') {
            fetchRandomMenus();
            return;
        }

        console.log(`Filtering by ${type}:`, value);
        setActiveFilters(prev => ({
            ...prev,
            [type]: prev[type] === value ? null : value
        }));
        fetchMenus(type, value);
    };

    return (
        <div style={{ margin: isDesktop ? '180px auto': '100px auto'}} className="container py-5">
            
            <div className="row mb-4">
                {/* 계절 필터 */}
                <div className="col-12 mb-4">
                    <SectionTitle>계절별 추천메뉴</SectionTitle>
                    <div className="row">
                        {Object.entries(seasonConfig).map(([season, config]) => (
                            <div key={season} className="col-md-3 col-6 mb-3">
                                <FilterCard
                                    onClick={() => handleFilterClick('season', season)}
                                    $active={activeFilters.season === season}
                                >
                                    <div className="icon">{config.icon}</div>
                                    <h5 className="mb-2">{season}</h5>
                                    <div className="period">{config.period}</div>
                                </FilterCard>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 식사 시간대 필터 */}
                <div className="col-12 mb-4">
                    <SectionTitle>식사 시간대</SectionTitle>
                    <div className="row">
                        {Object.entries(mealTimeConfig).map(([time, config]) => (
                            <div key={time} className="col-md-3 col-6 mb-3">
                                <FilterCard
                                    onClick={() => handleFilterClick('mealTime', time)}
                                    $active={activeFilters.mealTime === time}
                                >
                                    <div className="icon">{config.icon}</div>
                                    <h5 className="mb-2">{time}</h5>
                                    <div className="period">{config.period}</div>
                                </FilterCard>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 메뉴 카드 목록 */}
                <div className="col-12">
                    {error && (
                        <div className="alert alert-danger text-center mb-4">
                            {error}
                        </div>
                    )}
                    <div className="row g-4">
                        {menus.map((menu, index) => (
                            <div key={menu.menuIdx || index} className="col-md-4 mb-4">
                                <MenuCard className="card h-100">
                                    <div className="card-header">
                                    <img 
                                        src={`http://localhost:8989/images/${menu.image}`}
                                        alt={menu.name} 
                                        className="card-img-top" 
                                    />
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title">{menu.name}</h5>
                                        <div className="meta-info">
                                            <small className="text-muted">
                                                <strong>식사 시간:</strong> {menu.mealTime}
                                            </small>
                                            <small className="text-muted">
                                                <strong>계절:</strong> {menu.season}
                                            </small>
                                        </div>
                                        <div className="description-box">
                                            <p className="card-text mb-0">{menu.description}</p>
                                        </div>
                                        <div className="meta-info">
                                            <small className="text-muted">
                                                작성일: {new Date(menu.createdAt).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                </MenuCard>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuList;