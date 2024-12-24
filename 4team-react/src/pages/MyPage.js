import React, { useState } from 'react';
import { Container, Tabs, Tab, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ProfileSection from '../components/mypage/ProfileSection';
import MyRecipes from '../components/mypage/MyRecipes';
import MyReviews from '../components/mypage/MyReviews';
import RecentViews from '../components/mypage/RecentViews';
import MyComments from '../components/mypage/MyComments';
import FollowSection from '../components/mypage/FollowSection';

const StyledTabs = styled(Tabs)({
  borderBottom: '2px solid #f1f3f5',
  marginBottom: '1.5rem',
  '& .MuiTab-root': {
    color: '#495057',
    border: 'none',
    padding: '1rem 1.5rem',
    fontWeight: 500,
    position: 'relative',
    '&:hover': {
      color: '#ff6b6b',
    },
    '&.Mui-selected': {
      color: '#ff6b6b',
      backgroundColor: 'transparent',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -2,
        left: 0,
        width: '100%',
        height: 2,
        backgroundColor: '#ff6b6b',
      },
    },
  },
});

function MyPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 3 }, pb: 4 }}>
      <ProfileSection />
      
      <Box sx={{ width: '100%', mt: 4 }}>
        <StyledTabs
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
          <Tab label="팔로우/팔로잉" />
        </StyledTabs>

        <Box sx={{ mt: 3 }}>
          {tabValue === 0 && <MyRecipes />}
          {tabValue === 1 && <MyReviews />}
          {tabValue === 2 && <RecentViews />}
          {tabValue === 3 && <MyComments />}
          {tabValue === 4 && <FollowSection />}
        </Box>
      </Box>
    </Container>
  );
}

export default MyPage;