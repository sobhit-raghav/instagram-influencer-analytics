import { Card, CardMedia, Typography, Box, Link } from '@mui/material';

const ReelCard = ({ reel, username }) => {
  const reelUrl = `https://www.instagram.com/reel/${reel.shortcode}/`;
  const proxiedImageUrl = reel.thumbnailUrl
    ? `http://localhost:8080/api/proxy?url=${encodeURIComponent(reel.thumbnailUrl)}`
    : '';

  return (
    <Link
      href={reelUrl}
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
          boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
          '&:hover': {
            transform: 'translateY(-6px) scale(1.02)',
            boxShadow: '0 10px 28px rgba(0,0,0,0.55)',
          },
        }}
      >
        <CardMedia
          component="img"
          height="300"
          image={proxiedImageUrl}
          alt="Instagram Reel"
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
              'linear-gradient(to top, rgba(0,0,0,0.75) 15%, rgba(0,0,0,0.05) 85%)',
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
            Reel by @{username}
          </Typography>
        </Box>
      </Card>
    </Link>
  );
};

export default ReelCard;