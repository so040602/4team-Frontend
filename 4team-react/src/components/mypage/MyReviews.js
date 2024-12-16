import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea, Rating, CardMedia } from '@mui/material';
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
            <Card>
              <CardActionArea component={Link} to={`/reviews/${review.id}`}>
                {review.imageUrl && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={`http://localhost:8989/api/reviews/images/${review.imageUrl}`}
                    alt={review.title}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {review.title}
                  </Typography>
                  <Rating value={review.rating} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {review.content.substring(0, 100)}
                    {review.content.length > 100 && '...'}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    작성일: {new Date(review.createdAt).toLocaleDateString()}
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
