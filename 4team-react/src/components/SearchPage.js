import React, { useState } from 'react';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', margin: '100px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <input
          type="text"
          value={query}
          onChange={handleSearchInputChange}
          onKeyPress={handleKeyPress}
          placeholder="검색어를 입력하세요"
          style={{
            padding: '12px',
            width: '400px',
            fontSize: '16px',
            border: '2px solid #03c75a',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        />
        <button
          onClick={handleSearchButtonClick}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            backgroundColor: '#03c75a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          검색
        </button>
      </div>

      {loading && <p>검색 중...</p>}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        padding: '20px 0'
      }}>
        {results.map((item) => {
          const title = item.title.replace(/<[^>]*>/g, '');
          const categories = [item.category1, item.category2, item.category3, item.category4]
            .filter(Boolean)
            .join(' > ');

          return (
            <div
              key={item.productId}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}
            >
              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <img
                  src={item.image}
                  alt={title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginBottom: '10px'
                  }}
                />
                <h3 style={{
                  margin: '10px 0',
                  fontSize: '16px',
                  color: '#333',
                  height: '40px',
                  overflow: 'hidden'
                }}>
                  {title}
                </h3>
                <div className="price" style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#03c75a',
                  margin: '10px 0'
                }}>
                  {formatPrice(item.lprice)}
                </div>
                <div className="mall-name" style={{ color: '#666', fontSize: '14px' }}>
                  {item.mallName}
                </div>
                <div className="category" style={{ color: '#888', fontSize: '12px', marginTop: '5px' }}>
                  {categories}
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchPage;
