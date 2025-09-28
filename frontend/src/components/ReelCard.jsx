import { Card, CardMedia, Typography, Box, Link } from '@mui/material';

const ReelCard = ({ reel, username }) => {
  const reelUrl = `https://www.instagram.com/reel/${reel.shortcode}/`;
  const proxiedImageUrl = reel.thumbnailUrl
    ? `http://localhost:8080/api/proxy?url=${encodeURIComponent(reel.thumbnailUrl)}`
    : '';

  return (
    <Link href={reelUrl} target="_blank" rel="noopener noreferrer" underline="none">
      <Card
        sx={{
          position: 'relative',
          height: '100%',
          borderRadius: 3,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': { transform: 'scale(1.03)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' },
        }}
      >
        <CardMedia
          component="img"
          height="300"
          image={proxiedImageUrl}
          alt={'Instagram Reel'}
          sx={{ objectFit: 'cover', borderRadius: 3 }}
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
            {'Reel by @' + username}
          </Typography>
        </Box>
      </Card>
    </Link>
  );
};

export default ReelCard;