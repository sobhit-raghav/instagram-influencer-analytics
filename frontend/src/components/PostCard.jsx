import { Card, CardMedia, Typography, Box, Link } from '@mui/material';

const PostCard = ({ post }) => {
  const postUrl = `https://www.instagram.com/p/${post.shortcode}/`;
  const proxiedImageUrl = post.imageUrl 
    ? `http://localhost:8080/api/proxy?url=${encodeURIComponent(post.imageUrl)}` 
    : '';

  return (
    <Link href={postUrl} target="_blank" rel="noopener noreferrer" underline="none">
      <Card sx={{ position: 'relative', height: '100%', '&:hover .overlay': { opacity: 1 }, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)' } }}>
        <CardMedia
          component="img"
          height="300"
          image={proxiedImageUrl}
          alt={post.caption || 'Instagram Post'}
          sx={{ objectFit: 'cover' }}
        />
        <Box
          className="overlay"
          sx={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white', display: 'flex',
            alignItems: 'center', justifyContent: 'center', opacity: 0,
            transition: 'opacity 0.3s ease', p: 2, textAlign: 'center',
          }}
        >
          <Typography variant="body2">{post.caption}</Typography>
        </Box>
      </Card>
    </Link>
  );
};

export default PostCard;