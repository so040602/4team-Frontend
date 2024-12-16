import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ReviewForm.css';
import BottomNavigation from '../components/BottomNavigation';

const ReviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    rating: 5  // 기본값 5로 설정
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchReview = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8989/api/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const review = response.data;
      setFormData({
        title: review.title,
        content: review.content,
        image: null,
        rating: review.rating || 5
      });
      setPreviewUrl(review.imageUrl);
    } catch (error) {
      console.error('Error fetching review:', error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchReview();
    }
  }, [id, fetchReview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('rating', formData.rating);  // rating 추가
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8989/api/reviews/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        navigate(`/reviews/${id}`); // 수정 후 상세 페이지로 이동
      } else {
        const response = await axios.post('http://localhost:8989/api/reviews', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        navigate('/reviews'); // 새 리뷰 작성 후에는 목록으로 이동
      }
    } catch (error) {
      console.error('리뷰 저장에 실패했습니다:', error);
    }
  };

  return (
    <div className="review-form-container">
      <div className="review-form-content">
        <h2>{isEditing ? '리뷰 수정' : '새 리뷰 작성'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>내용</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>평점</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= formData.rating ? 'filled' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  onMouseEnter={() => {
                    const stars = document.querySelectorAll('.star');
                    stars.forEach((s, index) => {
                      if (index < star) {
                        s.classList.add('hover');
                      } else {
                        s.classList.remove('hover');
                      }
                    });
                  }}
                  onMouseLeave={() => {
                    const stars = document.querySelectorAll('.star');
                    stars.forEach(s => s.classList.remove('hover'));
                  }}
                >
                  {star <= formData.rating ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>이미지</label>
            <div className="image-upload-container">
              <label className="image-upload-label" htmlFor="image-upload">
                {previewUrl ? (
                  <div className="image-preview">
                    <img src={previewUrl} alt="Preview" />
                    <div className="image-overlay">
                      <span>이미지 변경</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📸</div>
                    <span>이미지를 선택하거나 드래그하세요</span>
                    <span className="upload-hint">권장 크기: 1200 x 800px</span>
                  </div>
                )}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">
              {isEditing ? '수정하기' : '작성하기'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/reviews')}
            >
              취소
            </button>
          </div>
        </form>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ReviewForm;