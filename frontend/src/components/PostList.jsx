import { Grid, Typography, Box } from '@mui/material';
import PostCard from './PostCard';

const PostList = ({ posts, username }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <Box sx={{ mt: 6, px: { xs: 2, sm: 0 } }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: '700', mb: 3, textAlign: { xs: 'center', sm: 'left' } }}
      >
        Recent Posts
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {posts.map((post) => (
          <Grid item key={post._id} xs={12} sm={6} md={4} lg={3}>
            <PostCard post={post} username={username} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PostList;