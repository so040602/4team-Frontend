import React from 'react';
import { Chip } from '@mui/material';

const gradeColors = {
  '새싹': 'success',
  '요리사': 'info',
  '셰프': 'primary',
  '마스터셰프': 'warning',
  '요리의 신': 'error'
};

const GradeBadge = ({ grade }) => {
  if (!grade || !grade.gradeName) return null;

  const gradeName = grade.gradeName;
  const color = gradeColors[gradeName] || 'default';

  return (
    <Chip
      label={gradeName}
      color={color}
      size="small"
      sx={{ ml: 1 }}
    />
  );
};

export default GradeBadge;