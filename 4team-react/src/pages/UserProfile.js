import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const ProfileContainer = styled(Container)`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ProfileWrapper = styled(Card)`
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: none;
  background: white;
  margin-bottom: 1rem;
  overflow: hidden;

  @media (max-width: 768px) {
    .card-body {
      padding: 1rem;
    }
  }
`;

const ProfileImage = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #ff6b6b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 1rem auto;
  box-shadow: 0 4px 8px rgba(255, 107, 107, 0.2);
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    font-size: 2rem;
    margin: 0.5rem auto;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const UserName = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin: 0.3rem 0;
  }
`;

const UserInfo = styled.div`
  margin: 1rem 0;
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
  
  .join-date {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
    }
  }
  
  .stats {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
      gap: 1rem;
      margin-bottom: 0.5rem;
      flex-wrap: wrap;
    }
    
    span {
      color: #444;
      font-size: 0.95rem;
      
      @media (max-width: 768px) {
        font-size: 0.85rem;
      }
      
      strong {
        color: #ff6b6b;
        font-weight: 600;
      }
    }
  }
`;

const FollowButton = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  border: none;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &.following {
    background-color: #e9ecef;
    color: #495057;
    
    &:hover {
      background-color: #dc3545;
      color: white;
    }
  }
  
  &.not-following {
    background-color: #ff6b6b;
    color: white;
    
    &:hover {
      background-color: #fa5252;
    }
  }
`;

const StyledTabs = styled(Tabs)`
  border-bottom: 2px solid #f1f3f5;
  margin-bottom: 1.5rem;
  
  .nav-link {
    color: #495057;
    border: none;
    padding: 1rem 1.5rem;
    font-weight: 500;
    position: relative;
    
    &:hover {
      color: #ff6b6b;
    }
    
    &.active {
      color: #ff6b6b;
      background: none;
      border: none;
      
      &:after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #ff6b6b;
      }
    }
  }
`;

const ContentCard = styled(Card)`
  border-radius: 12px;
  border: 1px solid #eee;
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .card-img-top {
    height: 200px;
    object-fit: cover;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  
  .card-body {
    padding: 1.25rem;
  }
  
  .card-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.75rem;
  }
  
  .rating {
    color: #ffd700;
    margin-right: 0.5rem;
  }
  
  .text-muted {
    color: #6c757d;
    font-size: 0.9rem;
  }
`;

const UserProfile = () => {
  const { memberId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reviews');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followCounts, setFollowCounts] = useState({ followerCount: 0, followingCount: 0 });
  const [isDesktop, setIsDesktop] = useState(window.matchMedia("(min-width: 769px)").matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 769px)");
    const handler = (e) => setIsDesktop(e.matches);
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
    }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // 사용자 정보 가져오기
        const profileResponse = await axios.get(
          `http://localhost:8989/api/members/${memberId}`,
          { headers }
        );
        setProfile(profileResponse.data.data);

        // 팔로우 상태 확인
        if (user && user.memberId !== parseInt(memberId)) {
          const followCheckResponse = await axios.get(
            `http://localhost:8989/api/follow/check/${memberId}`,
            { headers }
          );
          setIsFollowing(followCheckResponse.data.data);
        }

        // 팔로워/팔로잉 수 가져오기
        const followCountResponse = await axios.get(
          `http://localhost:8989/api/follow/count/${memberId}`,
          { headers }
        );
        setFollowCounts(followCountResponse.data.data);

        // 사용자의 리뷰 목록 가져오기
        const reviewsResponse = await axios.get(
          `http://localhost:8989/api/reviews/member/${memberId}`,
          { headers }
        );
        setReviews(reviewsResponse.data);

        // 사용자의 댓글 목록 가져오기
        const commentsResponse = await axios.get(
          `http://localhost:8989/api/reviews/comments/member/${memberId}`,
          { headers }
        );
        setComments(commentsResponse.data);

        // 사용자의 레시피 목록 가져오기
        const recipesResponse = await axios.get(
          `http://localhost:8989/recipe_form/member/${memberId}`,
          { headers }
        );
        setRecipes(recipesResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error);
        setLoading(false);
      }
    };

    if (memberId) {
      fetchData();
    }
  }, [memberId, user]);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      
      if (isFollowing) {
        const response = await axios.delete(`http://localhost:8989/api/follow/${memberId}`, { headers });
        if (response.data.success) {
          setIsFollowing(false);
        }
      } else {
        const response = await axios.post(`http://localhost:8989/api/follow/${memberId}`, null, { headers });
        if (response.data.success) {
          setIsFollowing(true);
        }
      }

      // 팔로워/팔로잉 수 업데이트
      const followCountResponse = await axios.get(
        `http://localhost:8989/api/follow/count/${memberId}`,
        { headers }
      );
      setFollowCounts(followCountResponse.data.data);
    } catch (error) {
      console.error('팔로우 처리 중 오류가 발생했습니다:', error);
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
      } else {
        alert(error.response?.data?.message || '팔로우 처리 중 오류가 발생했습니다.');
      }
    }
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return '-';
  
    // 날짜가 배열이 아니라면 Date 객체로 변환
    let date;
    if (Array.isArray(dateInput)) {
      const [year, month, day] = dateInput;
      date = new Date(year, month - 1, day); // Date 객체로 변환
    } else {
      date = new Date(dateInput); // 문자열 또는 다른 형식이 Date로 변환
    }
  
    // 날짜가 유효한지 확인
    if (isNaN(date.getTime())) return '-';
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}. ${month}. ${day}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>사용자를 찾을 수 없습니다.</div>;
  }

  return (
    <ProfileContainer>
      <ProfileWrapper style={{margin: isDesktop ? '100px auto 20px' : '80px auto 20px'}}>
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4} className="text-center">
              <ProfileImage>
                {profile.displayName?.charAt(0)?.toUpperCase()}
              </ProfileImage>
            </Col>
            <Col md={8}>
              <UserInfo>
                <div className="d-flex align-items-center">
                  <UserName>{profile.displayName}</UserName>
                  {user && user.memberId !== parseInt(memberId) && (
                    <FollowButton
                      className={isFollowing ? 'following' : 'not-following'}
                      onClick={handleFollow}
                      style={{ marginLeft: '1rem' }}
                    >
                      {isFollowing ? '언팔로우' : '팔로우'}
                    </FollowButton>
                  )}
                </div>
                <div className="join-date">가입일: {formatDate(profile.createdAt)}</div>
                <div className="stats">
                  <span><strong>{followCounts.followerCount}</strong> 팔로워</span>
                  <span><strong>{followCounts.followingCount}</strong> 팔로잉</span>
                </div>
                {profile.bio && <p className="bio">{profile.bio}</p>}
              </UserInfo>
            </Col>
          </Row>
        </Card.Body>
      </ProfileWrapper>

      <StyledTabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="recipes" title="레시피">
          <Row>
            {recipes.length === 0 ? (
              <Col>
                <p className="text-center text-muted my-4">작성한 레시피가 없습니다.</p>
              </Col>
            ) : (
              recipes.map((recipe) => (
                <Col md={4} key={recipe.recipeId} className="mb-4">
                  <ContentCard>
                    <Link to={`/recipe/${recipe.recipeId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Card.Img
                        variant="top"
                        src={recipe.recipeThumbnail || '/default-recipe-image.jpg'}
                        alt={recipe.recipeTitle}
                      />
                      <Card.Body>
                        <Card.Title>{recipe.recipeTitle}</Card.Title>
                        <Card.Text>
                          <small className="text-muted">
                            작성일: {formatDate(recipe.createdAt)}
                          </small>
                        </Card.Text>
                      </Card.Body>
                    </Link>
                  </ContentCard>
                </Col>
              ))
            )}
          </Row>
        </Tab>
        <Tab eventKey="reviews" title="리뷰">
          <Row>
            {reviews.length === 0 ? (
              <Col>
                <p className="text-center text-muted my-4">작성한 리뷰가 없습니다.</p>
              </Col>
            ) : (
              reviews.map((review) => (
                <Col md={4} key={review.id} className="mb-4">
                  <ContentCard>
                    <Link to={`/reviews/${review.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {review.imageUrl && (
                        <Card.Img
                          variant="top"
                          src={`http://localhost:8989/api/reviews/images/${review.imageUrl}`}
                          alt="리뷰 이미지"
                        />
                      )}
                      <Card.Body>
                        <Card.Title>{review.title}</Card.Title>
                        <Card.Text>
                          <span className="rating">{'★'.repeat(review.rating)}</span>
                          <small className="text-muted d-block">
                            작성일: {formatDate(review.createdAt)}
                          </small>
                          <small className="text-muted d-block">
                            조회수: {review.viewCount?.toLocaleString() || 0}
                          </small>
                        </Card.Text>
                      </Card.Body>
                    </Link>
                  </ContentCard>
                </Col>
              ))
            )}
          </Row>
        </Tab>
        <Tab eventKey="comments" title="댓글">
          <Row>
            {comments.length === 0 ? (
              <Col>
                <p className="text-center text-muted my-4">작성한 댓글이 없습니다.</p>
              </Col>
            ) : (
              comments.map((comment) => (
                <Col md={12} key={comment.id} className="mb-3">
                  <ContentCard>
                    <Link to={`/reviews/${comment.reviewId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Card.Body>
                        <Card.Text>
                          {comment.content}
                          <small className="text-muted d-block mt-2">
                            작성일: {formatDate(comment.createdAt)}
                          </small>
                        </Card.Text>
                      </Card.Body>
                    </Link>
                  </ContentCard>
                </Col>
              ))
            )}
          </Row>
        </Tab>
      </StyledTabs>
    </ProfileContainer>
  );
};

export default UserProfile;
