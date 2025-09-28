import { Card, CardMedia, Typography, Box, Link } from '@mui/material';

const ReelCard = ({ reel }) => {
  const reelUrl = `https://www.instagram.com/reel/${reel.shortcode}/`;
  const proxiedImageUrl = reel.thumbnailUrl 
    ? `http://localhost:8080/api/proxy?url=${encodeURIComponent(reel.thumbnailUrl)}` 
    : '';

  return (
    <Link href={reelUrl} target="_blank" rel="noopener noreferrer" underline="none">
      <Card sx={{ position: 'relative', height: '100%', '&:hover .overlay': { opacity: 1 }, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)' } }}>
        <CardMedia
          component="img"
          height="300"
          image={proxiedImageUrl}
          alt={reel.caption || 'Instagram Reel'}
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
          <Typography variant="body2">{reel.caption}</Typography>
        </Box>
      </Card>
    </Link>
  );
};

export default ReelCard;