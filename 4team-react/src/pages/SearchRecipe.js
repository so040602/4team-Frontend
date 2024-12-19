import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import RecommendRecipe from "../components/common/RecommendRecipe";
import axios from "axios";


function SearchRecipes() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [searchQuery, setSearchQuery] = useState(queryParams.get('searchQuery'))
    const [receivedData, setReceivedData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    console.log(searchQuery);

    const searchRecipe = async () => {
        
        try {
            setError(null);
            setReceivedData(null);
    
            /* loading 상태를 true 로 바꿉니다. */
            setLoading(true);
    
            const url = `http://localhost:8989/recipe/searchrecipe/${searchQuery}`
            const searchReciperesponse = await axios.get(url);

            console.log(searchReciperesponse.data);
            setReceivedData(searchReciperesponse.data);

        } catch (error) {
            setError(error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        searchRecipe();
    }, []);

    return(
        <div className="refrigerator-container">
            <div className="grid">
                <div className="space-y-4">
                    <div className="card">
                        <h2 className="section-title">레시피 목록</h2>
                        <RecommendRecipe recommedRecipes={receivedData} />          
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchRecipes;