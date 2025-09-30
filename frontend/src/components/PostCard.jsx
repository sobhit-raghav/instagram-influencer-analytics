import { 
  Card, 
  CardMedia, 
  Typography, 
  Box, 
  Link, 
  Stack, 
  Chip,
  IconButton,
  Fade,
  Tooltip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { API_URL } from '../api/api';
import { formatCompactNumber } from '../utils/formatNumbers';

const PostCard = ({ post }) => {
  const postUrl = `https://www.instagram.com/p/${post.shortcode}/`;
  const proxiedImageUrl = post.imageUrl
    ? `${API_URL}/proxy?url=${encodeURIComponent(post.imageUrl)}`
    : '';

  // Calculate time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInSeconds = Math.floor((now - posted) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  const timeAgo = post.postedAt ? getTimeAgo(post.postedAt) : null;

  // Calculate engagement rate for this post
  const totalEngagement = (post.likesCount || 0) + (post.commentsCount || 0);
  const engagementRate = totalEngagement > 0 ? 
    ((post.likesCount || 0) / totalEngagement * 100).toFixed(0) : 0;

  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        display: 'block',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(48, 54, 61, 0.6)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
          borderColor: 'rgba(82, 153, 255, 0.5)',
        },
        '& .caption-overlay': {
          opacity: 0,
          transform: 'translateY(10px)',
        },
        '&:hover .caption-overlay': {
          opacity: 1,
          transform: 'translateY(0)',
        },
        '& .hover-actions': {
          opacity: 0,
          transform: 'translateY(10px)',
        },
        '&:hover .hover-actions': {
          opacity: 1,
          transform: 'translateY(0)',
        },
      }}
    >
      <Box sx={{ position: 'relative', height: 320 }}>
        <CardMedia
          component="img"
          height="320"
          image={proxiedImageUrl}
          alt="Instagram post"
          sx={{
            objectFit: 'cover',
            width: '100%',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />

        {/* Top Badge - Time Posted */}
        {timeAgo && (
          <Fade in timeout={300}>
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                zIndex: 2,
              }}
            >
              <Chip
                icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                label={timeAgo}
                size="small"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              />
            </Box>
          </Fade>
        )}

        {/* Open Link Button */}
        <Box
          className="hover-actions"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            transition: 'all 0.3s ease',
          }}
        >
          <Tooltip title="Open in Instagram" arrow>
            <IconButton
              component={Link}
              href={postUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: 'rgba(82, 153, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                width: 36,
                height: 36,
                '&:hover': {
                  backgroundColor: 'primary.main',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <OpenInNewIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Caption Overlay */}
        <Box
          className="caption-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 3,
            transition: 'all 0.3s ease-in-out',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              maxHeight: '100%',
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '2px',
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                lineHeight: 1.6,
                fontSize: '0.875rem',
                color: '#E6EDF3',
              }}
            >
              {post.caption || 'No caption available'}
            </Typography>
          </Box>
        </Box>

        {/* Bottom Stats Bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0) 100%)',
            backdropFilter: 'blur(8px)',
            p: 2,
            zIndex: 1,
          }}
        >
          <Stack 
            direction="row" 
            spacing={1.5} 
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1.5}>
              <Chip
                icon={<FavoriteIcon sx={{ color: '#F85149 !important', fontSize: 16 }} />}
                label={formatCompactNumber(post.likesCount)}
                size="small"
                sx={{
                  color: '#fff',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(248, 81, 73, 0.3)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(248, 81, 73, 0.2)',
                    borderColor: 'rgba(248, 81, 73, 0.5)',
                    transform: 'scale(1.05)',
                  },
                }}
              />
              <Chip
                icon={<ChatBubbleIcon sx={{ color: '#58A6FF !important', fontSize: 16 }} />}
                label={formatCompactNumber(post.commentsCount)}
                size="small"
                sx={{
                  color: '#fff',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(88, 166, 255, 0.3)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(88, 166, 255, 0.2)',
                    borderColor: 'rgba(88, 166, 255, 0.5)',
                    transform: 'scale(1.05)',
                  },
                }}
              />
            </Stack>
            
            {/* Engagement indicator */}
            <Tooltip title={`${engagementRate}% likes ratio`} arrow>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: 'rgba(63, 185, 80, 0.2)',
                  border: '1px solid rgba(63, 185, 80, 0.4)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#3FB950',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '0.02em',
                  }}
                >
                  {engagementRate}%
                </Typography>
              </Box>
            </Tooltip>
          </Stack>
        </Box>
      </Box>
    </Card>
  );
};

export default PostCard;