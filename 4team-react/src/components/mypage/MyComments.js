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

  const formatDate = (dateInput) => {
    if (!dateInput) return '-';
  
    // 날짜가 배열이 아니라면 Date 객체로 변환
    let date;
    if (Array.isArray(dateInput)) {
      const [year, month, day] = dateInput;
      date = new Date(year, month - 1, day); // Date 객체로 변환
    } else {
      date = new Date(dateInput); // 문자열 또는 다른 형식이 Date로 변환
    }
  
    // 날짜가 유효한지 확인
    if (isNaN(date.getTime())) return '-';
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}. ${month}. ${day}`;
  };

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
                    작성일: {formatDate(comment.createdAt)}
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
