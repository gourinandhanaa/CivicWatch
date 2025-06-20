import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h4" gutterBottom color="error">
        403 - Access Denied
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        You don't have permission to access this page.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/')}
      >
        Return to Home
      </Button>
    </Container>
  );
};

export default NotAuthorized;