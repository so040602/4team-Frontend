import React, { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import "./Ingredients.css";
import Swal from "sweetalert2";

const Ingredients = ({ ingredients, searchResults, onSearch, onChange }) => {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어만 로컬 상태로 관리
  const [activeInput, setActiveInput] = useState(null);

  // 검색어 디바운스 처리
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 디바운스된 검색어가 변경될 때만 검색 실행
  useEffect(() => {
    if (debouncedSearchTerm) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  // 사용자가 검색어를 입력할 때 호출
  const handleSearchChange = (e, index) => {
    const value = e.target.value;
    setSearchTerm(value);
    setActiveInput(index);

    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      ingredientId: null,
      name: value
    };
    onChange(updatedIngredients);
  };

  // 사용자가 수량을 입력할 때 호출
  const handleAmountChange = (e, index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      amount: e.target.value
    };
    onChange(updatedIngredients);
  };

  // 검색 결과를 정렬하는 함수
  const sortSearchResults = (results) => {
    return results.sort((a, b) => {
      const exactMatchA = a.ingredientName === searchTerm;
      const exactMatchB = b.ingredientName === searchTerm;
      if (exactMatchA && !exactMatchB) return -1;
      if (!exactMatchB && exactMatchA) return 1;
      return a.ingredientName.length - b.ingredientName.length;
    });
  };

  // 검색 결과에서 재료를 선택할 때 호출
  const handleIngredientSelect = (selectedIngredient) => {
    const isDuplicate = ingredients.some(
      (ingredient, i) =>
        ingredient.ingredientId === selectedIngredient.ingredientId &&
        i !== activeInput
    );

    if (isDuplicate) {
      Swal.fire({
        title: "재료 중복",
        text: "이미 등록된 재료입니다.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#FF6B6B"
      });
      setSearchTerm("");
      const updatedIngredients = [...ingredients];
      updatedIngredients[activeInput] = {
        ...updatedIngredients[activeInput],
        ingredientId: null,
        name: "",
        amount: updatedIngredients[activeInput].amount
      };
      onChange(updatedIngredients);
      return;
    }

    const updatedIngredients = [...ingredients];
    updatedIngredients[activeInput] = {
      ...updatedIngredients[activeInput],
      ingredientId: selectedIngredient.ingredientId,
      name: selectedIngredient.ingredientName,
      amount: updatedIngredients[activeInput].amount || ""
    };
    onChange(updatedIngredients);
    setSearchTerm("");
    setActiveInput(null);
  };

  const handleAddIngredient = () => {
    onChange([...ingredients, { ingredientId: null, name: "", amount: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    if (ingredients.length > 1) {
      onChange(ingredients.filter((_, i) => i !== index));
    }
  };

  return (
    <section className="section">
      <h3 className="section-title">재료 등록</h3>
      <div className="ingredients-section">
        <h4 className="subsection-title">식재료 및 조미료</h4>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-row">
            <div className="ingredient-search-container">
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => handleSearchChange(e, index)}
                placeholder="재료 검색"
                className="ingredient-search"
              />
              {activeInput === index && searchTerm && (
                <ul className="search-results">
                  {sortSearchResults(searchResults).map((result, i) => (
                    <li
                      key={i}
                      onClick={() => handleIngredientSelect(result)}
                      className={
                        result.ingredientName === searchTerm
                          ? "exact-match"
                          : ""
                      }
                    >
                      {result.ingredientName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input
              type="text"
              value={ingredient.amount}
              onChange={(e) => handleAmountChange(e, index)}
              placeholder="수량"
              className="ingredient-amount"
            />
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveIngredient(index)}
                className="remove-button"
              >
                삭제
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddIngredient}
          className="add-button"
        >
          + 재료 추가
        </button>
      </div>
    </section>
  );
};

export default Ingredients;
