import "../../pages/MyRefriUi.css"

function RecommendRecipe(props) {
    const recommedList = props.recommedRecipes;
    console.log(props.recommedRecipes);

    return(
        <div className="space-y-6">
            {/* 추천 레시피 */}
            <div className="card">
                <h2 className="section-title">추천 레시피</h2>
                <div className="recipe-card-container">
                    {recommedList && recommedList.map((recipe, index) => (
                        <div key={index} className="recipe-card">
                            <img 
                            src={recipe.recipeThumbnail} 
                            alt={recipe.recipeTitle} 
                            className="recipe-card-image"
                            />
                        
                        <div className="recipe-card-content">
                            <h3 className="recipe-card-title">{recipe.recipeTitle}</h3>
                        
                            <div className="recipe-card-tip">
                                <span className="recipe-tip-icon">💡</span>
                                <p>{recipe.recipeTip}</p>
                            </div>
                        </div>
                       </div>    
                    ))}
                {/* 여기에 추천 레시피 내용 추가 예정 */}
                </div>
            </div>
        </div>
    );
}

export default RecommendRecipe;