import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import RecipeCard from "../components/common/RecipeCard";
import "./ThemeRecipeList.css";

// 상수 정의
const COOKING_TOOLS = [
  { id: "1", name: "가스레인지" },
  { id: "2", name: "인덕션" },
  { id: "3", name: "프라이팬" },
  { id: "4", name: "그릴팬" },
  { id: "5", name: "웍" },
  { id: "6", name: "냄비" },
  { id: "7", name: "오븐" },
  { id: "8", name: "튀김기" },
  { id: "9", name: "압력밥솥" },
  { id: "10", name: "전기밥솥" },
  { id: "11", name: "토스터" },
  { id: "12", name: "커피머신" },
  { id: "13", name: "믹서기" },
  { id: "14", name: "에어프라이어" },
  { id: "15", name: "전자레인지" }
];

const SITUATIONS = [
  "일상식",
  "간편식",
  "영양식",
  "야식",
  "채식",
  "이유식",
  "다이어트",
  "디저트",
  "손님접대",
  "술안주",
  "도시락",
  "해장",
  "명절"
];

function ThemeRecipeList() {
  const { themeId } = useParams();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 필터링과 정렬을 위한 상태
  const [sortBy, setSortBy] = useState("latest");
  const [timeFilter, setTimeFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [toolFilters, setToolFilters] = useState([]);
  const [situationFilter, setSituationFilter] = useState("");
  const [showAllTools, setShowAllTools] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchThemeData = () => {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      setLoading(true);
      axios
        .get(`http://localhost:8989/api/themes/${themeId}/recipes`, { headers })
        .then((response) => {
          if (response.data && response.data.length > 0) {
            const themeData = {
              themeId: response.data[0].themeId,
              themeName: response.data[0].themeName,
              themeDescription: response.data[0].themeDescription,
              recipes: response.data.map((recipe) => ({
                ...recipe,
                difficulty: getDifficultyLevel(recipe.difficultyLevel),
                cookingTime: getCookingTimeInMinutes(recipe.cookingTime),
                liked: recipe.liked || false
              }))
            };
            setTheme(themeData);
          }
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
  }, [themeId]);

  // 난이도를 영문으로 변환하는 함수
  const getDifficultyLevel = (level) => {
    const difficultyMap = {
      쉬움: "beginner",
      보통: "intermediate",
      어려움: "advanced"
    };
    return difficultyMap[level] || "beginner";
  };

  // 조리시간을 분 단위로 변환하는 함수
  const getCookingTimeInMinutes = (timeString) => {
    if (timeString.includes("시간")) {
      const hours = parseInt(timeString);
      return hours * 60;
    }
    return parseInt(timeString) || 30; // 기본값 30분
  };

  const displayedTools = isMobile
    ? showAllTools
      ? COOKING_TOOLS
      : COOKING_TOOLS.slice(0, 5)
    : COOKING_TOOLS;

  const filteredAndSortedRecipes = useMemo(() => {
    if (!theme?.recipes) return [];

    let result = [...theme.recipes];

    // 필터 적용
    result = result.filter((recipe) => {
      // 조리 시간 필터
      if (timeFilter) {
        const time = parseInt(timeFilter);
        if (time === 61 && recipe.cookingTime <= 60) return false;
        if (time !== 61 && recipe.cookingTime > time) return false;
      }

      // 난이도 필터
      if (difficultyFilter && recipe.difficulty !== difficultyFilter)
        return false;

      // 조리도구 필터
      if (
        toolFilters.length > 0 &&
        !recipe.cookingTools.some((tool) => toolFilters.includes(tool))
      )
        return false;

      // 상황 필터
      if (situationFilter && recipe.situation !== situationFilter) return false;

      return true;
    });

    // 정렬 적용
    switch (sortBy) {
      case "likes":
        result.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "latest":
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [
    theme,
    sortBy,
    timeFilter,
    difficultyFilter,
    toolFilters,
    situationFilter
  ]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="error-container">
        <div className="error-message">테마를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="theme-recipe-list">
      <div className="theme-header">
        <h1>{theme.themeName}</h1>
        <p>{theme.themeDescription}</p>
      </div>

      <div className="filters-section">
        {/* 정렬 옵션 */}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="likes">좋아요순</option>
        </select>

        {/* 조리시간 필터 */}
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          <option value="">조리시간</option>
          <option value="15">15분 이하</option>
          <option value="30">30분 이하</option>
          <option value="60">1시간 이하</option>
          <option value="61">1시간 초과</option>
        </select>

        {/* 난이도 필터 */}
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="">난이도</option>
          <option value="beginner">쉬움</option>
          <option value="intermediate">보통</option>
          <option value="advanced">어려움</option>
        </select>

        {/* 상황 필터 */}
        <select
          value={situationFilter}
          onChange={(e) => setSituationFilter(e.target.value)}
        >
          <option value="">상황</option>
          {SITUATIONS.map((situation) => (
            <option key={situation} value={situation}>
              {situation}
            </option>
          ))}
        </select>

        {/* 조리도구 필터 */}
        <div className="cooking-tools-filter">
          {displayedTools.map((tool) => (
            <label key={tool.id}>
              <input
                type="checkbox"
                checked={toolFilters.includes(tool.name)}
                onChange={() => {
                  setToolFilters((prev) =>
                    prev.includes(tool.name)
                      ? prev.filter((t) => t !== tool.name)
                      : [...prev, tool.name]
                  );
                }}
              />
              {tool.name}
            </label>
          ))}
          {isMobile && COOKING_TOOLS.length > 5 && (
            <button
              className="cooking-tools-view-all-btn"
              onClick={() => setShowAllTools(!showAllTools)}
            >
              {showAllTools ? "접기" : "전체 보기"}
            </button>
          )}
        </div>
      </div>

      <div className="recipes-grid">
        {filteredAndSortedRecipes.map((recipe) => (
          <RecipeCard key={recipe.recipeId} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default ThemeRecipeList;
