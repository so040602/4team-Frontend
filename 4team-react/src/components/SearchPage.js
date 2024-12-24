import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 20px;
  font-family: 'Arial, sans-serif';
  margin: ${props => props.$isDesktop ? '180px auto' : '100px auto'};
  max-width: 1200px;
`;

const SearchContainer = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  padding: 12px 20px;
  width: 390px;
  font-size: 16px;
  border: 2px solid #ff6b6b;
  border-radius: 10px;
  margin-right: 10px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255,107,107,0.1);
  }
`;

const SearchButton = styled.button`
  padding: 12px 30px;
  font-size: 16px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #ff5252;
    transform: translateY(-2px);
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;
`;

const ProductCard = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #eee;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const ProductTitle = styled.h3`
  margin: 10px 0;
  font-size: 16px;
  color: #333;
  height: 40px;
  overflow: hidden;
  font-weight: 600;
`;

const ProductPrice = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #ff6b6b;
  margin: 10px 0;
`;

const MallName = styled.div`
  color: #666;
  font-size: 14px;
`;

const Category = styled.div`
  color: #888;
  font-size: 12px;
  margin-top: 5px;
`;

const LoadingText = styled.p`
  text-align: center;
  color: #666;
  font-size: 16px;
  margin: 20px 0;
`;

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.matchMedia("(min-width: 769px)").matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 769px)");
    const handler = (e) => setIsDesktop(e.matches);
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const performSearch = () => {
    if (!query) return;

    setLoading(true);

    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        setResults(data.items);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
        alert('검색 중 오류가 발생했습니다.');
      });
  };

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchButtonClick = () => {
    performSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  return (
    <PageContainer $isDesktop={isDesktop}>
      <SearchContainer>
        <SearchInput
          type="text"
          value={query}
          onChange={handleSearchInputChange}
          onKeyPress={handleKeyPress}
          placeholder="검색어를 입력하세요"
        />
        <SearchButton onClick={handleSearchButtonClick}>
          검색
        </SearchButton>
      </SearchContainer>

      {loading && <LoadingText>검색 중...</LoadingText>}

      <ResultsGrid>
        {results.map((item) => {
          const title = item.title.replace(/<[^>]*>/g, '');
          const categories = [item.category1, item.category2, item.category3, item.category4]
            .filter(Boolean)
            .join(' > ');

          return (
            <ProductCard key={item.productId}>
              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <ProductImage src={item.image} alt={title} />
                <ProductTitle>{title}</ProductTitle>
                <ProductPrice>{formatPrice(item.lprice)}</ProductPrice>
                <MallName>{item.mallName}</MallName>
                <Category>{categories}</Category>
              </a>
            </ProductCard>
          );
        })}
      </ResultsGrid>
    </PageContainer>
  );
};

export default SearchPage;
