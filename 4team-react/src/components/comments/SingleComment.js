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
    <div style={{ marginBottom: '1rem' }}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <strong>{props.comment.memberDisplayName}</strong>
          {!isEditing ? (
            <p>{props.comment.content}</p>
          ) : (
            <Form onSubmit={(e) => {
              e.preventDefault();
              handleEdit();
            }}>
              <Form.Control
                type="text"
                value={commentValue}
                onChange={handleChange}
              />
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
            </Form>
          )}
        </div>
        <div>
          {userId === props.comment.memberId && (
            <>
              <Button
                variant="warning"
                size="sm"
                onClick={() => {
                  setIsEditing(true);
                  setCommentValue(props.comment.content);
                }}
              >
                수정
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
              >
                삭제
              </Button>
            </>
          )}
          <Button
            variant="info"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            답글
          </Button>
        </div>
      </div>
      {showReplyForm && (
        <Form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <Form.Group>
            <Form.Control
              type="text"
              value={commentValue}
              onChange={handleChange}
              placeholder="답글을 작성하세요..."
            />
          </Form.Group>
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
        </Form>
      )}
    </div>
  );
}

export default SingleComment;
