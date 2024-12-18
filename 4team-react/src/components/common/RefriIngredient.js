import axios from "axios";
import { useEffect, useState } from "react";
import "../../pages/MyRefriUi.css"


function RefriIngred(props) {
    const ingredient = props.ingredient;
    const refriId = props.refriId;
    console.log(props.refriId);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState(new Set());
    const [selectedImage, setSelectedImage] = useState(null); //선택된 이미지 상태
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태
    const [receivedData, setReceivedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refriIngredient, setRefriIngredient] = useState(props.refriIngredient || []);

    const getIngredienName = (ingredientId) => {
        const matchedIngredient = ingredient.find(item => item.ingredientId === ingredientId);
        return matchedIngredient ? matchedIngredient.ingredientName : "Unknown Ingredient";
    };

      // 검색어가 변경될 때마다 필터링된 재료 목록 업데이트
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchTerm(query);

        // 검색어가 있을 때 필터링, 없을 때는 빈 배열 반환
        if(query.trim()) {
            const filtered = props.ingredient.filter((item) =>
                item.ingredientName.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredIngredients(filtered);
        }else{
            setFilteredIngredients([]); // 검색어가 없으면 결과 초기화
        }
    }

    const handleClick = (ingredient) => {
        setSelectedIngredients((prevSelected) => {
            const newSelected = new Set(prevSelected);  // 기존 Set 복사
            newSelected.add(ingredient);  // 중복을 허용하지 않으므로 추가될 수 없으면 아무 일도 일어나지 않음
            console.log(newSelected);
            return newSelected;
          });
    };

    const handleRemove = (ingredientToRemove) => {
        setSelectedIngredients((prevSelected) => {
            const newSelected = new Set(prevSelected); //기존 Set 복사
            newSelected.delete(ingredientToRemove); // Set에서 ingredient 제거
            return newSelected; // 새로운 Set 반환
        });
    };

    const Modal = ({imageUrl, onClose}) => {
        console.log(imageUrl);
        return (
            <div className="modal">
                <div className="modal_content">
                    <img 
                        src={imageUrl}
                        alt="Ingredient"
                        style={{ maxWidth: '100%', maxHeight: '500px' }}
                    />
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    };

    const handleIngredientClick = (ingredientId) => {
        const ingredientData = ingredient.find(item => item.ingredientId === ingredientId);
        console.log(ingredientData);
        if(ingredientData){
            setSelectedImage(ingredientData.ingredientImage); // 선택된 이미지 설정
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    const handleInsertIngredient = async () => {
        try {
            console.log(selectedIngredients);
            if(!selectedIngredients || selectedIngredients.size === 0){
                alert("등록된 재료가 없습니다.");
                console.log("재료 없음");
                return;
            }

            const ingredId = Array.from(selectedIngredients).map(ingredient => ingredient.ingredientId);
            console.log(ingredId);

            setError(null);
            setReceivedData(null);

            setLoading(true);
            const url = 'http://localhost:8989/refri/insertIngredient';

            console.log(refriId);
            console.log(ingredId);
            const response = await axios.post(url, {refriId,ingredId});

            setReceivedData(response.data);

            const uniqueIngredients = response.data.reduce((acc, current) => {
                const found = acc.find(item => item.ingredientId === current.ingredientId);
                if(!found){
                    acc.push(current)
                }
                return acc;
            }, []);

            setRefriIngredient(uniqueIngredients);

            console.log(response.data);

            setSelectedIngredients(new Set());
        
        } catch (error) {
            setError(error)
        } finally{
            setLoading(false);
        }
    };
    
    const handleRemoveMyrefriIngred = async (ingredientId) => {
        try {     
            setError(null);
            setLoading(true);
            console.log(ingredientId);
            console.log(refriId);

            const url = 'http://localhost:8989/refri/removeIngredient';

            const response = await axios.post(url, {refriId, ingredientId});

            const uniqueIngredients = response.data.reduce((acc, current) => {
                const found = acc.find(item => item.ingredientId === current.ingredientId);
                if(!found){
                    acc.push(current)
                }
                return acc;
            }, []);

            setRefriIngredient(uniqueIngredients);

            console.log(response.data);
            
        } catch (error) {
            setError(error);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        if(props.refriIngredient) {
            const uniqueIngredients = new Set(props.refriIngredient);
            setRefriIngredient(Array.from(uniqueIngredients));
        }
    }, [props.refriIngredient]);

    return (
        <div className="refrigerator-container">
            {/* 냉장고 재료 목록 */}
            <div className="card">
                <h2 className="section-title">냉장고 재료 목록</h2>
                <div className="space-y-2">
                    {refriIngredient && refriIngredient.map((refriItem, index) => (
                        <div key={index} className="ingredient-item">
                            <p onClick={() => handleIngredientClick(refriItem.ingredientId)}>{getIngredienName(refriItem.ingredientId)}</p>
                            <button key={index}
                                onClick={() => handleRemoveMyrefriIngred(refriItem.ingredientId)}
                                className="remove-button"
                            >X</button>
                        </div>
                ))}
                </div>
            </div>
            
            {/* 추가할 재료 */}
            <div className="card">
                {/* 재료 검색 */}
                <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">재료 검색</h3>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="재료를 검색하세요"
                            className="search-input"
                            value={searchTerm}
                            onChange={handleSearch} // 입력값이 바뀔 때마다 필터링
                        />
                        {filteredIngredients.map((item, index) =>(
                            <button 
                                key={index} 
                                onClick={() => handleClick(item)}
                                className="search-button"
                            >
                                {item.ingredientName}  
                            </button>
                        ))}
                        <button className="search-button">
                            검색
                        </button>
                    </div>
                </div>
                <h2 className="section-title">추가할 재료</h2>
                <div>
                    {[...selectedIngredients].map((item, index) => (
                        item.ingredientName && (
                        <div key={index}
                            className="selected-ingredient"
                        >
                            <p className="cursor-pointer" onClick={() => handleIngredientClick(item.ingredientId)}>{item.ingredientName}</p>
                            <button
                                onClick={() => handleRemove(item)}
                                className="remove-button"
                            >
                                X
                            </button>
                        </div>
                        )
                    ))}
                    <div>
                        <button
                            onClick={() => handleInsertIngredient()}
                            className="add-ingredient-button"
                        >
                                추가하기
                        </button>
                    </div>
                </div>
            </div>
            {isModalOpen && <Modal imageUrl={selectedImage} onClose={handleCloseModal} />}
        </div>
    );
}

export default RefriIngred;