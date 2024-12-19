import React from "react";
import ImageUpload from "../common/ImageUpload";

const BasicInfo = ({ basicInfo, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...basicInfo,
      [field]: value
    });
  };

  return (
    <section className="section">
      <h3 className="section-title">기본 정보</h3>
      <div className="form-group">
        <label>레시피 제목</label>
        <input
          type="text"
          value={basicInfo.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="레시피 제목을 입력하세요"
        />
      </div>

      <div className="form-group">
        <label>대표 이미지</label>
        <div className="main-image-container">
          <ImageUpload
            width="100%"
            height="100%"
            placeholder="이미지를 선택하거나 여기로 드래그하세요"
            format="(JPG, PNG)"
            image={basicInfo.image}
            onChange={(image) => handleChange("image", image)}
          />
        </div>
      </div>
    </section>
  );
};

export default BasicInfo;
