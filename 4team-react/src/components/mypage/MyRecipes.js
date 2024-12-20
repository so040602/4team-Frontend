import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          console.error('사용자 정보를 찾을 수 없습니다.');
          return;
        }

        const user = JSON.parse(userStr);
        const memberId = user.memberId;
        if (!memberId) {
          console.error('사용자 ID를 찾을 수 없습니다.');
          return;
        }

        const response = await axios.get(`http://localhost:8989/recipe_form/member/${memberId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('내 레시피 목록:', response.data);
        setRecipes(response.data);
      } catch (error) {
        console.error('레시피 목록을 불러오는데 실패했습니다:', error);
        if (error.response) {
          console.error('에러 응답:', error.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  if (loading) {
    return (
      <Typography variant="body1" color="text.secondary" align="center">
        로딩 중...
      </Typography>
    );
  }

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
          <Grid item xs={12} sm={6} md={4} key={recipe.recipeId}>
            <Card>
              <CardActionArea component={Link} to={`/recipe/${recipe.recipeId}`}>
                <CardMedia
                  component="img"
                  height="140"
                  image={recipe.recipeThumbnail || '/default-recipe-image.jpg'}
                  alt={recipe.recipeTitle}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {recipe.recipeTitle}
                  </Typography>
                  {recipe.createdAt && (
                    <Typography variant="body2" color="text.secondary">
                      작성일: {new Date(recipe.createdAt).toLocaleDateString()}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {recipe.registrationState === 'TEMP' ? '임시저장' : '게시됨'}
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
