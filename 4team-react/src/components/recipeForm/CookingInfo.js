import React from "react";
import "./CookingInfo.css";

const CookingInfo = ({
  cookingTools,
  onCookingToolsChange,
  cookingInfo,
  onCookingInfoChange,
  selectedCookingTools
}) => {
  const handleInfoChange = (field, value) => {
    onCookingInfoChange({
      ...cookingInfo,
      [field]: value
    });
  };

  const toggleTool = (toolId) => {
    console.log("Toggling tool:", toolId);
    console.log("Current selected tools:", selectedCookingTools);

    const newSelection = selectedCookingTools.includes(toolId)
      ? selectedCookingTools.filter((id) => id !== toolId)
      : [...selectedCookingTools, toolId];

    console.log("New selected tools:", newSelection);
    onCookingToolsChange(newSelection);
  };

  const renderSelectField = (label, field, options) => {
    return (
      <div className="form-group">
        <label>{label}</label>
        <select
          value={cookingInfo[field]}
          onChange={(e) => handleInfoChange(field, e.target.value)}
        >
          {options.map((option, index) => (
            <option key={index}>{option}</option>
          ))}
        </select>
      </div>
    );
  };

  const renderToolButton = (tool) => {
    const toolId = tool.cookingToolId;
    const isSelected =
      Array.isArray(selectedCookingTools) &&
      selectedCookingTools.includes(toolId);

    return (
      <button
        key={toolId}
        type="button"
        className={`tool-button ${isSelected ? "selected" : ""}`}
        onClick={() => toggleTool(toolId)}
      >
        {tool.cookingToolName}
      </button>
    );
  };

  return (
    <section className="section">
      <h3 className="section-title">요리 정보</h3>
      <div className="cooking-info-grid">
        {renderSelectField("인원", "servings", [
          "1인분",
          "2인분",
          "3인분",
          "4인분 이상"
        ])}
        {renderSelectField("조리 시간", "cookingTime", [
          "15분 이내",
          "30분 이내",
          "1시간 이내",
          "1시간 이상"
        ])}
        {renderSelectField("상황", "situation", [
          "일상식",
          "간편식",
          "영양식",
          "야식",
          "채식",
          "이유식",
          "다이어트",
          "디저트",
          "손님접대",
          "술안주",
          "도시락",
          "해장",
          "명절"
        ])}
        {renderSelectField("난이도", "difficulty", ["쉬움", "보통", "어려움"])}
      </div>

      <div className="form-group">
        <label>조리 도구 (중복 선택 가능)</label>
        <div className="cooking-tools">
          {cookingTools.map(renderToolButton)}
        </div>
      </div>
    </section>
  );
};

export default CookingInfo;
