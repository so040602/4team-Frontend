import React from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';

function MyMenus() {
  // TODO: API로 내 메뉴 목록 가져오기
  const menus = [];

  return (
    <Grid container spacing={3}>
      {menus.length === 0 ? (
        <Grid item xs={12}>
          <Typography variant="body1" color="text.secondary" align="center">
            작성한 메뉴가 없습니다.
          </Typography>
        </Grid>
      ) : (
        menus.map((menu) => (
          <Grid item xs={12} sm={6} md={4} key={menu.id}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {menu.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {menu.description}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    작성일: {new Date(menu.createdAt).toLocaleDateString()}
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

export default MyMenus;
