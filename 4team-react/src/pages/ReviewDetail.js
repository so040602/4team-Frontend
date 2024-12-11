import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Button, Form, ListGroup, Image } from 'react-bootstrap';
import moment from 'moment';

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
        const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
        await axios.delete(`http://localhost:8989/api/reviews/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // 인증 헤더 추가
          }
        });
        navigate('/reviews');
      } catch (error) {
        console.error('리뷰 삭제에 실패했습니다:', error);
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
      <ListGroup.Item key={comment.id} className="d-flex flex-column p-3" style={{ borderBottom: '1px solid #e9ecef' }}>
        <div className="d-flex align-items-start">
          <Image
            src="https://via.placeholder.com/40"
            roundedCircle
            className="me-3"
            alt="프로필 이미지"
          />
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong className="d-block" style={{ fontSize: '1rem', color: '#333' }}>{comment.memberDisplayName}</strong>
                <small className="text-muted">{moment(comment.createdAt).fromNow()}</small>
              </div>
              <div className="d-flex gap-2">
                {comment.memberId === userId && (
                  <Button variant="link" size="sm" onClick={() => startEditingComment(comment)}>수정</Button>
                )}
                {comment.memberId === userId && (
                  <Button variant="link" size="sm" onClick={() => handleDeleteComment(comment.id)}>삭제</Button>
                )}
                <Button variant="link" size="sm" onClick={() => setReplyContent(prev => ({ ...prev, [comment.id]: '' }))}>답글</Button>
              </div>
            </div>
            {editingCommentId === comment.id ? (
              <Form onSubmit={(e) => { e.preventDefault(); handleEditComment(comment.id); }} className="mt-2">
                <Form.Group className="mb-2">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                    required
                  />
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary" size="sm">저장</Button>
                  <Button variant="secondary" size="sm" onClick={() => setEditingCommentId(null)}>취소</Button>
                </div>
              </Form>
            ) : (
              <p className="mt-2" style={{ fontSize: '0.9rem', color: '#555' }}>{comment.content}</p>
            )}
            {replyContent[comment.id] !== undefined && (
              <Form onSubmit={(e) => { e.preventDefault(); handleReplySubmit(comment.id); }} className="mt-3">
                <Form.Group className="mb-2">
                  <Form.Control
                    as="textarea"
                    rows={1}
                    value={replyContent[comment.id] || ''}
                    onChange={(e) => setReplyContent(prev => ({ ...prev, [comment.id]: e.target.value }))}
                    placeholder="대댓글을 입력하세요..."
                  />
                </Form.Group>
                <Button type="submit" variant="secondary" size="sm">
                  대댓글 작성
                </Button>
              </Form>
            )}
          </div>
        </div>
        {comment.childComments && comment.childComments.length > 0 && (
          <ListGroup variant="flush" className="mt-2 ps-5">
            {comment.childComments.map((reply) => (
              <ListGroup.Item key={reply.id} className="d-flex align-items-start" style={{ borderTop: '1px solid #f1f3f5' }}>
                <Image
                  src="https://via.placeholder.com/30"
                  roundedCircle
                  className="me-2"
                  alt="프로필 이미지"
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong className="d-block" style={{ fontSize: '0.9rem', color: '#333' }}>{reply.memberDisplayName}</strong>
                      <small className="text-muted">{moment(reply.createdAt).fromNow()}</small>
                    </div>
                    <div className="d-flex gap-2">
                      {reply.memberId === userId && (
                        <Button variant="link" size="sm" onClick={() => startEditingComment(reply)}>수정</Button>
                      )}
                      {reply.memberId === userId && (
                        <Button variant="link" size="sm" onClick={() => handleDeleteComment(reply.id)}>삭제</Button>
                      )}
                    </div>
                  </div>
                  <p className="mt-2" style={{ fontSize: '0.85rem', color: '#555' }}>{reply.content}</p>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </ListGroup.Item>
    ));
  };

  if (loading) return <div>Loading...</div>;
  if (!review) return <div>리뷰를 찾을 수 없습니다.</div>;

  return (
    <Container className="mt-4">
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>{review.title}</h3>
          {renderReviewActions()}
        </Card.Header>
        <Card.Body>
          {review.imageUrl && (
            <div className="mb-3">
              <img 
                src={`http://localhost:8989/api/reviews/images/${review.imageUrl}`}
                alt="리뷰 이미지" 
                className="img-fluid" 
              />
            </div>
          )}
          <Card.Text>작성자: {review.memberDisplayName}</Card.Text>
          <Card.Text>{review.content}</Card.Text>
          <div className="d-flex justify-content-between mt-3">
            <div>
              <small className="text-muted">평점: {review.rating}/5</small>
            </div>
            <div>
              <small className="text-muted">조회수: {review.viewCount}</small>
            </div>
          </div>
          <div className="mt-2">
            <small className="text-muted">
              작성일: {moment(review.createdAt).fromNow()}
              {review.updatedAt && review.updatedAt !== review.createdAt && 
                ` (수정됨: ${moment(review.updatedAt).fromNow()})`}
            </small>
          </div>
        </Card.Body>
      </Card>

      {/* 댓글 섹션 */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">댓글 ({comments.length})</h5>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush" className="mb-3">
            {renderComments()}
          </ListGroup>

          <Form onSubmit={handleCommentSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={2}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                required
              />
            </Form.Group>
            <div className="text-end">
              <Button type="submit" variant="primary">
                댓글 작성
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReviewDetail;
