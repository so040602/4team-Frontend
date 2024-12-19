import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ReviewList.css';
import BottomNavigation from '../components/BottomNavigation';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get('http://localhost:8989/api/reviews', { headers });
      console.log('Reviews Data:', JSON.stringify(response.data, null, 2));
      setReviews(response.data);
    } catch (error) {
      console.error('리뷰 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return '-';
  
    // 날짜가 배열이 아니라면 Date 객체로 변환
    let date;
    if (Array.isArray(dateInput)) {
      const [year, month, day] = dateInput;
      date = new Date(year, month - 1, day); // Date 객체로 변환
    } else {
      date = new Date(dateInput); // 문자열 또는 다른 형식이 Date로 변환
    }
  
    // 날짜가 유효한지 확인
    if (isNaN(date.getTime())) return '-';
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}. ${month}. ${day}`;
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
                  <div>
                    <span>{review.memberDisplayName}</span>
                    <span className="rating">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
                  </div>
                  <div>
                    <span>조회수: {review.viewCount?.toLocaleString() || 0}</span>
                    <span>작성일: {formatDate(review.createdAt)}</span>
                  </div>
                </div>
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
