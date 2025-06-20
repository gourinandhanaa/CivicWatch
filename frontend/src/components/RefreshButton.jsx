import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const RefreshButton = ({ onClick, size = 'large', color = 'primary', tooltip = 'Refresh data', className = '' }) => {
  return (
    <Tooltip title={tooltip}>
      <IconButton 
        onClick={onClick} 
        color={color}
        size={size}
        className={className}
        aria-label="refresh"
      >
        <RefreshIcon />
      </IconButton>
    </Tooltip>
  );
};

RefreshButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary', 'error', 'info', 'success', 'warning']),
  tooltip: PropTypes.string,
  className: PropTypes.string
};

export default RefreshButton;
