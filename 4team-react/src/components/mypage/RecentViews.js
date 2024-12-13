import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea, Tabs, Tab, Box } from '@mui/material';

function RecentViews() {
  const [tabValue, setTabValue] = useState(0);
  // TODO: API로 최근 본 컨텐츠 가져오기
  const recentRecipes = [];
  const recentReviews = [];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="최근 본 레시피" />
        <Tab label="최근 본 리뷰" />
      </Tabs>

      <Grid container spacing={3}>
        {tabValue === 0 ? (
          recentRecipes.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                최근 본 레시피가 없습니다.
              </Typography>
            </Grid>
          ) : (
            recentRecipes.map((recipe) => (
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
          recentReviews.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                최근 본 리뷰가 없습니다.
              </Typography>
            </Grid>
          ) : (
            recentReviews.map((review) => (
              <Grid item xs={12} sm={6} md={4} key={review.id}>
                <Card>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h6">
                        {review.title}
                      </Typography>
                      <Typography variant="caption" display="block">
                        조회일: {new Date(review.viewedAt).toLocaleDateString()}
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
