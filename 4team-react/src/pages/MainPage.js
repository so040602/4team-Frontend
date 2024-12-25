import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/MainPage.css";
import axios from "axios";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import MainPageList from "./MainPageList";

const MainPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/searchrecipe?searchQuery=${searchQuery}`);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 파일을 선택하여 첫 번째 파일만 가져옵니다.
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageSearch = () => {
    document.getElementById("file-input").click();
  };

  useEffect(() => {
    if (selectedImage) {
      handleImageSubmit(); // selectedImage가 업데이트되면 자동 실행
    }
  }, [selectedImage]); // selectedImage 값이 변경될 때마다 실행

  const handleImageSubmit = async () => {
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      console.log(1);
      const response = await axios.post(
        "http://192.168.0.28:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      console.log(response.data.prediction);

      setSearchQuery(response.data.prediction);
    } catch (error) {
      setError(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get("http://localhost:8989/api/reviews", {
        headers
      });
      setReviews(response.data);
    } catch (error) {
      console.error("리뷰 목록을 불러오는데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const formatDate = (dateInput) => {
    if (!dateInput) return "-";

    // 날짜가 배열이 아니라면 Date 객체로 변환
    let date;
    if (Array.isArray(dateInput)) {
      const [year, month, day] = dateInput;
      date = new Date(year, month - 1, day); // Date 객체로 변환
    } else {
      date = new Date(dateInput); // 문자열 또는 다른 형식이 Date로 변환
    }

    // 날짜가 유효한지 확인
    if (isNaN(date.getTime())) return "-";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}. ${month}. ${day}`;
  };

  return (
    <div className="main-page">
      <div className="main-page-content">
        <Header />

        {/* 상단 네비게이션 */}
        <nav className="top-nav">
          <div className="nav-content">
            <Link to="/" className="nav-item active">
              홈
            </Link>
            <Link to="/recipe" className="nav-item">
              레시피
            </Link>
            <Link to="/refriUI" className="nav-item">
              냉장고 파먹기
            </Link>
            <Link to="/reviews" className="nav-item">
              리뷰
            </Link>
            <Link to="/chatbot/Chatbot" className="nav-item">
              챗봇
            </Link>
          </div>
        </nav>

        <main className="main-content">
          {/* 히어로 섹션 */}
          <section className="hero-section">
            <div className="content-container">
              <div className="banner-slider">
                <div className="banner-slide">
                  <div className="banner-content">
                    <h2>특별한 연말 레시피</h2>
                    <p>사랑하는 사람들과 함께 나누는 따뜻한 요리</p>
                    <button className="banner-button">자세히 보기</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 메뉴 아이콘 섹션 */}
          <section className="menu-icons-section">
            <div className="content-container">
              <div className="menu-icons-grid">
                <Link to="/refriUI" className="menu-icon-item">
                  <div className="icon-wrapper yellow">
                    <img src="/icons/fridge.svg" alt="냉장고 파먹기" />
                  </div>
                  <span>냉장고 파먹기</span>
                </Link>
                <Link to="/MenuList" className="menu-icon-item">
                  <div className="icon-wrapper pink">
                    <img src="/icons/book.svg" alt="오늘 뭐먹지?" />
                  </div>
                  <span>오늘 뭐먹지?</span>
                </Link>
                <Link to="/LinkList" className="menu-icon-item">
                  <div className="icon-wrapper red">
                    <img src="/icons/star.svg" alt="레시피 북" />
                  </div>
                  <span>맛이슈</span>
                </Link>
                <Link to="/Searchpage" className="menu-icon-item">
                  <div className="icon-wrapper green">
                    <span className="badge sale">SALE</span>
                    <img src="/icons/sale.svg" alt="할인/특가" />
                  </div>
                  <span>식자재</span>
                </Link>
              </div>
            </div>
          </section>
          <MainPageList />

          {/* 최신 리뷰 섹션 */}
          <div className="review-section-wrapper">
            <div className="mainpagelist-theme-section">
              <div className="mainpagelist-theme-header">
                <div className="mainpagelist-theme-title-container">
                  <h2>최신 리뷰</h2>
                  <p className="mainpagelist-theme-desc">다른 사용자들의 최신 요리 후기를 확인해보세요</p>
                </div>
                <Link to="/reviews" className="mainpagelist-view-all-btn">
                  전체보기
                </Link>
              </div>
              <div className="recipe-cards-container">
                {reviews.map((review) => (
                  <div key={review.id} className="recipe-card">
                    <Link to={`/reviews/${review.id}`}>
                      {review.imageUrl ? (
                        <div className="recipe-card-image-container">
                          <img
                            src={`http://localhost:8989/api/reviews/images/${review.imageUrl}`}
                            alt="리뷰 이미지"
                            className="recipe-card-image"
                          />
                        </div>
                      ) : (
                        <div
                          className="recipe-card-image-container"
                          style={{ backgroundColor: "#f0f0f0" }}
                        />
                      )}
                      <div className="recipe-card-content">
                        <h3 className="recipe-card-title">{review.title}</h3>
                        <div className="recipe-card-footer">
                          <span className="recipe-card-author">{review.memberDisplayName}</span>
                          <span className="recipe-card-date">작성일: {formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* 플로팅 버튼 */}
        <div
          onClick={handleRecipeCreate}
          className="floating-button"
          aria-label="새 레시피 작성"
        >
          <span className="plus-icon">+</span>
          <span className="button-tooltip">레시피 작성</span>
        </div>

        {/* 모바일 하단 네비게이션 */}
        <nav className="bottom-nav">
          <Link to="/" className="nav-item active">
            <div className="nav-icon">🏠</div>
            <span>홈</span>
          </Link>
          <Link to="/recipe" className="nav-item">
            <div className="nav-icon">📖</div>
            <span>레시피</span>
          </Link>
          <Link to="/refriUI" className="nav-item">
            <div className="nav-icon">🗄️</div>
            <span>냉장고</span>
          </Link>
          <Link to="/reviews" className="nav-item">
            <div className="nav-icon">⭐</div>
            <span>리뷰</span>
          </Link>
          <Link to="/chatbot/Chatbot" className="nav-item">
            <div className="nav-icon">💬</div>
            <span>챗봇</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default MainPage;
