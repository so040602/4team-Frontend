import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box
} from '@mui/material';
import GradeBadge from './GradeBadge';

const GradeInfoModal = ({ open, onClose }) => {
  const [grades] = useState([
    { id: 1, gradeName: '새싹', requiredReviewCount: 0, requiredCommentCount: 0 },
    { id: 2, gradeName: '요리사', requiredReviewCount: 10, requiredCommentCount: 20 },
    { id: 3, gradeName: '셰프', requiredReviewCount: 30, requiredCommentCount: 50 },
    { id: 4, gradeName: '마스터셰프', requiredReviewCount: 50, requiredCommentCount: 100 },
    { id: 5, gradeName: '요리의 신', requiredReviewCount: 100, requiredCommentCount: 200 }
  ]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>등급 안내</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>등급</TableCell>
                <TableCell align="right">필요 리뷰 수</TableCell>
                <TableCell align="right">필요 댓글 수</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" whiteSpace="nowrap">
                      <GradeBadge grade={grade} />
                      <Typography sx={{ ml: 1 }}>{grade.gradeName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{grade.requiredReviewCount}개</TableCell>
                  <TableCell align="right">{grade.requiredCommentCount}개</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          * 등급은 리뷰 수와 댓글 수에 따라 자동으로 업데이트됩니다.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default GradeInfoModal;