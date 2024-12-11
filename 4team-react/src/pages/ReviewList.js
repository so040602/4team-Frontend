import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Container } from 'react-bootstrap';

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

  const renderReviewActions = (review) => {
    console.log('Checking review:', review.id, 'Review Member ID:', review.memberId, 'Current User ID:', userId);
    if (review.memberId === userId) {
      return (
        <div className="d-flex justify-content-center">
          <Link to={`/reviews/${review.id}/edit`} className="btn btn-warning btn-sm me-2">수정</Link>
          <Button variant="danger" size="sm" onClick={() => handleDelete(review.id)}>삭제</Button>
        </div>
      );
    }
    return null;
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
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>리뷰 목록</h2>
        <Link to="/reviews/new">
          <Button variant="primary">새 리뷰 작성</Button>
        </Link>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{ width: '5%' }}>번호</th>
            <th style={{ width: '15%' }}>썸네일</th>
            <th style={{ width: '40%' }}>제목</th>
            <th style={{ width: '10%' }}>작성자</th>
            <th style={{ width: '10%' }}>조회수</th>
            <th style={{ width: '10%' }}>작성일</th>
            <th style={{ width: '10%' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td className="text-center">{review.id}</td>
              <td className="text-center">
                {review.imageUrl ? (
                  <img
                    src={`http://localhost:8989/api/reviews/images/${review.imageUrl}`}
                    alt="썸네일"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#f0f0f0',
                      margin: '0 auto'
                    }}
                  />
                )}
              </td>
              <td>
                <Link to={`/reviews/${review.id}`} className="text-decoration-none">
                  {review.title}
                </Link>
              </td>
              <td className="text-center">{review.memberDisplayName}</td>
              <td className="text-center">{review.viewCount}</td>
              <td className="text-center">
                {new Date(review.createdAt).toLocaleDateString()}
              </td>
              <td>{renderReviewActions(review)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ReviewList;
