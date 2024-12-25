import React, { useCallback, useEffect, useState } from "react";
import "./RecipeCreate.css";
import BasicInfo from "../components/recipeForm/BasicInfo";
import CookingInfo from "../components/recipeForm/CookingInfo";
import Ingredients from "../components/recipeForm/Ingredients";
import CookingSteps from "../components/recipeForm/CookingSteps";
import CookingTip from "../components/recipeForm/CookingTip";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function RecipeCreate() {
  // 기본 정보 상태 관리
  const [basicInfo, setBasicInfo] = useState({
    title: "",
    image: null
  });

  // 요리 정보 상태 관리
  const [cookingInfo, setCookingInfo] = useState({
    servings: "1인분",
    cookingTime: "15분 이내",
    situation: "일상식",
    difficulty: "쉬움"
  });
  const [cookingTools, setCookingTools] = useState([]);
  const [selectedCookingTools, setSelectedCookingTools] = useState([]);

  // 재료 관련 상태 관리
  const [searchResults, setSearchResults] = useState([]);
  const [ingredients, setIngredients] = useState([
    { id: 1, name: "", amount: "" }
  ]);

  // 조리 순서 관련 상태 관리
  const [recipeSteps, setRecipeSteps] = useState([
    { id: 1, image: null, description: "" }
  ]);

  // 조리 팁 상태 관리
  const [cookingTip, setCookingTip] = useState("");

  // 페이지 로드 시 임시저장 레시피 확인
  useEffect(() => {
    checkTempSavedRecipe();
  }, []);

  // 임시저장 레시피 확인 함수
  const checkTempSavedRecipe = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    axios
      .get(`http://localhost:8989/recipe_form/temp-saved/${user.memberId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((response) => {
        if (response.data) {
          Swal.fire({
            title: "임시저장된 레시피 불러오기",
            text: "이전에 임시저장된 레시피를 불러왔습니다.",
            icon: "info",
            timer: 2000,
            showConfirmButton: false
          });
          loadTempSavedRecipe(response.data);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status !== 204) {
          console.error("임시저장 레시피 확인 중 오류 발생:", error);
        }
      });
  };

  // 임시저장 레시피 로드 함수
  const loadTempSavedRecipe = (data) => {
    // 기본 정보 설정
    const newBasicInfo = {
      title: data.recipeTitle || "",
      image: data.recipeThumbnail
        ? {
            preview: `http://localhost:8989${data.recipeThumbnail}`,
            imageUrl: data.recipeThumbnail,
            file: null
          }
        : null
    };
    setBasicInfo(newBasicInfo);

    // 요리 정보 설정
    const newCookingInfo = {
      servings: data.servingSize || "1인분",
      cookingTime: data.cookingTime || "15분 이내",
      situation: data.situation || "일상식",
      difficulty: data.difficultyLevel || "쉬움"
    };
    setCookingInfo(newCookingInfo);

    // 임시저장된 레시피의 조리도구 처리
    const selectedToolIds = data.recipeCookingTools.map(
      (tool) => tool.cookingToolId
    );
    setSelectedCookingTools(selectedToolIds);

    // 레시피 단계 설정
    if (data.recipeSteps?.length > 0) {
      const newSteps = data.recipeSteps.map((step, index) => {
        return {
          id: step.stepOrder || index + 1,
          description: step.stepDescription || "",
          image: step.stepImage
            ? {
                preview: `http://localhost:8989${step.stepImage}`,
                imageUrl: step.stepImage,
                file: null
              }
            : null
        };
      });
      setRecipeSteps(newSteps);
    }

    // 레시피 재료 설정
    if (data.recipeIngredients?.length > 0) {
      const newIngredients = data.recipeIngredients.map((ingredient) => ({
        id: ingredient.ingredientId || Math.random(),
        ingredientId: ingredient.ingredientId,
        name: ingredient.ingredientName || "",
        amount: ingredient.ingredientAmount || ""
      }));
      setIngredients(newIngredients);
    }

    // 조리 팁 설정
    const newTip = data.recipeTip || "";
    setCookingTip(newTip);
  };

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
        console.error("Error fetching cooking tools:", error);
      });
  }, []);

  // 재료 검색 결과 목록 가져오기
  // searchIngredients 함수 useCallback으로 메모이제이션
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

  // 요리 정보 변경 핸들러
  const handleCookingInfoChange = (info) => {
    setCookingInfo(info);
  };

  // 조리도구 선택 변경 핸들러
  const handleCookingToolsChange = (toolIds) => {
    setSelectedCookingTools(toolIds);
  };

  // 재료 목록 변경 핸들러 (업데이트)
  const handleIngredientsChange = useCallback((updatedIngredients) => {
    setIngredients(updatedIngredients);
  }, []);

  // 조리 순서 변경 핸들러
  const handleRecipeStepsChange = useCallback((updatedSteps) => {
    setRecipeSteps(updatedSteps);
  }, []);

  // 조리 팁 변경 핸들러
  const handleCookingTipChange = useCallback((updatedTip) => {
    setCookingTip(updatedTip);
  }, []);

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
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((response) => {
        const filename = response.data;
        return `/images/${filename}`;
      })
      .catch((error) => {
        Swal.fire({
          title: "이미지 업로드 실패",
          text: "이미지 업로드에 실패했습니다. 다시 시도해주세요.",
          icon: "error",
          confirmButtonText: "확인"
        });
        throw error;
      });
  };

  // 레시피 저장 함수
  const handleSaveRecipe = () => {
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

    // 먼저 이미지들 업로드
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

    // 모든 이미지 업로드가 완료된 후 레시피 저장
    Promise.all(uploadPromises)
      .then(() => {
        const recipeData = {
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
          recipeSteps: recipeSteps.some(
            (step) => step.description || step.image
          )
            ? recipeSteps
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
                }))
            : [],
          recipeIngredients: ingredients.some((i) => i.ingredientId)
            ? ingredients
                .filter((ingredient) => ingredient.ingredientId)
                .map((ingredient) => ({
                  ingredientId: ingredient.ingredientId,
                  ingredientAmount: ingredient.amount
                }))
            : [],
          recipeCookingTools: selectedCookingTools.some((id) => id)
            ? selectedCookingTools
                .filter((toolId) => toolId)
                .map((toolId) => ({
                  cookingToolId: toolId
                }))
            : []
        };

        return axios.post(
          "http://localhost:8989/recipe_form/create",
          recipeData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
      })
      .then((response) => {
        console.log("레시피 저장 응답:", response.data);
        Swal.fire({
          title: "저장 완료",
          text: "레시피가 성공적으로 저장되었습니다!",
          icon: "success",
          confirmButtonText: "확인"
        }).then(() => {
          navigate(`/recipe/${response.data.recipeId}`);
        });
      })
      .catch((error) => {
        console.error("레시피 저장 중 오류 발생:", error);
        Swal.fire({
          title: "저장 실패",
          text: "레시피 저장에 실패했습니다. 다시 시도해주세요.",
          icon: "error",
          confirmButtonText: "확인"
        });
      });
  };

  // 레시피 임시저장 함수
  const handleTempSaveRecipe = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // 먼저 이미지들 업로드
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

    // 모든 이미지 업로드가 완료된 후 레시피 임시저장
    Promise.all(uploadPromises)
      .then(() => {
        const tempRecipeData = {
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
          recipeSteps: recipeSteps.some(
            (step) => step.description || step.image
          )
            ? recipeSteps
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
                }))
            : [],
          recipeIngredients: ingredients.some((i) => i.ingredientId)
            ? ingredients
                .filter((ingredient) => ingredient.ingredientId)
                .map((ingredient) => ({
                  ingredientId: ingredient.ingredientId,
                  ingredientAmount: ingredient.amount
                }))
            : [],
          recipeCookingTools: selectedCookingTools.some((id) => id)
            ? selectedCookingTools
                .filter((toolId) => toolId)
                .map((toolId) => ({
                  cookingToolId: toolId
                }))
            : []
        };

        return axios.post(
          "http://localhost:8989/recipe_form/temp-save",
          tempRecipeData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
      })
      .then((response) => {
        console.log("레시피 임시저장 응답:", response.data);
        Swal.fire({
          title: "임시저장 완료",
          text: "레시피가 임시저장되었습니다!",
          icon: "success",
          confirmButtonText: "확인"
        }).then(() => {
          navigate("/mypage");
        });
      })
      .catch((error) => {
        console.error("레시피 임시저장 중 오류 발생:", error);
        Swal.fire({
          title: "임시저장 실패",
          text: "임시저장에 실패했습니다. 다시 시도해주세요.",
          icon: "error",
          confirmButtonText: "확인"
        });
      });
  };

  const navigate = useNavigate();

  return (
    <div className="recipe-create">
      <BasicInfo basicInfo={basicInfo} onChange={setBasicInfo} />
      <CookingInfo
        cookingTools={cookingTools}
        selectedCookingTools={selectedCookingTools}
        onCookingToolsChange={setSelectedCookingTools}
        cookingInfo={cookingInfo}
        onCookingInfoChange={setCookingInfo}
      />
      <Ingredients
        ingredients={ingredients}
        searchResults={searchResults}
        onSearch={searchIngredients}
        onChange={handleIngredientsChange}
      />
      <CookingSteps
        recipeSteps={recipeSteps}
        onChange={handleRecipeStepsChange}
      />
      <CookingTip tip={cookingTip} onChange={handleCookingTipChange} />

      <div className="button-group">
        <button className="btn btn-save" onClick={handleTempSaveRecipe}>
          임시 저장
        </button>
        <button className="btn btn-cancel" onClick={() => navigate(-1)}>
          취소
        </button>
        <button className="btn btn-submit" onClick={handleSaveRecipe}>
          등록
        </button>
      </div>
    </div>
  );
}

export default RecipeCreate;
