import { Button } from "react-bootstrap";
import "../../pages/MyRefriUi.css"
import { useState } from 'react';

function RecommendRecipe(props) {
    const recommedList = props.recommedRecipes;
    console.log(props.recommedRecipes);

    const [visibleCount, setVisibleCount] = useState(3);

    if(!recommedList){
        return <div>Loading</div>
    }

    const showMoreRecipes = () => {
        setVisibleCount(prevCount => prevCount + 3);
    };

    const visibleRecipes = recommedList.slice(0, visibleCount);

    return(

        <div className="recipe-card-container">
            {visibleRecipes && visibleRecipes.map((recipe, index) => (
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

            {visibleCount < recommedList.length && (
                <Button onClick={showMoreRecipes}>더 보기</Button>
            )}
        </div>

    );
}

export default RecommendRecipe;