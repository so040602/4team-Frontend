import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BasicInfo from "../components/recipeForm/BasicInfo";
import CookingInfo from "../components/recipeForm/CookingInfo";
import Ingredients from "../components/recipeForm/Ingredients";
import CookingSteps from "../components/recipeForm/CookingSteps";
import CookingTip from "../components/recipeForm/CookingTip";
import Swal from "sweetalert2";
import "./RecipeCreate.css";

function RecipeEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe;

  // 기본 정보 상태
  const [basicInfo, setBasicInfo] = useState({
    title: "",
    image: null
  });

  // 요리 정보 상태
  const [cookingInfo, setCookingInfo] = useState({
    servings: "1인분",
    cookingTime: "15분 이내",
    situation: "일상식",
    difficulty: "쉬움"
  });

  // 조리도구 관련 상태
  const [cookingTools, setCookingTools] = useState([]);
  const [selectedCookingTools, setSelectedCookingTools] = useState([]);

  // 재료 관련 상태
  const [ingredients, setIngredients] = useState([
    { id: 1, name: "", amount: "" }
  ]);

  // 재료 검색 결과
  const [searchResults, setSearchResults] = useState([]);

  // 조리 순서 상태
  const [recipeSteps, setRecipeSteps] = useState([
    { id: 1, image: null, description: "" }
  ]);

  // 요리 팁 상태
  const [cookingTip, setCookingTip] = useState("");

  // 조리도구 목록 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:8989/recipe_form/getcookingtool", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((response) => {
        const formattedTools = response.data.map((tool) => ({
          cookingToolId: tool.cookingId,
          cookingToolName: tool.cookingToolName
        }));
        setCookingTools(formattedTools);
      })
      .catch((error) => {
        console.error("조리도구 목록 가져오기 중 오류 발생:", error);
      });
  }, []);

  // 재료 검색 함수
  const searchIngredients = useCallback((keyword) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    axios
      .get(
        `http://localhost:8989/recipe_form/searchingredient?keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.error("재료 검색 중 오류 발생:", error);
      });
  }, []);

  // 전달받은 레시피 데이터로 상태 초기화
  useEffect(() => {
    if (recipe) {
      console.log("Received recipe:", recipe);

      // 기본 정보 설정
      setBasicInfo({
        title: recipe.recipeTitle || "",
        image: recipe.recipeThumbnail
          ? {
              preview: `http://localhost:8989${recipe.recipeThumbnail}`,
              imageUrl: recipe.recipeThumbnail,
              file: null
            }
          : null
      });

      // 요리 정보 설정
      setCookingInfo({
        servings: recipe.servingSize || "1인분",
        cookingTime: recipe.cookingTime || "15분 이내",
        difficulty: recipe.difficultyLevel || "쉬움",
        situation: recipe.situation || "일상식"
      });

      // 조리도구 설정
      if (recipe.recipeCookingTools) {
        setSelectedCookingTools(
          recipe.recipeCookingTools.map((tool) => tool.cookingToolId)
        );
      }

      // 재료 정보 설정
      if (recipe.recipeIngredients && recipe.recipeIngredients.length > 0) {
        const mappedIngredients = recipe.recipeIngredients.map(
          (ingredient, index) => ({
            id: index + 1,
            ingredientId: ingredient.ingredientId,
            name: ingredient.ingredientName || "",
            amount: ingredient.ingredientAmount || ""
          })
        );
        setIngredients(mappedIngredients);
      }

      // 조리 순서 설정
      if (recipe.recipeSteps && Array.isArray(recipe.recipeSteps)) {
        console.log("Recipe steps:", recipe.recipeSteps);
        const mappedSteps = recipe.recipeSteps.map((step, index) => ({
          id: index + 1,
          description: step.stepDescription || "",
          image: step.stepImage
            ? {
                preview: `http://localhost:8989${step.stepImage}`,
                imageUrl: step.stepImage,
                file: null
              }
            : null,
          stepNumber: step.stepNumber || index + 1
        }));
        setRecipeSteps(mappedSteps);
      }

      // 요리 팁 설정
      if (recipe.recipeTip !== undefined && recipe.recipeTip !== null) {
        setCookingTip(recipe.recipeTip);
      } else {
        setCookingTip("");
      }
    }
  }, [recipe]);

  // 각 컴포넌트의 변경 핸들러
  const handleBasicInfoChange = useCallback((info) => {
    setBasicInfo(info);
  }, []);

  const handleCookingInfoChange = useCallback((info) => {
    setCookingInfo(info);
  }, []);

  const handleCookingToolsChange = useCallback((toolIds) => {
    setSelectedCookingTools(toolIds);
  }, []);

  const handleIngredientsChange = useCallback((updatedIngredients) => {
    setIngredients(updatedIngredients);
  }, []);

  const handleRecipeStepsChange = useCallback((steps) => {
    setRecipeSteps(steps);
  }, []);

  const handleCookingTipChange = useCallback((tip) => {
    setCookingTip(tip);
  }, []);

  // 취소 처리
  const handleCancel = () => {
    navigate(-1);
  };

  // 이미지 업로드 유틸리티 함수
  const uploadImage = (imageData) => {
    // 이미 업로드된 이미지인 경우
    if (typeof imageData === "string") {
      return Promise.resolve(imageData);
    }

    const file = imageData.file;
    if (!file) {
      return Promise.reject("No file to upload");
    }

    const formData = new FormData();
    formData.append("file", file);

    return axios
      .post("http://localhost:8989/upload/image", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((response) => {
        const filename = response.data;
        return `/images/${filename}`;
      })
      .catch((error) => {
        console.error("이미지 업로드 중 오류 발생:", error);
        Swal.fire({
          title: "이미지 업로드 실패",
          text: "이미지 업로드에 실패했습니다. 다시 시도해주세요.",
          icon: "error",
          confirmButtonText: "확인"
        });
        throw error;
      });
  };

  // 수정 완료 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    // 유효성 검사
    let validationErrors = [];

    // 기본 정보 검사
    if (
      !basicInfo.title ||
      basicInfo.title.length < 2 ||
      basicInfo.title.length > 20
    ) {
      validationErrors.push("레시피 제목은 2자 이상 20자 이하여야 합니다");
    }
    if (!basicInfo.image) {
      validationErrors.push("레시피 썸네일은 필수입니다");
    }

    // 요리 정보 검사
    if (!cookingInfo.servings) {
      validationErrors.push("몇 인분인지 선택해주세요");
    }
    if (!cookingInfo.cookingTime) {
      validationErrors.push("조리 시간은 필수입니다");
    }
    if (!cookingInfo.difficulty) {
      validationErrors.push("난이도는 필수입니다");
    }
    if (!cookingInfo.situation) {
      validationErrors.push("상황은 필수입니다");
    }

    // 조리 팁 길이 검사 (선택사항)
    if (cookingTip && cookingTip.length > 500) {
      validationErrors.push("조리 팁은 500자를 초과할 수 없습니다");
    }

    // 조리 단계 검사
    const validSteps = recipeSteps.filter(
      (step) => step.description || step.image
    );
    if (validSteps.length === 0) {
      validationErrors.push("최소 하나의 조리 단계가 필요합니다");
    } else {
      validSteps.forEach((step, index) => {
        if (!step.image) {
          validationErrors.push(
            `${index + 1}번 조리 단계의 이미지는 필수입니다`
          );
        }
        if (step.description && step.description.length > 1000) {
          validationErrors.push(
            `${index + 1}번 조리 단계의 설명은 1000자를 초과할 수 없습니다`
          );
        }
      });
    }

    // 재료 검사
    const selectedIngredients = ingredients.filter((i) => i.ingredientId);
    if (selectedIngredients.length === 0) {
      validationErrors.push("최소 하나의 재료가 필요합니다");
    } else {
      selectedIngredients.forEach((ingredient, index) => {
        if (!ingredient.amount || ingredient.amount.trim() === "") {
          validationErrors.push(`${index + 1}번째 재료의 양을 입력해주세요`);
        }
        if (ingredient.amount && ingredient.amount.length > 10) {
          validationErrors.push(
            `${index + 1}번째 재료의 양은 10자를 초과할 수 없습니다`
          );
        }
      });
    }

    // 조리도구 검사
    if (!selectedCookingTools.some((id) => id)) {
      validationErrors.push("최소 하나의 조리도구가 필요합니다");
    }

    // 유효성 검사 실패시 에러 메시지 표시
    if (validationErrors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "입력 오류",
        html: validationErrors.join("<br>"),
        confirmButtonText: "확인"
      });
      return;
    }

    try {
      // 이미지 업로드 처리
      const uploadPromises = [];

      // 대표 이미지 업로드
      if (basicInfo.image && basicInfo.image.file instanceof File) {
        uploadPromises.push(
          uploadImage(basicInfo.image).then((url) => (basicInfo.image = url))
        );
      }

      // 스텝 이미지들 업로드
      recipeSteps.forEach((step, index) => {
        if (step.image && step.image.file instanceof File) {
          uploadPromises.push(
            uploadImage(step.image).then(
              (url) => (recipeSteps[index].image = url)
            )
          );
        }
      });

      // 모든 이미지 업로드가 완료된 후 레시피 수정
      await Promise.all(uploadPromises);

      const recipeData = {
        recipeId: recipe.recipeId,
        memberId: user.memberId,
        recipeTitle: basicInfo.title,
        recipeThumbnail:
          typeof basicInfo.image === "string"
            ? basicInfo.image.startsWith("http://localhost:8989/")
              ? basicInfo.image.replace("http://localhost:8989", "")
              : basicInfo.image
            : basicInfo.image?.imageUrl || "",
        servingSize: cookingInfo.servings,
        cookingTime: cookingInfo.cookingTime,
        difficultyLevel: cookingInfo.difficulty,
        situation: cookingInfo.situation,
        recipeTip: cookingTip,
        recipeSteps: recipeSteps
          .filter((step) => step.description || step.image)
          .map((step, index) => ({
            stepOrder: index + 1,
            stepDescription: step.description,
            stepImage:
              typeof step.image === "string"
                ? step.image.startsWith("http://localhost:8989/")
                  ? step.image.replace("http://localhost:8989", "")
                  : step.image
                : step.image?.imageUrl || ""
          })),
        recipeIngredients: ingredients
          .filter((ingredient) => ingredient.ingredientId)
          .map((ingredient) => ({
            ingredientId: ingredient.ingredientId,
            ingredientAmount: ingredient.amount
          })),
        recipeCookingTools: selectedCookingTools
          .filter((toolId) => toolId)
          .map((toolId) => ({
            cookingToolId: toolId
          }))
      };

      // 레시피 수정 API 호출
      await axios.put(
        `http://localhost:8989/recipe/edit/${recipe.recipeId}`,
        recipeData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      Swal.fire({
        title: "수정 완료",
        text: "레시피가 성공적으로 수정되었습니다!",
        icon: "success",
        confirmButtonText: "확인"
      }).then(() => {
        navigate(-1); // 이전 페이지로 이동
      });
    } catch (error) {
      console.error("레시피 수정 중 오류 발생:", error);
      Swal.fire({
        title: "수정 실패",
        text: "레시피 수정에 실패했습니다. 다시 시도해주세요.",
        icon: "error",
        confirmButtonText: "확인"
      });
    }
  };

  // 삭제 처리 함수
  const handleDelete = () => {
    Swal.fire({
      title: "레시피 삭제",
      text: "정말로 이 레시피를 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "삭제",
      cancelButtonText: "취소"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8989/recipe/edit/${recipe.recipeId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          })
          .then(() => {
            Swal.fire({
              title: "삭제 완료",
              text: "레시피가 성공적으로 삭제되었습니다.",
              icon: "success",
              confirmButtonText: "확인"
            }).then(() => {
              navigate("/recipe"); // 메인 페이지로 이동
            });
          })
          .catch((error) => {
            console.error("레시피 삭제 중 오류 발생:", error);
            Swal.fire({
              title: "삭제 실패",
              text: "레시피 삭제에 실패했습니다. 다시 시도해주세요.",
              icon: "error",
              confirmButtonText: "확인"
            });
          });
      }
    });
  };

  if (!recipe) {
    return <div>레시피 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="recipe-create-container">
      <form onSubmit={handleSubmit}>
        <BasicInfo basicInfo={basicInfo} onChange={handleBasicInfoChange} />
        <CookingInfo
          cookingInfo={cookingInfo}
          onCookingInfoChange={handleCookingInfoChange}
          cookingTools={cookingTools}
          selectedCookingTools={selectedCookingTools}
          onCookingToolsChange={handleCookingToolsChange}
        />
        <Ingredients
          ingredients={ingredients}
          onChange={handleIngredientsChange}
          searchResults={searchResults}
          onSearch={searchIngredients}
        />
        <CookingSteps
          recipeSteps={recipeSteps}
          onChange={handleRecipeStepsChange}
        />
        <CookingTip tip={cookingTip} onChange={handleCookingTipChange} />
        <div className="button-container">
          <button type="submit" className="submit-button">
            수정 완료
          </button>
          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
          >
            삭제
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecipeEdit;
