import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, Tabs, Tab, Divider } from '@mui/material';

function MyComments() {
  const [tabValue, setTabValue] = useState(0);
  // TODO: API로 내 댓글 목록 가져오기
  const recipeComments = [];
  const reviewComments = [];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="레시피 댓글" />
        <Tab label="리뷰 댓글" />
      </Tabs>

      {tabValue === 0 ? (
        recipeComments.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            작성한 레시피 댓글이 없습니다.
          </Typography>
        ) : (
          <List>
            {recipeComments.map((comment, index) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={comment.content}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {comment.recipeName}
                        </Typography>
                        {` — ${new Date(comment.createdAt).toLocaleDateString()}`}
                      </>
                    }
                  />
                </ListItem>
                {index < recipeComments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )
      ) : (
        reviewComments.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            작성한 리뷰 댓글이 없습니다.
          </Typography>
        ) : (
          <List>
            {reviewComments.map((comment, index) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={comment.content}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {comment.reviewTitle}
                        </Typography>
                        {` — ${new Date(comment.createdAt).toLocaleDateString()}`}
                      </>
                    }
                  />
                </ListItem>
                {index < reviewComments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )
      )}
    </Box>
  );
}

export default MyComments;
