import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/common/RecipeCard";
import "./MainPageList.css";

// 메인 페이지에 표시할 테마 ID 목록
const FEATURED_THEME_IDS = [2, 3, 4];

function MainPageList() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThemeData = () => {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      setLoading(true);

      // 선택된 테마들의 데이터를 병렬로 가져옴
      const themePromises = FEATURED_THEME_IDS.map((themeId) =>
        axios
          .get(`http://localhost:8989/api/themes/${themeId}/recipes`, {
            headers
          })
          .then((response) => {
            if (response.data && response.data.length > 0) {
              return {
                themeId: response.data[0].themeId,
                themeName: response.data[0].themeName,
                themeDescription: response.data[0].themeDescription,
                recipes: response.data.map((recipe) => ({
                  ...recipe,
                  liked: recipe.liked || false,
                  likeCount: recipe.likeCount || 0
                }))
              };
            }
            return null;
          })
      );

      Promise.all(themePromises)
        .then((themesData) => {
          // null 값 제거 및 유효한 테마만 필터링
          const validThemes = themesData.filter((theme) => theme !== null);
          setThemes(validThemes);
        })
        .catch((error) => {
          console.error("Error fetching theme data:", error);
          setError("테마 데이터를 불러오는 중 오류가 발생했습니다.");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchThemeData();
  }, []);

  const scrollContainersRef = useRef({});

  const handleMouseDown = (e, containerId) => {
    const container = scrollContainersRef.current[containerId];
    if (!container) return;

    container.isDragging = true;
    container.startX = e.pageX - container.offsetLeft;
    container.scrollLeft = container.scrollLeft;
  };

  const handleMouseMove = (e, containerId) => {
    const container = scrollContainersRef.current[containerId];
    if (!container || !container.isDragging) return;

    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - container.startX) * 1.5;
    container.scrollLeft = container.scrollLeft - walk;
  };

  const handleMouseUp = (containerId) => {
    if (scrollContainersRef.current[containerId]) {
      scrollContainersRef.current[containerId].isDragging = false;
    }
  };

  const handleMouseLeave = (containerId) => {
    if (scrollContainersRef.current[containerId]) {
      scrollContainersRef.current[containerId].isDragging = false;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="mainpagelist-container">
      <div className="theme-sections">
        {themes.map((theme) => (
          <section key={theme.themeId} className="mainpagelist-theme-section">
            <div className="mainpagelist-theme-header">
              <div className="mainpagelist-theme-title-container">
                <h2>{theme.themeName}</h2>
                <p className="mainpagelist-theme-desc">
                  {theme.themeDescription}
                </p>
              </div>
              <button
                className="mainpagelist-view-all-btn"
                onClick={() => navigate(`/theme/${theme.themeId}`)}
              >
                전체보기
              </button>
            </div>
            <div
              className="recipe-cards-container"
              ref={(el) => (scrollContainersRef.current[theme.themeId] = el)}
              onMouseDown={(e) => handleMouseDown(e, theme.themeId)}
              onMouseMove={(e) => handleMouseMove(e, theme.themeId)}
              onMouseUp={() => handleMouseUp(theme.themeId)}
              onMouseLeave={() => handleMouseLeave(theme.themeId)}
            >
              <div className="recipe-cards-wrapper">
                {theme.recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default MainPageList;
