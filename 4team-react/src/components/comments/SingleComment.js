import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

function SingleComment(props) {
  const [commentValue, setCommentValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const userId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).memberId;

  const handleChange = (e) => {
    setCommentValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const commentData = {
        reviewId: props.reviewId,
        content: commentValue,
        memberId: userId,
        parentId: props.comment.id // If replying to a comment
      };

      await axios.post(`http://localhost:8989/api/reviews/comments/reply`, commentData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCommentValue('');
      setShowReplyForm(false);
      props.refreshFunction();
    } catch (error) {
      console.error('댓글 작성에 실패했습니다:', error);
    }
  };

  const handleEdit = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:8989/api/reviews/comments/${props.comment.id}`,
        {
          content: commentValue,
          memberId: userId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setIsEditing(false);
      props.refreshFunction();
    } catch (error) {
      console.error('댓글 수정에 실패했습니다:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(
          `http://localhost:8989/api/reviews/comments/${props.comment.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        props.refreshFunction();
      } catch (error) {
        console.error('댓글 삭제에 실패했습니다:', error);
      }
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <span className="comment-author">{props.comment.memberDisplayName}</span>
        <span className="comment-date">
          {new Date(props.comment.createdAt).toLocaleDateString()}
        </span>
      </div>
      {!isEditing ? (
        <div className="comment-content">{props.comment.content}</div>
      ) : (
        <Form onSubmit={(e) => {
          e.preventDefault();
          handleEdit();
        }}>
          <Form.Control
            as="textarea"
            value={commentValue}
            onChange={handleChange}
            className="mb-2"
          />
          <div className="d-flex gap-2">
            <Button type="submit" variant="primary" size="sm">
              수정완료
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              취소
            </Button>
          </div>
        </Form>
      )}
      <div className="comment-actions mt-2">
        {userId === props.comment.memberId && (
          <>
            <Button
              variant="outline-warning"
              size="sm"
              onClick={() => {
                setIsEditing(true);
                setCommentValue(props.comment.content);
              }}
            >
              수정
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleDelete}
            >
              삭제
            </Button>
          </>
        )}
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          답글
        </Button>
      </div>
      {showReplyForm && (
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group>
            <Form.Control
              as="textarea"
              value={commentValue}
              onChange={handleChange}
              placeholder="답글을 작성하세요..."
              className="mb-2"
            />
          </Form.Group>
          <div className="d-flex gap-2">
            <Button type="submit" variant="primary" size="sm">
              답글작성
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowReplyForm(false)}
            >
              취소
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}

export default SingleComment;
