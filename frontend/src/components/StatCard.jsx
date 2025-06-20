import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const StatCard = ({ title, value, trend = 0, icon, color = 'primary' }) => {
  const isPositive = trend > 0;
  const isNegative = trend < 0;
  const trendColor = isPositive ? 'success.main' : isNegative ? 'error.main' : 'text.secondary';
  const TrendIcon = isPositive ? ArrowUpward : ArrowDownward;

  return (
    <Card sx={{ minWidth: 250, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Box sx={{ fontSize: 28, color: `${color}.main` }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
          {value}
        </Typography>
        {trend !== 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: trendColor }}>
            <TrendIcon fontSize="small" />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {Math.abs(trend)}% {isPositive ? 'increase' : 'decrease'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
