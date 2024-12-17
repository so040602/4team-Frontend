import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Tabs, Tab, Button } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

function FollowSection() {
  const [tabValue, setTabValue] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const memberId = user?.memberId;

        // 팔로워 목록 가져오기
        const followersResponse = await axios.get(
          `http://localhost:8989/api/follow/followers/${memberId}`,
          { headers }
        );
        
        // 팔로잉 목록 가져오기
        const followingResponse = await axios.get(
          `http://localhost:8989/api/follow/following/${memberId}`,
          { headers }
        );

        setFollowers(followersResponse.data.data || []);
        setFollowing(followingResponse.data.data || []);
      } catch (error) {
        console.error('팔로우 데이터를 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.memberId) {
      fetchFollowData();
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFollow = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8989/api/follow/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // 팔로우 목록 새로고침
      window.location.reload();
    } catch (error) {
      console.error('팔로우 실패:', error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:8989/api/follow/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // 팔로우 목록 새로고침
      window.location.reload();
    } catch (error) {
      console.error('언팔로우 실패:', error);
    }
  };

  if (loading) {
    return (
      <Typography variant="body1" color="text.secondary" align="center">
        로딩 중...
      </Typography>
    );
  }

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label={`팔로워 ${followers.length}`} />
        <Tab label={`팔로잉 ${following.length}`} />
      </Tabs>

      {tabValue === 0 ? (
        followers.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            팔로워가 없습니다.
          </Typography>
        ) : (
          <List>
            {followers.map((user) => (
              <ListItem
                key={user.memberId}
                secondaryAction={
                  user.memberId !== user?.memberId && (
                    <Button
                      variant={user.isFollowing ? "contained" : "outlined"}
                      onClick={() => user.isFollowing ? handleUnfollow(user.memberId) : handleFollow(user.memberId)}
                    >
                      {user.isFollowing ? '팔로잉' : '팔로우'}
                    </Button>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar>{user.displayName[0].toUpperCase()}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.displayName}
                />
              </ListItem>
            ))}
          </List>
        )
      ) : (
        following.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            팔로잉하는 사용자가 없습니다.
          </Typography>
        ) : (
          <List>
            {following.map((user) => (
              <ListItem
                key={user.memberId}
                secondaryAction={
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleUnfollow(user.memberId)}
                  >
                    언팔로우
                  </Button>
                }
              >
                <ListItemAvatar>
                  <Avatar>{user.displayName[0].toUpperCase()}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.displayName}
                />
              </ListItem>
            ))}
          </List>
        )
      )}
    </Box>
  );
}

export default FollowSection;
