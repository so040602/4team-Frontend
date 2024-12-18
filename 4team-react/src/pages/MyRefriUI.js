import axios from "axios";
import { useState, useEffect } from 'react';
import RefriTitle from '../components/common/ExistRefrigerator';
import RefriIngred from "../components/common/RefriIngredient";
import RecommendRecipe from "../components/common/RecommendRecipe";

function MyRefriUI() {
    const [receivedData, setReceivedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refriId, setRefriId] = useState(null);
    const [ingredient, setIngredient] = useState(null);
    const [refriIngredient, setRefriIngredient] = useState(null);
    const [recommedRecipes, setRecommedRecipes] = useState(null);

    const FetchFunction = () => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if(!user || !user.memberId){
                    console.error('사용자 정보가 없습니다.')
                    return;
                }
                /* 요청이 시작 할 때에는 error 와 receivedData 를 초기화하고 */
                setError(null);
                setReceivedData(null);

                /* loading 상태를 true 로 바꿉니다. */
                setLoading(true);
                const url = `http://localhost:8989/refri/MyRefri`;
                const response = await axios.get(url, {
                    params: {
                        memberId: user.memberId
                    }
                });

                /* 데이터는 response.data 안에 들어있습니다. */
                setReceivedData(response.data);
                console.log(response.data);

            } catch (error) {
                setError(error);    
            } finally{
                setLoading(false); /* 로딩이 끝났음 */
            }

        }; /* end fetchData */
        fetchData();
    }

    const handleRegister = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if(!user || !user.memberId){
                console.error('사용자 정보가 없습니다.');
                return;
            }

            setLoading(true);
            const url = 'http://localhost:8989/refri/insertRefri';
            const response = await axios.post(url, null,{
                params: {
                    memberId: user.memberId
                }
            });
            
            if(response.data) {
                console.log('냉장고 등록 성공');
                // 데이터를 다시 불러와서 화면 갱신
                console.log(response.data);
                setRefriId(response.data.refri_id);
                FetchFunction();
            }
        } catch (error) {
            console.error('냉장고 등록 실패:', error);
            setError(error);
        }
        setLoading(false);
    }

    const searchRefriId = async () => {
        try {
            setError(null);
            setLoading(true);

            const user = JSON.parse(localStorage.getItem('user'));
            if(!user || !user.memberId){
                console.error('사용자 정보가 없습니다.')
                return;
            }

            console.log(user.memberId);
            const searchRefriIdResponse = await axios.post('http://localhost:8989/refri/getrefriId', {memberId: user.memberId});
            console.log(searchRefriIdResponse.data)
            setRefriId(searchRefriIdResponse.data);

            searchIngredient(searchRefriIdResponse.data);
            
        } catch (error) {
            setError(error);
        }finally{
            setLoading(false);
        }
    }

    const searchIngredient = async (refriId) => {
        try {                   
            setError(null);
            setLoading(true);
            
            const ingredientResponse = await axios.get('http://localhost:8989/refri/ingredients');
            setIngredient(ingredientResponse.data);
            console.log(ingredientResponse.data);

            const refriIngredientResponse = await axios.get(`http://localhost:8989/refri/myingredients/${refriId}`);
            const uniqueIngredients = refriIngredientResponse.data.reduce((acc, current) => {
                const found = acc.find(item => item.ingredientId === current.ingredientId);
                if(!found){
                    acc.push(current)
                }
                return acc;
            }, []);

            setRefriIngredient(uniqueIngredients);
            console.log(uniqueIngredients);

            const uniqueIngredientsIds = uniqueIngredients.map(item => item.ingredientId);

            const recommendRecipeResponse = await axios.post('http://localhost:8989/refri/recommendRecipe', uniqueIngredientsIds);
            console.log(recommendRecipeResponse.data);
            setRecommedRecipes(recommendRecipeResponse.data);
                       
        } catch (error) {
            setError(error);
        } finally{
            setLoading(false);
        }

    }

	useEffect(FetchFunction, []); /* end useEffect */
    useEffect(() => {
        if(receivedData) {
            searchRefriId();
        }
    }, [receivedData]);

	if (loading) return <div>로딩중..</div>;
	if (error) return <div>에러가 발생했습니다</div>;
	if (receivedData == null) return null;

    return (
        <div className="refrigerator-container">
            <div className="scroll-container">
                {/* 냉장고 제목 */}
                <RefriTitle receivedData={receivedData} />
                

                {/* 냉장고가 없을 때만 등록 버튼 표시 */}
                {!receivedData && (
                    <div className="text-center mt-6">
                        <button 
                            onClick={handleRegister}
                            className="register-button"
                        >
                            냉장고 등록하기
                        </button>
                    </div>
                )}

                {/* 메인 콘텐츠 */}
                {receivedData && (
                    <div className="grid">
                        <RefriIngred ingredient={ingredient} refriIngredient={refriIngredient} refriId={refriId}/>               
                        <RecommendRecipe recommedRecipes={recommedRecipes}/>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyRefriUI;