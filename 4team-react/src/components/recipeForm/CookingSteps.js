import React from "react";
import ImageUpload from "../common/ImageUpload";
import "./CookingSteps.css";

const CookingSteps = ({ recipeSteps, onChange }) => {
  // 이미지 변경 핸들러
  const handleImageChange = (index, image) => {
    const updatedSteps = [...recipeSteps];
    updatedSteps[index] = { ...updatedSteps[index], image };
    onChange(updatedSteps);
  };

  // 설명 변경 핸들러
  const handleDescriptionChange = (index, description) => {
    const updatedSteps = [...recipeSteps];
    updatedSteps[index] = { ...updatedSteps[index], description };
    onChange(updatedSteps);
  };

  // 조리 순서 추가
  const addStep = () => {
    const maxId = Math.max(...recipeSteps.map((step) => step.id), 0);
    onChange([...recipeSteps, { id: maxId + 1, image: null, description: "" }]);
  };

  // 조리 순서 삭제
  const removeStep = (index) => {
    if (recipeSteps.length > 1) {
      const updatedSteps = recipeSteps.filter((_, i) => i !== index);
      onChange(updatedSteps);
    }
  };

  return (
    <section className="section">
      <h3 className="section-title">조리 순서</h3>
      {recipeSteps.map((step, index) => (
        <div key={step.id} className="cooking-step">
          <div className="step-header">
            <span className="step-number">Step {index + 1}</span>
            {recipeSteps.length > 1 && (
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="remove-button"
              >
                삭제
              </button>
            )}
          </div>
          <div className="step-content">
            <ImageUpload
              width="150px"
              height="150px"
              placeholder={`단계 ${index + 1} 사진`}
              format="(JPG, PNG)"
              image={step.image}
              onChange={(image) => handleImageChange(index, image)}
            />
            <textarea
              value={step.description}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}
              placeholder={`${index + 1}번 조리과정을 입력하세요`}
              className="step-description"
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={addStep} className="add-button">
        + 조리 순서 추가
      </button>
    </section>
  );
};

export default CookingSteps;
