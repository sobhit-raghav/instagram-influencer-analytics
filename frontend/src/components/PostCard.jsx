import { Card, CardMedia, CardContent, Typography, Box, Chip, Stack } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { formatCompactNumber } from '../utils/formatNumbers';

const PostCard = ({ post }) => {
  return (
    <Card sx={{ position: 'relative', '&:hover .overlay': { opacity: 1 } }}>
      <CardMedia
        component="img"
        height="300"
        image={post.imageUrl}
        alt={post.caption || 'Instagram Post'}
        sx={{ objectFit: 'cover' }}
      />
      <Box
        className="overlay"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          p: 2,
          textAlign: 'center',
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
  );
};

export default PostCard;