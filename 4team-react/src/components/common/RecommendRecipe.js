import "../../pages/MyRefriUi.css"

function RecommendRecipe(props) {
    const recommedList = props.recommedRecipes;
    console.log(props.recommedRecipes);

    return(

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
        </div>

    );
}

export default RecommendRecipe;