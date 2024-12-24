import React from "react";
import { useNavigate } from "react-router-dom";
import "./RecipeCard.css";

function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe/${recipe.recipeId}`);
  };

  return (
    <div className="recipe-card" onClick={handleClick}>
      <div className="recipe-thumbnail">
        {recipe.recipeThumbnail ? (
          <img
            src={`http://localhost:8989${recipe.recipeThumbnail}`}
            alt={recipe.recipeTitle}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/default-recipe.jpg";
            }}
          />
        ) : (
          <div className="no-thumbnail">이미지 준비중</div>
        )}
      </div>
      <div className="recipe-info">
        <h3>{recipe.recipeTitle}</h3>
        <div className="recipe-meta">
          <span className="recipe-likes">
            {recipe.liked ? "❤️" : "🤍"} {recipe.likeCount}
          </span>
          <span className="difficulty-level">🔥 {recipe.difficultyLevel}</span>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
