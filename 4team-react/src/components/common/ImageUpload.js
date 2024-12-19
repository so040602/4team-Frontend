import React, { useState, useEffect } from "react";
import "./ImageUpload.css";

const ImageUpload = ({
  width,
  height,
  placeholder,
  format,
  image,
  onChange
}) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (image) {
      // 상대 경로인 경우 전체 URL로 변환
      const previewUrl = image.preview?.startsWith("/")
        ? `http://localhost:8989${image.preview}`
        : image.preview;
      setPreview(previewUrl);
    } else {
      setPreview(null);
    }
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = {
          preview: reader.result,
          file: file
        };
        setPreview(reader.result);
        onChange(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-upload-box" style={{ width, height }}>
      <input
        type="file"
        accept="image/*"
        className="image-input"
        onChange={handleImageChange}
      />
      {preview ? (
        <img src={preview} alt="미리보기" className="image-preview" />
      ) : (
        <label className="image-label">
          <span>{placeholder}</span>
          <span className="image-format">{format}</span>
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
