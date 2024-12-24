import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea, Rating, CardMedia, Box } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MyReviews({ userId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const url = userId 
          ? `/api/reviews/user/${userId}`
          : '/api/reviews/my';
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReviews(response.data);
      } catch (error) {
        console.error('리뷰 목록을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

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

  if (loading) {
    return (
      <Typography variant="body1" color="text.secondary" align="center">
        로딩 중...
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {reviews.length === 0 ? (
        <Grid item xs={12}>
          <Typography variant="body1" color="text.secondary" align="center">
            작성한 리뷰가 없습니다.
          </Typography>
        </Grid>
      ) : (
        reviews.map((review) => (
          <Grid item xs={12} sm={6} md={4} key={review.id}>
            <Card sx={{
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.3s ease',
              height: '100%',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}>
              <CardActionArea component={Link} to={`/reviews/${review.id}`}>
                {review.imageUrl && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={`http://localhost:8989/api/reviews/images/${review.imageUrl}`}
                    alt={review.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ p: 2 }}>
                  <Typography 
                    gutterBottom 
                    variant="h6"
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#333',
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.3
                    }}
                  >
                    {review.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating 
                      value={review.rating} 
                      readOnly 
                      size="small"
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: '#ff6b6b',
                        }
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        ml: 1,
                        color: '#666',
                        fontSize: '0.9rem'
                      }}
                    >
                      {review.rating.toFixed(1)}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontSize: '0.9rem',
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {review.content}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block',
                      color: '#666',
                      fontSize: '0.85rem'
                    }}
                  >
                    작성일: {formatDate(review.createdAt)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
}

export default MyReviews;
