import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const ReviewForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (isEditing) {
      fetchReview();
    }
  }, [id, navigate]);

  const fetchReview = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8989/api/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { title, content, imageUrl, rating } = response.data;
      setFormData({ title, content, rating });
      if (imageUrl) {
        setPreviewUrl(`http://localhost:8989/api/reviews/images/${imageUrl}`);
      }
    } catch (error) {
      console.error('리뷰를 불러오는데 실패했습니다:', error);
      setError('리뷰를 불러오는데 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('rating', formData.rating);
      
      if (selectedFile) {
        submitData.append('image', selectedFile);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };

      if (isEditing) {
        await axios.put(`http://localhost:8989/api/reviews/${id}`, submitData, config);
      } else {
        await axios.post('http://localhost:8989/api/reviews', submitData, config);
      }
      navigate('/reviews');
    } catch (error) {
      console.error('리뷰 저장에 실패했습니다:', error);
      if (error.response) {
        setError(error.response.data.message || '리뷰 저장에 실패했습니다. 다시 시도해주세요.');
      } else {
        setError('서버와의 통신에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2>{isEditing ? '리뷰 수정' : '새 리뷰 작성'}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>제목</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>내용</Form.Label>
          <Form.Control
            as="textarea"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={5}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>평점</Form.Label>
          <Form.Control
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="1"
            max="5"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>이미지</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: '200px', marginTop: '10px' }}
            />
          )}
        </Form.Group>
        <div className="d-flex gap-2">
          <Button variant="primary" type="submit">
            {isEditing ? '수정하기' : '작성하기'}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/reviews')}>
            취소
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ReviewForm;
