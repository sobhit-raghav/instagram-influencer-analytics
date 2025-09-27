import { Grid, Typography, Box } from '@mui/material';
import PostCard from './PostCard';

const PostList = ({ posts }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
        Recent Posts
      </Typography>
      <Grid container spacing={3}>
        {posts && posts.map((post) => (
          <Grid item key={post._id} xs={12} sm={6} md={4} lg={3}>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PostList;