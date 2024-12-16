import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';
import axios from 'axios';

function MyComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/reviews/comments/my', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setComments(response.data);
      } catch (error) {
        console.error('댓글 목록을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) {
    return (
      <Typography variant="body1" color="text.secondary" align="center">
        로딩 중...
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {comments.length === 0 ? (
        <Grid item xs={12}>
          <Typography variant="body1" color="text.secondary" align="center">
            작성한 댓글이 없습니다.
          </Typography>
        </Grid>
      ) : (
        comments.map((comment) => (
          <Grid item xs={12} key={comment.id}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography variant="body1">
                    {comment.content}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    작성일: {new Date(comment.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
}

export default MyComments;
