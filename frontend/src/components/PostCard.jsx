import { Card, CardMedia, CardContent, Typography, Box, Chip, Stack, Link } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { formatCompactNumber } from '../utils/formatNumbers';

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
        <CardContent sx={{ pt: 1.5, pb: '16px !important' }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FavoriteBorderIcon fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                {formatCompactNumber(post.likes)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ChatBubbleOutlineIcon fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                {formatCompactNumber(post.comments)}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {post.vibe && post.vibe !== 'N/A' && (
              <Chip label={post.vibe} color="secondary" size="small" variant="outlined" />
            )}
            {post.tags?.slice(0, 3).map((tag) => (
              <Chip key={tag} label={`#${tag}`} size="small" />
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PostCard;