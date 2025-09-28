import { Grid, Typography, Box } from '@mui/material';
import ReelCard from './ReelCard';

const ReelList = ({ reels, username }) => {
  if (!reels || reels.length === 0) return null;

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
        Recent Reels
      </Typography>
      <Grid container spacing={3}>
        {reels.map((reel) => (
          <Grid item key={reel._id} xs={12} sm={6} md={4} lg={3}>
            <ReelCard reel={reel} username={username} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReelList;