import React, { useState, useEffect } from 'react';
import { Box, Paper, Avatar, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import FollowButton from '../common/FollowButton';
import GradeInfoModal from '../common/GradeInfoModal';
import GradeBadge from '../common/GradeBadge';
import '../../styles/ProfileSection.css';

function ProfileSection({ userId }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [profileUser, setProfileUser] = useState(null);
  const [showGradeInfo, setShowGradeInfo] = useState(false);
  const [userGrade, setUserGrade] = useState(null);
  const [stats, setStats] = useState({
    recipeCount: 0,
    reviewCount: 0,
    followerCount: 0,
    followingCount: 0
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId) {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:8989/api/members/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProfileUser(response.data.data);
          setDisplayName(response.data.data.displayName);
          
          // 레시피 수 가져오기
          const recipeCountResponse = await axios.get(`http://localhost:8989/recipe_form/member/${userId}/count`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // 통계 정보 업데이트
          setStats(prevStats => ({
            ...prevStats,
            recipeCount: recipeCountResponse.data
          }));
          
          // 등급 정보도 함께 가져오기
          const gradeResponse = await axios.get(`http://localhost:8989/api/members/${userId}/grade`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserGrade(gradeResponse.data);
        } else {
          setProfileUser(user);
          setDisplayName(user?.displayName || '');
          
          // 레시피 수 가져오기
          const token = localStorage.getItem('token');
          const recipeCountResponse = await axios.get(`http://localhost:8989/recipe_form/member/${user.memberId}/count`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // 통계 정보 업데이트
          setStats(prevStats => ({
            ...prevStats,
            recipeCount: recipeCountResponse.data
          }));
          
          // 현재 로그인한 사용자의 등급 정보 가져오기
          const gradeResponse = await axios.get(`http://localhost:8989/api/members/${user.memberId}/grade`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserGrade(gradeResponse.data);
        }
      } catch (error) {
        console.error('사용자 정보를 불러오는데 실패했습니다:', error);
      }
    };

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const targetId = userId || user?.memberId;

        // 리뷰 목록 가져오기
        const reviewsResponse = await axios.get(
          `http://localhost:8989/api/reviews/my`,
          { headers }
        );

        // 팔로우 수 가져오기
        const followCountResponse = await axios.get(
          `http://localhost:8989/api/follow/count/${targetId}`,
          { headers }
        );

        setStats(prevStats => ({
          recipeCount: prevStats.recipeCount,
          reviewCount: reviewsResponse.data.length,
          followerCount: followCountResponse.data.data.followerCount,
          followingCount: followCountResponse.data.data.followingCount
        }));
      } catch (error) {
        console.error('프로필 통계를 불러오는데 실패했습니다:', error);
      }
    };

    if (user) {
      fetchUser();
      fetchStats();
    }
  }, [user, userId]);

  const handleEditClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const targetId = userId || user?.memberId;
      const response = await axios.put(
        `http://localhost:8989/api/members/${targetId}/displayName`,
        { displayName },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setProfileUser(prev => ({
        ...prev,
        displayName: displayName
      }));
      
      setOpen(false);
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        console.error('프로필 수정 실패:', error);
        alert('프로필 수정에 실패했습니다.');
      }
    }
  };

  if (!profileUser) {
    return null;
  }

  const avatarLetter = profileUser.displayName ? profileUser.displayName[0].toUpperCase() : 'U';
  const isOwnProfile = !userId || userId === user?.memberId.toString();

  return (
    <Paper sx={{ p: '12px 24px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
      <Box display="flex" alignItems="flex-start" gap={3} className="profile-section">
        <Avatar 
          sx={{ 
            width: { xs: 70, md: 90 }, 
            height: { xs: 70, md: 90 }, 
            bgcolor: '#ff6b6b',
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          {avatarLetter}
        </Avatar>
        <Box flex={1}>
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontSize: { xs: '1.4rem', md: '1.8rem' },
                  fontWeight: 700,
                  color: '#333'
                }}
              >
                {profileUser.displayName}
              </Typography>
              <GradeBadge grade={userGrade} />
              {isOwnProfile && (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setShowGradeInfo(true)}
                  sx={{
                    color: '#666',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    border: '1px solid #ddd',
                    borderRadius: '15px',
                    padding: '3px 10px',
                    minWidth: 'auto',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#ff6b6b',
                      backgroundColor: 'rgba(255, 107, 107, 0.05)',
                      borderColor: '#ff6b6b',
                      transform: 'translateY(-2px)'
                    },
                  }}
                >
                  등급 안내
                </Button>
              )}
              {isOwnProfile ? (
                <Button 
                  startIcon={<EditIcon sx={{ fontSize: '1.1rem' }} />}
                  onClick={handleEditClick}
                  sx={{
                    ml: 1,
                    color: '#666',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    border: '1px solid #ddd',
                    borderRadius: '15px',
                    padding: '3px 12px',
                    minWidth: 'auto',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#ff6b6b',
                      backgroundColor: 'rgba(255, 107, 107, 0.05)',
                      borderColor: '#ff6b6b',
                      transform: 'translateY(-2px)'
                    },
                  }}
                >
                  프로필 수정
                </Button>
              ) : (
                <FollowButton memberId={parseInt(userId)} />
              )}
            </Box>
            {isOwnProfile && (
              <Typography 
                color="text.secondary" 
                sx={{ 
                  fontSize: '0.9rem', 
                  mb: 1
                }}
              >
                {profileUser.primaryEmail}
              </Typography>
            )}
            <Box display="flex" gap={2} flexWrap="wrap">
              <Typography sx={{ fontSize: '0.95rem', color: '#444' }}>
                <strong style={{ color: '#ff6b6b' }}>{stats.recipeCount}</strong> 레시피
              </Typography>
              <Typography sx={{ fontSize: '0.95rem', color: '#444' }}>
                <strong style={{ color: '#ff6b6b' }}>{stats.reviewCount}</strong> 리뷰
              </Typography>
              <Typography sx={{ fontSize: '0.95rem', color: '#444' }}>
                <strong style={{ color: '#ff6b6b' }}>{stats.followerCount}</strong> 팔로워
              </Typography>
              <Typography sx={{ fontSize: '0.95rem', color: '#444' }}>
                <strong style={{ color: '#ff6b6b' }}>{stats.followingCount}</strong> 팔로잉
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '400px',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #eee',
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#333',
          pb: 2
        }}>
          프로필 수정
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="이름"
            type="text"
            fullWidth
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '&:hover fieldset': {
                  borderColor: '#ff6b6b',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b6b',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#ff6b6b',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ 
          padding: '16px 24px',
          borderTop: '1px solid #eee',
          gap: 1
        }}>
          <Button 
            onClick={handleClose}
            sx={{
              color: '#666',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            취소
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: '#ff6b6b',
              fontWeight: 500,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#ff5252',
              },
            }}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>

      <GradeInfoModal
        open={showGradeInfo}
        onClose={() => setShowGradeInfo(false)}
      />
    </Paper>
  );
}

export default ProfileSection;
