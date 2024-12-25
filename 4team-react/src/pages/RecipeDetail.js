import React, { useEffect, useState, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getCookingIcon } from "../components/icons/CookingIcons";
import "./RecipeDetail.css";

// 메모이제이션된 좋아요 버튼 컴포넌트
const LikeButton = memo(({ recipe, onLikeClick }) => (
  <button
    className={`like-button ${recipe?.liked ? "liked" : ""}`}
    onClick={onLikeClick}
  >
    <div className="like-icon-wrapper">
      {recipe?.liked ? "❤️" : "🤍"}
      <span className="like-count">{recipe?.likeCount}</span>
    </div>
  </button>
));

function RecipeDetail() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  // const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8989/recipe/detail/${recipeId}`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`
            }
          : {}
      })
      .then((response) => {
        console.log("받아온 레시피 데이터:", response.data);
        setRecipe(response.data);
        // localStorage에서 사용자 정보 가져오기
        // const user = JSON.parse(localStorage.getItem("user"));
        // if (user && user.displayName) {
        //   setAuthorName(user.displayName);
        // }
        setError(null);

        // 레시피 조회 기록 남기기
        if (token) {
          axios.post(`http://localhost:8989/recipe_form/${recipeId}/view`, null, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).catch(error => {
            console.error('레시피 조회 기록 실패:', error);
          });
        }
      })
      .catch((error) => {
        console.error("레시피 데이터 로딩 중 에러 발생:", error);
        setError("레시피를 불러오는데 실패했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [recipeId]);

  // 좋아요 핸들러 메모이제이션
  const handleLikeClick = useCallback(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: {
          redirectTo: `/recipe/${recipeId}`,
          message: "좋아요를 누르려면 로그인이 필요합니다."
        }
      });
      return;
    }

    axios
      .post(
        `http://localhost:8989/recipe/like/${recipeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((response) => {
        console.log("좋아요 응답 데이터:", response.data);
        setRecipe((prev) => ({
          ...prev,
          liked: response.data.liked,
          likeCount: response.data.likeCount
        }));
      })
      .catch((error) => {
        console.error("좋아요 처리 중 에러 발생:", error);
      });
  }, [recipeId, navigate]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!recipe) return <div>레시피를 찾을 수 없습니다.</div>;

  return (
    <div className="recipe-detail">
      {/* 레시피 제목 및 대표 이미지 */}
      <section className="detail-header">
        <div className="detail-thumbnail-container">
          {recipe.recipeThumbnail ? (
            <img
              src={`http://localhost:8989${recipe.recipeThumbnail}`}
              alt={recipe.recipeTitle}
              className="detail-thumbnail-image"
            />
          ) : (
            <div className="detail-placeholder-image">이미지 준비중</div>
          )}
          <div className="recipe-info-overlay">
            <h1 className="recipe-title">{recipe.recipeTitle}</h1>
            <p className="recipe-author">{recipe.displayName}님의 레시피</p>
          </div>
        </div>
      </section>

      {/* 좋아요 버튼 - 고정 위치 */}
      <div className="fixed-like-section">
        <LikeButton recipe={recipe} onLikeClick={handleLikeClick} />
      </div>

      {/* 요리 정보 */}
      <section className="cooking-info">
        <div className="recipe-info-grid">
          <div className="info-item">
            <div className="info-header">
              <span className="info-icon">🧑‍🤝‍🧑</span>
              <span className="info-label">인원</span>
            </div>
            <span className="info-value">{recipe.servingSize}</span>
          </div>
          <div className="info-item">
            <div className="info-header">
              <span className="info-icon">⌛</span>
              <span className="info-label">조리시간</span>
            </div>
            <span className="info-value">{recipe.cookingTime}</span>
          </div>
          <div className="info-item">
            <div className="info-header">
              <span className="info-icon">🔥</span>
              <span className="info-label">난이도</span>
            </div>
            <span className="info-value">{recipe.difficultyLevel}</span>
          </div>
          <div className="info-item">
            <div className="info-header">
              <span className="info-icon">🍽️</span>
              <span className="info-label">상황</span>
            </div>
            <span className="info-value">{recipe.situation}</span>
          </div>
        </div>
      </section>

      {/* 조리도구 */}
      <h2 className="section-title">조리도구</h2>
      <section className="cooking-tools">
        <div className="tools-container">
          <div className="tools-list">
            {recipe.recipeCookingTools.map((tool, index) => {
              const IconComponent = getCookingIcon(tool.cookingToolName);
              return (
                <div key={index} className="tool-item">
                  {IconComponent && (
                    <div className="tool-icon">
                      <IconComponent />
                    </div>
                  )}
                  <span className="tool-name">{tool.cookingToolName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 재료 목록 */}
      <section className="ingredients">
        <h2 className="section-title">재료</h2>
        <div className="ingredients-container">
          <div className="ingredients-list">
            {recipe.recipeIngredients.map((ingredient, index) => (
              <div key={index} className="ingredient-item">
                <div className="ingredient-main">
                  <div className="ingredient-image">
                    {ingredient.ingredientImage && (
                      <img
                        src={ingredient.ingredientImage}
                        alt={ingredient.ingredientName}
                      />
                    )}
                  </div>
                  <div className="ingredient-info">
                    <span className="ingredient-name">
                      {ingredient.ingredientName}
                    </span>
                    <span className="ingredient-amount">
                      {ingredient.ingredientAmount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 조리팁 */}
      {recipe.recipeTip && (
        <section className="recipe-tip">
          <h2 className="section-title">조리팁</h2>
          <div className="tip-container">
            <p>{recipe.recipeTip}</p>
          </div>
        </section>
      )}

      {/* 조리 순서 */}
      <section className="cooking-steps">
        <h2 className="section-title">조리 순서</h2>
        <div className="steps-container">
          {recipe.recipeSteps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-header">
                <span className="step-number">Step {step.stepOrder}</span>
                <button
                  className="view-step-btn"
                  onClick={() => setCurrentStep(index)}
                >
                  크게 보기
                </button>
              </div>
              <div className="step-content">
                <div className="step-image">
                  {step.stepImage ? (
                    <img
                      src={`http://localhost:8989${step.stepImage}`}
                      alt={`조리 단계 ${step.stepOrder}`}
                    />
                  ) : (
                    <div className="placeholder-image">이미지 준비중</div>
                  )}
                </div>
                <p className="step-description">{step.stepDescription}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 스텝 모달 */}
      {currentStep !== null && (
        <div
          className="step-modal-overlay"
          onClick={() => setCurrentStep(null)}
        >
          <div
            className="step-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={() => setCurrentStep(null)}
            >
              ×
            </button>
            <div className="modal-step-content">
              <h3>Step {recipe.recipeSteps[currentStep].stepOrder}</h3>
              <div className="step-image-container">
                {currentStep > 0 && (
                  <button
                    className="step-nav-btn prev"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    ＜
                  </button>
                )}
                <div className="step-image-large">
                  {recipe.recipeSteps[currentStep].stepImage ? (
                    <img
                      src={`http://localhost:8989${recipe.recipeSteps[currentStep].stepImage}`}
                      alt={`조리 단계 ${recipe.recipeSteps[currentStep].stepOrder}`}
                    />
                  ) : (
                    <div className="placeholder-image">이미지 준비중</div>
                  )}
                </div>
                {currentStep < recipe.recipeSteps.length - 1 && (
                  <button
                    className="step-nav-btn next"
                    onClick={() => setCurrentStep(currentStep + 1)}
                  >
                    ＞
                  </button>
                )}
              </div>
              <p className="step-description">
                {recipe.recipeSteps[currentStep].stepDescription}
              </p>
            </div>
          </div>
        </div>
      )}
      {JSON.parse(localStorage.getItem("user"))?.memberId ===
        recipe.memberId && (
        <div className="button-container">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button
            type="button"
            className="submit-button"
            onClick={() => {
              console.log("Sending recipe data:", recipe);
              navigate(`/recipe/edit/${recipeId}`, {
                state: { recipe: recipe }
              });
            }}
          >
            수정
          </button>
        </div>
      )}
    </div>
  );
}

export default RecipeDetail;
