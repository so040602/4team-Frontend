import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  CardActionArea, 
  CardMedia, 
  Container, 
  TextField, 
  IconButton, 
  InputAdornment,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecipeList.css';
import { useAuth } from "../contexts/AuthContext";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const handleRecipeCreate = (e) => {
    e.preventDefault();
    if (!user) {
      if (
        window.confirm(
          "레시피를 작성하려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        navigate("/login");
      }
    } else {
      navigate("/recipe/create");
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if (!event.target.value.trim()) {
      setSearchResults(recipes);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
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
          onKeyPress={handleKeyPress}
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
      <div
          onClick={handleRecipeCreate}
          className="floating-button"
          aria-label="새 레시피 작성"
        >
          <span className="plus-icon">+</span>
          <span className="button-tooltip">레시피 작성</span>
        </div>

      <div className="recipes-grid">
        {searchResults.length > 0 ? (
          searchResults.map((recipe) => (
            <Card 
              key={recipe.recipeId} 
              className="recipe-card" 
              onClick={() => handleRecipeClick(recipe.recipeId)}
              style={{ cursor: 'pointer' }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={recipe.recipeThumbnail ? `http://localhost:8989${recipe.recipeThumbnail}` : '/default-recipe.jpg'}
                  alt={recipe.recipeTitle}
                />
                <CardContent>
                  <Typography variant="h6">
                    {recipe.recipeTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {recipe.recipeTip}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        ) : (
          <Typography variant="h6" align="center" color="text.secondary" sx={{ gridColumn: '1/-1', py: 4 }}>
            검색 결과가 없습니다.
          </Typography>
        )}
      </div>
    </Container>
  );
}

export default RecipeList;
