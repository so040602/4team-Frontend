import React from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea, Rating } from '@mui/material';

function MyReviews() {
  // TODO: API로 내 리뷰 목록 가져오기
  const reviews = [];

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
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {review.title}
                  </Typography>
                  <Rating value={review.rating} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {review.content.substring(0, 100)}...
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
