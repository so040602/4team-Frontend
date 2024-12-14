import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';

function MyRecipes() {
  // TODO: API로 내 레시피 목록 가져오기
  const recipes = [];

  return (
    <Grid container spacing={3}>
      {recipes.length === 0 ? (
        <Grid item xs={12}>
          <Typography variant="body1" color="text.secondary" align="center">
            작성한 레시피가 없습니다.
          </Typography>
        </Grid>
      ) : (
        recipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={recipe.image}
                  alt={recipe.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {recipe.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    작성일: {new Date(recipe.createdAt).toLocaleDateString()}
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

export default MyRecipes;
