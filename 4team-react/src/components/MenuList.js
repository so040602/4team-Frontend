import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';

const FilterCard = styled.div`
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    margin-bottom: 20px;
    background-color: ${props => props.active ? props.activeColor : props.bgColor};
    color: ${props => props.active ? '#fff' : '#000'};
    border: 2px solid ${props => props.borderColor};
    height: 100%;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .period {
        font-size: 0.9em;
        margin-top: 5px;
        color: ${props => props.active ? '#fff' : '#666'};
    }

    .icon {
        font-size: 1.5em;
        margin-bottom: 10px;
    }
`;

const MenuCard = styled.div`
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 15px;
    overflow: hidden;
    border: none;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .card-header {
        height: 160px;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        color: #fff;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        border: none;
    }

    .card-body {
        padding: 1.5rem;
        background: #fff;
    }

    .card-title {
        font-weight: bold;
        margin-bottom: 1rem;
        color: #2c3e50;
    }

    .text-muted {
        color: #7f8c8d !important;
    }

    .description-box {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
    }

    .meta-info {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-top: 1px solid #eee;
        margin-top: 1rem;
    }
`;

const seasonConfig = {
    '봄': { 
        bgColor: '#fce4ec', 
        activeColor: '#f06292', 
        borderColor: '#f48fb1', 
        period: '3월 - 5월',
        icon: '🌸'
    },
    '여름': { 
        bgColor: '#e0f7fa', 
        activeColor: '#4dd0e1', 
        borderColor: '#80deea', 
        period: '6월 - 8월',
        icon: '☀️'
    },
    '가을': { 
        bgColor: '#fff3e0', 
        activeColor: '#ffa726', 
        borderColor: '#ffb74d', 
        period: '9월 - 11월',
        icon: '🍁'
    },
    '겨울': { 
        bgColor: '#e8eaf6', 
        activeColor: '#7986cb', 
        borderColor: '#9fa8da', 
        period: '12월 - 2월',
        icon: '❄️'
    }
};

const mealTimeConfig = {
    '아침': { 
        bgColor: '#e8f5e9', 
        activeColor: '#66bb6a', 
        borderColor: '#81c784',
        period: '아침 식사',
        icon: '🌅'
    },
    '점심': { 
        bgColor: '#e3f2fd', 
        activeColor: '#42a5f5', 
        borderColor: '#64b5f6',
        period: '점심 식사',
        icon: '☀️'
    },
    '저녁': { 
        bgColor: '#f3e5f5', 
        activeColor: '#ab47bc', 
        borderColor: '#ba68c8',
        period: '저녁 식사',
        icon: '🌙'
    },
    '랜덤': { 
        bgColor: '#fff3e0', 
        activeColor: '#ff7043', 
        borderColor: '#ff8a65',
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
        <div className="container py-5">
            <h1 className="text-center mb-5">메뉴 추천 서비스</h1>
            
            <div className="row mb-4">
                {/* 계절 필터 */}
                <div className="col-12 mb-4">
                    <h4 className="text-center mb-4">계절별 추천메뉴</h4>
                    <div className="row">
                        {Object.entries(seasonConfig).map(([season, config]) => (
                            <div key={season} className="col-md-3 col-6">
                                <FilterCard
                                    onClick={() => handleFilterClick('season', season)}
                                    active={activeFilters.season === season}
                                    bgColor={config.bgColor}
                                    activeColor={config.activeColor}
                                    borderColor={config.borderColor}
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
                    <h4 className="text-center mb-4">식사 시간대</h4>
                    <div className="row">
                        {Object.entries(mealTimeConfig).map(([time, config]) => (
                            <div key={time} className="col-md-3 col-6 mb-3">
                                <FilterCard
                                    onClick={() => handleFilterClick('mealTime', time)}
                                    active={activeFilters.mealTime === time}
                                    bgColor={config.bgColor}
                                    activeColor={config.activeColor}
                                    borderColor={config.borderColor}
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
                                        🍽️
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