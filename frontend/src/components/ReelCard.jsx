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
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MovieIcon from '@mui/icons-material/Movie';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { API_URL, INSTAGRAM_URL } from '../api/api';
import { formatCompactNumber } from '../utils/formatNumbers';

const ReelCard = ({ reel }) => {
  const reelUrl = `${INSTAGRAM_URL}/reel/${reel.shortcode}/`;
  const proxiedImageUrl = reel.thumbnailUrl
    ? `${API_URL}/proxy?url=${encodeURIComponent(reel.thumbnailUrl)}`
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

  const timeAgo = reel.postedAt ? getTimeAgo(reel.postedAt) : null;

  // Calculate engagement metrics
  const totalEngagement = (reel.likesCount || 0) + (reel.commentsCount || 0);
  const viewToEngagementRate = reel.viewsCount > 0 ? 
    ((totalEngagement / reel.viewsCount) * 100).toFixed(1) : 0;

  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
        minWidth: 280,
        borderRadius: 4,
        overflow: 'hidden',
        display: 'block',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(48, 54, 61, 0.6)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
          borderColor: 'rgba(240, 98, 146, 0.5)',
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
        '& .play-overlay': {
          opacity: 0.7,
        },
        '&:hover .play-overlay': {
          opacity: 1,
          transform: 'scale(1.1)',
        },
      }}
    >
      <Box sx={{ position: 'relative', height: 320 }}>
        <CardMedia
          component="img"
          height="320"
          image={proxiedImageUrl}
          alt="Instagram reel"
          sx={{
            objectFit: 'cover',
            width: '100%',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />

        {/* Reel Badge */}
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
              icon={<MovieIcon sx={{ fontSize: 14 }} />}
              label="Reel"
              size="small"
              sx={{
                backgroundColor: 'rgba(240, 98, 146, 0.9)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                letterSpacing: '0.05em',
              }}
            />
          </Box>
        </Fade>

        {/* Time Posted */}
        {timeAgo && (
          <Fade in timeout={300}>
            <Box
              sx={{
                position: 'absolute',
                top: 52,
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
          <Tooltip title="Open Reel in Instagram" arrow>
            <IconButton
              component={Link}
              href={reelUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: 'rgba(240, 98, 146, 0.9)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                width: 36,
                height: 36,
                '&:hover': {
                  backgroundColor: 'secondary.main',
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
              {reel.caption || 'No caption available'}
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
          <Stack direction="column" spacing={1.5}>
            {/* Main Stats */}
            <Stack 
              direction="row" 
              spacing={1.5} 
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
            >
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                <Chip
                  icon={<VisibilityIcon sx={{ color: '#F0B429 !important', fontSize: 16 }} />}
                  label={formatCompactNumber(reel.viewsCount)}
                  size="small"
                  sx={{
                    color: '#fff',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(240, 180, 41, 0.3)',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(240, 180, 41, 0.2)',
                      borderColor: 'rgba(240, 180, 41, 0.5)',
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                <Chip
                  icon={<FavoriteIcon sx={{ color: '#F85149 !important', fontSize: 16 }} />}
                  label={formatCompactNumber(reel.likesCount)}
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
                  label={formatCompactNumber(reel.commentsCount)}
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
            </Stack>

            {/* Engagement Rate */}
            {viewToEngagementRate > 0 && (
              <Tooltip title={`${viewToEngagementRate}% of viewers engaged`} arrow>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor: 'rgba(240, 98, 146, 0.2)',
                    border: '1px solid rgba(240, 98, 146, 0.4)',
                    backdropFilter: 'blur(8px)',
                    width: 'fit-content',
                  }}
                >
                  <ShowChartIcon sx={{ fontSize: 14, color: '#F06292' }} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#FF94BA',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {viewToEngagementRate}% engagement
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </Stack>
        </Box>
      </Box>
    </Card>
  );
};

export default ReelCard;