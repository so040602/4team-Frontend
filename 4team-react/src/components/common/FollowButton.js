import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

function FollowButton({ memberId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/follows/check/${memberId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(response.data);
      } catch (error) {
        console.error('팔로우 상태 확인 실패:', error);
      }
    };

    if (user && memberId !== user.memberId) {
      checkFollowStatus();
    }
  }, [memberId, user]);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      if (isFollowing) {
        await axios.delete(`/api/follows/${memberId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`/api/follows/${memberId}`, null, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('팔로우 상태 변경 실패:', error);
    }
  };

  if (!user || memberId === user.memberId) {
    return null;
  }

  return (
    <Button
      variant={isFollowing ? "outlined" : "contained"}
      color="primary"
      onClick={handleFollow}
    >
      {isFollowing ? '언팔로우' : '팔로우'}
    </Button>
  );
}

export default FollowButton;