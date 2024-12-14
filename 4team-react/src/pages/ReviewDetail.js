import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button, Form, ListGroup, Image } from 'react-bootstrap';
import moment from 'moment';
import BottomNavigation from '../components/BottomNavigation';
import SingleComment from '../components/comments/SingleComment';
import ReplyComment from '../components/comments/ReplyComment';
import '../styles/ReviewDetail.css';

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.memberId);
    }
    fetchReview();
    fetchComments();
  }, [id]);

  const fetchReview = async () => {
    try {
      const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
      const response = await axios.get(`http://localhost:8989/api/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // 인증 헤더 추가
        }
      });
      console.log('리뷰 데이터:', response.data); // 응답 데이터 로그 추가
      setReview(response.data);
      setLoading(false);
    } catch (error) {
      console.error('리뷰를 불러오는데 실패했습니다:', error);
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
      const response = await axios.get(`http://localhost:8989/api/reviews/${id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}` // 인증 헤더 추가
        }
      });
      // 댓글 데이터에 memberDisplayName이 포함되어 있는지 확인
      const commentsWithDisplayName = response.data.map(comment => ({
        ...comment,
        memberDisplayName: comment.memberDisplayName || 'Unknown User' // 기본값 설정
      }));
      setComments(commentsWithDisplayName);
    } catch (error) {
      console.error('댓글을 불러오는데 실패했습니다:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8989/api/reviews/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert('리뷰가 성공적으로 삭제되었습니다.');
        // 약간의 지연 후 페이지 이동
        setTimeout(() => {
          navigate('/reviews', { replace: true });
        }, 500);
      } catch (error) {
        console.error('리뷰 삭제에 실패했습니다:', error);
        alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
      const commentData = {
        reviewId: id,
        content: newComment,
        memberId: userId // 로그인한 사용자 ID로 설정
      };
      await axios.post(`http://localhost:8989/api/reviews/comments`, commentData, {
        headers: {
          Authorization: `Bearer ${token}` // 인증 헤더 추가
        }
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('댓글 작성에 실패했습니다:', error);
    }
  };

  const handleReplySubmit = async (parentId) => {
    try {
      const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
      const replyData = {
        parentId: parentId,
        content: replyContent[parentId] || '',
        memberId: userId // 로그인한 사용자 ID로 설정
      };
      await axios.post(`http://localhost:8989/api/reviews/comments/reply`, replyData, {
        headers: {
          Authorization: `Bearer ${token}` // 인증 헤더 추가
        }
      });
      setReplyContent(prev => ({ ...prev, [parentId]: '' }));
      fetchComments();
    } catch (error) {
      console.error('대댓글 작성에 실패했습니다:', error);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
      const commentData = {
        content: editCommentContent,
        memberId: userId // 로그인한 사용자 ID로 설정
      };
      await axios.put(`http://localhost:8989/api/reviews/comments/${commentId}`, commentData, {
        headers: {
          Authorization: `Bearer ${token}` // 인증 헤더 추가
        }
      });
      setEditingCommentId(null);
      setEditCommentContent('');
      fetchComments();
    } catch (error) {
      console.error('댓글 수정에 실패했습니다:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
        await axios.delete(`http://localhost:8989/api/reviews/comments/${commentId}`, {
          headers: {
            Authorization: `Bearer ${token}` // 인증 헤더 추가
          }
        });
        fetchComments();
      } catch (error) {
        console.error('댓글 삭제에 실패했습니다:', error);
      }
    }
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const toggleReplies = (commentId) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const renderReviewActions = () => {
    if (review && review.memberId === userId) {
      return (
        <div>
          <Link to={`/reviews/${id}/edit`} className="btn btn-warning">수정</Link>
          <Button variant="danger" onClick={handleDelete}>삭제</Button>
        </div>
      );
    }
    return null;
  };

  const renderCommentActions = (comment) => {
    if (comment.memberId === userId) {
      return (
        <div>
          <Button variant="warning" onClick={() => startEditingComment(comment)}>수정</Button>
          <Button variant="danger" onClick={() => handleDeleteComment(comment.id)}>삭제</Button>
        </div>
      );
    }
    return null;
  };

  const renderComments = () => {
    return comments.map((comment) => (
      !comment.parentId && (
        <React.Fragment key={comment.id}>
          <SingleComment
            refreshFunction={fetchComments}
            comment={comment}
            reviewId={id}
          />
          <ReplyComment
            refreshFunction={fetchComments}
            commentList={comments}
            parentCommentId={comment.id}
            reviewId={id}
          />
        </React.Fragment>
      )
    ));
  };

  return (
    <div className="review-detail-container">
      {loading ? (
        <p>Loading...</p>
      ) : review ? (
        <>
          <div className="review-detail-content">
            <h2>{review.title}</h2>
            {review.imageUrl && (
              <img
                src={`http://localhost:8989/api/reviews/images/${review.imageUrl}`}
                alt="리뷰 이미지"
                className="review-detail-image"
              />
            )}
            <div className="review-detail-info">
              <span>작성자: {review.memberDisplayName}</span>
              <span>조회수: {review.viewCount}</span>
              <span>작성일: {moment(review.createdAt).format('YYYY-MM-DD')}</span>
            </div>
            <p className="review-detail-text">{review.content}</p>
            
            {review.memberId === userId && (
              <div className="review-detail-actions">
                <Link to={`/reviews/${id}/edit`} className="edit-button">수정</Link>
                <button onClick={handleDelete} className="delete-button">삭제</button>
              </div>
            )}
          </div>

          <div className="comments-section">
            <h3>댓글</h3>
            <Form onSubmit={handleCommentSubmit} className="comment-form">
              <Form.Group>
                <Form.Control
                  as="textarea"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 작성해주세요"
                />
              </Form.Group>
              <Button type="submit" className="comment-submit-btn">댓글 작성</Button>
            </Form>

            <div className="comments-list">
              {renderComments()}
            </div>
          </div>
        </>
      ) : (
        <p>리뷰를 찾을 수 없습니다.</p>
      )}
      <BottomNavigation />
    </div>
  );
};

export default ReviewDetail;
