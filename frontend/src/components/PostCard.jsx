import { Card, CardMedia, Typography, Box, Link } from '@mui/material';

const PostCard = ({ post, username }) => {
  const postUrl = `https://www.instagram.com/p/${post.shortcode}/`;
  const proxiedImageUrl = post.imageUrl
    ? `http://localhost:8080/api/proxy?url=${encodeURIComponent(post.imageUrl)}`
    : '';

  return (
    <Link
      href={postUrl}
      target="_blank"
      rel="noopener noreferrer"
      underline="none"
      sx={{ display: 'block', height: '100%' }}
    >
      <Card
        sx={{
          position: 'relative',
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: 'background.paper',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-6px) scale(1.02)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
          },
        }}
      >
        <CardMedia
          component="img"
          height="280"
          image={proxiedImageUrl}
          alt="Instagram Post"
          sx={{
            objectFit: 'cover',
            width: '100%',
            transition: 'transform 0.4s ease',
            '&:hover': { transform: 'scale(1.05)' },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.7) 20%, rgba(0,0,0,0) 80%)',
            color: 'text.primary',
            display: 'flex',
            alignItems: 'flex-end',
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
          <Typography
            variant="body2"
            sx={{
              color: '#fff',
              fontWeight: 500,
              overflowWrap: 'break-word',
            }}
          >
            Post by @{username}
          </Typography>
        </Box>
      </Card>
    </Link>
  );
};

export default PostCard;