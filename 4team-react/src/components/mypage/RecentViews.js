import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea, Rating, CardMedia, Tabs, Tab, Box } from '@mui/material';
import axios from 'axios';

function RecentViews() {
  const [tabValue, setTabValue] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [recipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentViews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8989/api/reviews/recent', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReviews(response.data);
      } catch (error) {
        console.error('최근 본 리뷰 목록을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentViews();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  if (loading) {
    return (
      <Typography variant="body1" color="text.secondary" align="center">
        로딩 중...
      </Typography>
    );
  }

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="최근 본 레시피" />
        <Tab label="최근 본 리뷰" />
      </Tabs>

      <Grid container spacing={3}>
        {tabValue === 0 ? (
          recipes.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                최근 본 레시피가 없습니다.
              </Typography>
            </Grid>
          ) : (
            recipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                <Card>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h6">
                        {recipe.title}
                      </Typography>
                      <Typography variant="caption" display="block">
                        조회일: {new Date(recipe.viewedAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          )
        ) : (
          reviews.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                최근 본 리뷰가 없습니다.
              </Typography>
            </Grid>
          ) : (
            reviews.map((review) => (
              <Grid item xs={12} sm={6} md={4} key={review.id}>
                <Card>
                  <CardActionArea>
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
                        작성일: {formatDate(review.createdAt)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          )
        )}
      </Grid>
    </Box>
  );
}

export default RecentViews;