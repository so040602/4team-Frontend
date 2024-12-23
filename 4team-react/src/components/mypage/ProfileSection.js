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
          console.log('Grade response:', gradeResponse.data);
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
          console.log('Grade response:', gradeResponse.data);
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
      
      // 상태 업데이트
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
    <Paper sx={{ p: '20px 24px' }}>
      <Box display="flex" alignItems="center" gap={3} className="profile-section">
        <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}>
          {avatarLetter}
        </Avatar>
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h5">{profileUser.displayName}</Typography>
            <GradeBadge grade={userGrade} />
            {isOwnProfile && (
              <Button
                variant="text"
                size="small"
                onClick={() => setShowGradeInfo(true)}
              >
                등급 안내
              </Button>
            )}
            {isOwnProfile ? (
              <Button startIcon={<EditIcon />} onClick={handleEditClick}>
                프로필 수정
              </Button>
            ) : (
              <FollowButton memberId={parseInt(userId)} />
            )}
          </Box>
          {isOwnProfile && (
            <Typography color="text.secondary">{profileUser.primaryEmail}</Typography>
          )}
          <Box display="flex" gap={2} mt={2}>
            <Typography>레시피 {stats.recipeCount}</Typography>
            <Typography>리뷰 {stats.reviewCount}</Typography>
            <Typography>팔로워 {stats.followerCount}</Typography>
            <Typography>팔로잉 {stats.followingCount}</Typography>
          </Box>
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>프로필 수정</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="이름"
            type="text"
            fullWidth
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSave}>저장</Button>
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
