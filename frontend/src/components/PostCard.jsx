import { Card, CardMedia, Typography, Box, Link } from '@mui/material';

const PostCard = ({ post, username }) => {
  const postUrl = `https://www.instagram.com/p/${post.shortcode}/`;
  const proxiedImageUrl = post.imageUrl
    ? `http://localhost:8080/api/proxy?url=${encodeURIComponent(post.imageUrl)}`
    : '';

  return (
    <Link href={postUrl} target="_blank" rel="noopener noreferrer" underline="none">
      <Card
        sx={{
          position: 'relative',
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
          },
        }}
      >
        <CardMedia
          component="img"
          height="280"
          image={proxiedImageUrl}
          alt={'Instagram Post'}
          sx={{ objectFit: 'cover', width: '100%' }}
        />
        <Box
          className="overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            p: 2,
            '&:hover': {
              opacity: 1,
            },
          }}
        >
          <Typography variant="body2" sx={{ overflowWrap: 'break-word' }}>
            {'Post by @' + username}
          </Typography>
        </Box>
      </Card>
    </Link>
  );
};

export default PostCard;