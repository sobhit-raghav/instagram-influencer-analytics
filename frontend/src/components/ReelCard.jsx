import { Card, CardMedia, CardContent, Typography, Box, Chip, Stack, Link } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { formatCompactNumber } from '../utils/formatNumbers';

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
        <CardContent sx={{ pt: 1.5, pb: '16px !important' }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PlayCircleOutlineIcon fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                {formatCompactNumber(reel.views)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FavoriteBorderIcon fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                {formatCompactNumber(reel.likes)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ChatBubbleOutlineIcon fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                {formatCompactNumber(reel.comments)}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {reel.vibe && reel.vibe !== 'N/A' && (
              <Chip label={reel.vibe} color="secondary" size="small" variant="outlined" />
            )}
            {reel.tags?.slice(0, 2).map((tag) => (
              <Chip key={tag} label={`#${tag}`} size="small" />
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ReelCard;