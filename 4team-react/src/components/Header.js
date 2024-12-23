import React, { useEffect, useState } from 'react';
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from 'axios';
import "./Navbar.css";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    if(e.key === 'Enter' && searchQuery.trim() !== ''){
         navigate(`/searchrecipe?searchQuery=${searchQuery}`);       
    }
 };

 const handleImageChange = (e) => {
  const file = e.target.files[0]; // 파일을 선택하여 첫 번째 파일만 가져옵니다.
  if (file){
      setSelectedImage(file);
  }
};

const handleImageSearch = () => {
  document.getElementById('file-input').click();
};

useEffect(() => {
  if (selectedImage) {
      handleImageSubmit(); // selectedImage가 업데이트되면 자동 실행
  }
}, [selectedImage]); // selectedImage 값이 변경될 때마다 실행

const handleImageSubmit = async () => {
  const formData = new FormData();
  formData.append('image', selectedImage);

  try {
      console.log(1);
      const response = await axios.post('http://192.168.0.28:5000/predict', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      console.log(response.data.prediction);

      setSearchQuery(response.data.prediction);
  } catch (error) {
      setError(error);
  }
};

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="header">
        <div className="header-content">
            <h1 className="header-title" onClick={() => navigate("/")}>레시피</h1>
            <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input 
                    type="text" 
                    className="search-input" 
                    placeholder="레시피나 재료를 검색해보세요"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e)=>{handleSearch(e);}}
                />
                <div>
                    <button className='search-icon'
                    onClick={handleImageSearch}>🎨</button>
                    <input
                        type='file'
                        id='file-input'
                        accept='image/*'
                        onChange={handleImageChange}
                        style={{display:'none'}}
                    >
                    </input>  
                </div> 
            </div>
            <div className="navbar-menu">
            {user && <span className="user-name">{user.displayName}님</span>}
            <Link to="/mypage" className="profile-btn">👤</Link>
        {user ? (
          <div className="navbar-user">
            <button className="logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={handleLogin}>
            로그인
          </button>
        )}
      </div>
        </div>
    </header>
  );
};

export default Header;
