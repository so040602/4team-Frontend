import React, { useState } from 'react';
import { Box, Paper, Avatar, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

function ProfileSection() {
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState('사용자 이름');
  
  const handleEditClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    // TODO: API 호출하여 프로필 정보 업데이트
    setOpen(false);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={3}>
        <Avatar sx={{ width: 100, height: 100 }}>U</Avatar>
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h5">{displayName}</Typography>
            <Button startIcon={<EditIcon />} onClick={handleEditClick}>
              프로필 수정
            </Button>
          </Box>
          <Typography color="text.secondary">example@email.com</Typography>
          <Box display="flex" gap={2} mt={2}>
            <Typography>레시피 0</Typography>
            <Typography>리뷰 0</Typography>
            <Typography>팔로워 0</Typography>
            <Typography>팔로잉 0</Typography>
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
