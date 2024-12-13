import React, { useState } from 'react';
import { Container, Tabs, Tab, Box } from '@mui/material';
import ProfileSection from '../components/mypage/ProfileSection';
import MyRecipes from '../components/mypage/MyRecipes';
import MyReviews from '../components/mypage/MyReviews';
import RecentViews from '../components/mypage/RecentViews';
import MyComments from '../components/mypage/MyComments';
import MyMenus from '../components/mypage/MyMenus';
import FollowSection from '../components/mypage/FollowSection';

function MyPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ProfileSection />
      
      <Box sx={{ width: '100%', mt: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="mypage tabs"
        >
          <Tab label="내 레시피" />
          <Tab label="내 리뷰" />
          <Tab label="최근 본 컨텐츠" />
          <Tab label="내 댓글" />
          <Tab label="내 메뉴" />
          <Tab label="팔로우/팔로잉" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tabValue === 0 && <MyRecipes />}
          {tabValue === 1 && <MyReviews />}
          {tabValue === 2 && <RecentViews />}
          {tabValue === 3 && <MyComments />}
          {tabValue === 4 && <MyMenus />}
          {tabValue === 5 && <FollowSection />}
        </Box>
      </Box>
    </Container>
  );
}

export default MyPage;
