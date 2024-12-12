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
      } else {
        await axios.post('http://localhost:8989/api/reviews', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      }
      navigate('/reviews');
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
            <select
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              required
            >
              <option value="1">1점</option>
              <option value="2">2점</option>
              <option value="3">3점</option>
              <option value="4">4점</option>
              <option value="5">5점</option>
            </select>
          </div>
          <div className="form-group">
            <label>이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
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