import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { memberId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reviews');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followCounts, setFollowCounts] = useState({ followerCount: 0, followingCount: 0 });

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
    <Container className="mt-4">
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4} className="text-center">
              <div 
                className="profile-image-placeholder" 
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  margin: '0 auto'
                }}
              >
                {profile.displayName?.charAt(0)?.toUpperCase()}
              </div>
            </Col>
            <Col md={8}>
              <h2>{profile.displayName}</h2>
              <p className="text-muted">가입일: {formatDate(profile.createdAt)}</p>
              <div className="d-flex align-items-center mb-3">
                <span className="me-3">팔로워 {followCounts.followerCount}</span>
                <span className="me-3">팔로잉 {followCounts.followingCount}</span>
                {user && user.memberId !== parseInt(memberId) && (
                  <button
                    className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={handleFollow}
                  >
                    {isFollowing ? '언팔로우' : '팔로우'}
                  </button>
                )}
              </div>
              {profile.bio && <p>{profile.bio}</p>}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="reviews" title="작성한 리뷰">
          <Row>
            {reviews.length === 0 ? (
              <Col>
                <p>작성한 리뷰가 없습니다.</p>
              </Col>
            ) : (
              reviews.map((review) => (
                <Col md={4} key={review.id} className="mb-4">
                  <Card>
                    {review.imageUrl && (
                      <Card.Img
                        variant="top"
                        src={`http://localhost:8989/api/reviews/images/${review.imageUrl}`}
                        alt="리뷰 이미지"
                      />
                    )}
                    <Card.Body>
                      <Card.Title>
                        <Link to={`/reviews/${review.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {review.title}
                        </Link>
                      </Card.Title>
                      <Card.Text>
                        <span className="rating">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
                        <br />
                        <small className="text-muted">
                          작성일: {formatDate(review.createdAt)}
                        </small>
                        <br />
                        <small className="text-muted">
                          조회수: {review.viewCount?.toLocaleString() || 0}
                        </small>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Tab>
        <Tab eventKey="comments" title="작성한 댓글">
          <Row>
            {comments.length === 0 ? (
              <Col>
                <p>작성한 댓글이 없습니다.</p>
              </Col>
            ) : (
              comments.map((comment) => (
                <Col md={12} key={comment.id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Text>
                        <Link to={`/reviews/${comment.reviewId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {comment.content}
                        </Link>
                        <br />
                        <small className="text-muted">
                          작성일: {formatDate(comment.createdAt)}
                        </small>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserProfile;
