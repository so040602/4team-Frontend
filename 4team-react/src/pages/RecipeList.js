import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea, CardMedia, Container, TextField, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import './RecipeList.css';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8989/recipe_form/list', {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {}
        });
        setRecipes(response.data);
        setSearchResults(response.data);
      } catch (error) {
        console.error('레시피 목록을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults(recipes);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8989/recipe/searchrecipe/${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('레시피 검색 중 오류 발생:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if (!event.target.value.trim()) {
      setSearchResults(recipes);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Typography>로딩 중...</Typography>
      </div>
    );
  }

  return (
    <Container className="recipe-list-container">
      <div className="search-container">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="레시피 검색..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>

      <Grid container spacing={3} className="recipes-grid">
        {searchResults.length > 0 ? (
          searchResults.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.recipeId}>
              <Card className="recipe-card">
                <CardActionArea href={`/recipe/${recipe.recipeId}`}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={recipe.recipeThumbnail ? `http://localhost:8989${recipe.recipeThumbnail}` : '/default-recipe.jpg'}
                    alt={recipe.recipeTitle}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" noWrap>
                      {recipe.recipeTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {recipe.recipeTip}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center" color="text.secondary">
              검색 결과가 없습니다.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default RecipeList;
