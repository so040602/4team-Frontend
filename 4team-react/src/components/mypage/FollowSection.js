import React, { useState } from 'react';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Tabs, Tab, Button } from '@mui/material';

function FollowSection() {
  const [tabValue, setTabValue] = useState(0);
  // TODO: API로 팔로워/팔로잉 목록 가져오기
  const followers = [];
  const following = [];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFollow = (userId) => {
    // TODO: 팔로우 API 호출
  };

  const handleUnfollow = (userId) => {
    // TODO: 언팔로우 API 호출
  };

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
                key={user.id}
                secondaryAction={
                  <Button
                    variant="outlined"
                    onClick={() => handleFollow(user.id)}
                  >
                    {user.isFollowing ? '팔로잉' : '팔로우'}
                  </Button>
                }
              >
                <ListItemAvatar>
                  <Avatar>{user.displayName[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.displayName}
                  secondary={`레시피 ${user.recipeCount} · 리뷰 ${user.reviewCount}`}
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
                key={user.id}
                secondaryAction={
                  <Button
                    variant="contained"
                    onClick={() => handleUnfollow(user.id)}
                  >
                    팔로잉
                  </Button>
                }
              >
                <ListItemAvatar>
                  <Avatar>{user.displayName[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.displayName}
                  secondary={`레시피 ${user.recipeCount} · 리뷰 ${user.reviewCount}`}
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
