import React, { useState, useEffect } from 'react';
import { Box, Paper, Avatar, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import FollowButton from '../common/FollowButton';

function ProfileSection({ userId }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [profileUser, setProfileUser] = useState(null);
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
        } else {
          setProfileUser(user);
          setDisplayName(user?.displayName || '');
        }
      } catch (error) {
        console.error('사용자 정보를 불러오는데 실패했습니다:', error);
      }
    };

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const targetId = userId || user?.memberId;
        const [reviewsResponse, followCountResponse] = await Promise.all([
          axios.get(`http://localhost:8989/api/reviews/member/${targetId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8989/api/follow/count/${targetId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setStats({
          recipeCount: 0,  // 레시피 기능 구현 시 추가
          reviewCount: reviewsResponse.data.length,
          followerCount: followCountResponse.data.data.followerCount,
          followingCount: followCountResponse.data.data.followingCount
        });
      } catch (error) {
        console.error('프로필 통계를 불러오는데 실패했습니다:', error);
      }
    };

    if (user) {
      fetchUser();
      fetchStats();
    }
  }, [userId, user]);

  const handleEditClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/members/profile', 
        { displayName },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setOpen(false);
      // 프로필 업데이트 후 새로고침
      window.location.reload();
    } catch (error) {
      console.error('프로필 수정 실패:', error);
    }
  };

  if (!profileUser) {
    return null;
  }

  const avatarLetter = profileUser.displayName ? profileUser.displayName[0].toUpperCase() : 'U';
  const isOwnProfile = !userId || userId === user?.memberId.toString();

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={3}>
        <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}>
          {avatarLetter}
        </Avatar>
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h5">{profileUser.displayName}</Typography>
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
    </Paper>
  );
}

export default ProfileSection;
