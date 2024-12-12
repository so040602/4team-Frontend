import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ReviewList.css';
import BottomNavigation from '../components/BottomNavigation';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.memberId);
      console.log('Current User ID:', payload.memberId);
    }
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8989/api/reviews', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Reviews Data:', response.data);
      setReviews(response.data);
    } catch (error) {
      console.error('리뷰 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8989/api/reviews/${reviewId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchReviews();
      } catch (error) {
        console.error('리뷰 삭제에 실패했습니다:', error);
      }
    }
  };

  return (
    <div className="review-container">
      <div className="review-header">
        <h2 className="review-title">리뷰 목록</h2>
        <Link to="/reviews/new" className="new-review-button">
          새 리뷰 작성
        </Link>
      </div>
      
      <div className="review-grid">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <Link to={`/reviews/${review.id}`}>
              {review.imageUrl ? (
                <img
                  src={`http://localhost:8989/api/reviews/images/${review.imageUrl}`}
                  alt="리뷰 이미지"
                  className="review-image"
                />
              ) : (
                <div className="review-image" style={{ backgroundColor: '#f0f0f0' }} />
              )}
              <div className="review-content">
                <h3>{review.title}</h3>
                <div className="review-info">
                  <span>{review.memberDisplayName}</span>
                  <span>조회수: {review.viewCount}</span>
                </div>
                {review.memberId === userId && (
                  <div className="review-actions">
                    <Link to={`/reviews/${review.id}/edit`}>
                      <button className="edit-button">수정</button>
                    </Link>
                    <button className="delete-button" onClick={() => handleDelete(review.id)}>
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ReviewList;
