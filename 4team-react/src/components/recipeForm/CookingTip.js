import React from "react";

const CookingTip = ({ tip, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <section className="section">
      <h3 className="section-title">조리 팁</h3>
      <div className="form-group">
        <textarea
          value={tip}
          onChange={handleChange}
          placeholder="예) 맛있게 만드는 나만의 팁을 공유해주세요"
          className="tip-textarea"
          rows={4}
        />
      </div>
    </section>
  );
};

export default CookingTip;
