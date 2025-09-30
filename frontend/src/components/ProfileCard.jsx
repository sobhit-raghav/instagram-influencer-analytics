import { 
  CardContent, 
  Grid, 
  Avatar, 
  Typography, 
  Box, 
  Stack, 
  Link, 
  Divider, 
  Paper,
  Chip,
  Tooltip,
  Fade,
  useMediaQuery,
  useTheme
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { formatCompactNumber, formatPercentage } from '../utils/formatNumbers';
import { API_URL } from '../api/api';
import AnalyticsCharts from './AnalyticsCharts';

const StatItem = ({ value, label, icon: Icon, trend, color = 'primary' }) => {
  const theme = useTheme();
  
  return (
    <Grid item xs={6} sm={4} md={2}>
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette[color].main}15 0%, ${theme.palette[color].main}05 100%)`,
          border: `1.5px solid ${theme.palette[color].main}30`,
          borderRadius: 3,
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: `${theme.palette[color].main}60`,
            boxShadow: `0 8px 24px ${theme.palette[color].main}20`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${theme.palette[color].main}, ${theme.palette[color].light})`,
            opacity: 0.8,
          },
        }}
      >
        {Icon && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: `${theme.palette[color].main}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ color: `${color}.main`, fontSize: 20 }} />
            </Box>
          </Box>
        )}
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: 'text.primary',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            {value}
          </Typography>
          {trend && (
            <Tooltip title={trend > 0 ? 'Trending up' : 'Trending down'} arrow>
              <Box>
                {trend > 0 ? (
                  <TrendingUpIcon sx={{ color: 'success.main', fontSize: 18 }} />
                ) : (
                  <TrendingDownIcon sx={{ color: 'error.main', fontSize: 18 }} />
                )}
              </Box>
            </Tooltip>
          )}
        </Stack>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            textTransform: 'uppercase', 
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            display: 'block',
            mt: 0.5,
          }}
        >
          {label}
        </Typography>
      </Paper>
    </Grid>
  );
};

const ProfileCard = ({ profile, posts }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (!profile) return null;

  const proxiedImageUrl = profile.profilePicUrl
    ? `${API_URL}/proxy?url=${encodeURIComponent(profile.profilePicUrl)}`
    : '';
  const instaUrl = `https://www.instagram.com/${profile.username}/`;

  const primaryStats = [
    { 
      value: formatCompactNumber(profile.postsCount), 
      label: 'Posts',
      icon: PhotoCameraIcon,
      color: 'info'
    },
    { 
      value: formatCompactNumber(profile.followers), 
      label: 'Followers',
      icon: PeopleIcon,
      color: 'primary'
    },
    { 
      value: formatCompactNumber(profile.following), 
      label: 'Following',
      icon: PersonAddIcon,
      color: 'secondary'
    },
  ];
  
  const engagementStats = [
    { 
      value: formatCompactNumber(profile.averageLikes), 
      label: 'Avg. Likes',
      icon: FavoriteIcon,
      color: 'error'
    },
    { 
      value: formatCompactNumber(profile.averageComments), 
      label: 'Avg. Comments',
      icon: ChatBubbleIcon,
      color: 'info'
    },
    { 
      value: formatPercentage(profile.engagementRate), 
      label: 'Engagement',
      icon: ShowChartIcon,
      color: 'success'
    },
  ];

  const engagementRateValue = parseFloat(profile.engagementRate);
  const getEngagementLevel = (rate) => {
    if (rate >= 6) return { label: 'Excellent', color: 'success' };
    if (rate >= 3) return { label: 'Good', color: 'info' };
    if (rate >= 1) return { label: 'Average', color: 'warning' };
    return { label: 'Low', color: 'error' };
  };
  const engagementLevel = getEngagementLevel(engagementRateValue);

  return (
    <Fade in timeout={600}>
      <Paper 
        elevation={8} 
        sx={{ 
          borderRadius: 4, 
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {/* Profile Header */}
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={proxiedImageUrl}
                  alt={profile.name}
                  sx={{
                    width: { xs: 140, md: 170 },
                    height: { xs: 140, md: 170 },
                    border: '4px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 8px 32px rgba(82, 153, 255, 0.3)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                {profile.isVerified && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid',
                      borderColor: 'background.paper',
                      boxShadow: '0 4px 12px rgba(82, 153, 255, 0.4)',
                    }}
                  >
                    <VerifiedIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Box>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={9}>
              <Stack spacing={2}>
                <Box>
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={1.5} 
                    flexWrap="wrap"
                    sx={{ mb: 1 }}
                  >
                    <Typography 
                      variant={isMobile ? 'h4' : 'h3'} 
                      component="h1" 
                      sx={{ 
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #E6EDF3 0%, #8B949E 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {profile.name}
                    </Typography>
                    {profile.isVerified && !isMobile && (
                      <Chip
                        label="Verified"
                        size="small"
                        icon={<VerifiedIcon />}
                        sx={{
                          background: 'linear-gradient(135deg, #5299FF 0%, #3D7FE6 100%)',
                          color: '#fff',
                          fontWeight: 600,
                          border: 'none',
                        }}
                      />
                    )}
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                    <Link 
                      href={instaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      underline="hover"
                      sx={{
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        color="text.secondary" 
                        sx={{ 
                          fontWeight: 500,
                          fontSize: { xs: '1rem', sm: '1.25rem' },
                        }}
                      >
                        @{profile.username}
                      </Typography>
                    </Link>
                    {profile.isPrivate && (
                      <Chip
                        icon={<LockIcon />}
                        label="Private"
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                    <Chip
                      label={engagementLevel.label}
                      size="small"
                      color={engagementLevel.color}
                      sx={{ 
                        fontWeight: 600,
                        boxShadow: `0 2px 8px ${theme.palette[engagementLevel.color].main}30`,
                      }}
                    />
                  </Stack>
                </Box>

                {profile.bio && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(139, 148, 158, 0.05)',
                      border: '1px solid rgba(48, 54, 61, 0.6)',
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        maxWidth: 700,
                        lineHeight: 1.7,
                        color: 'text.primary',
                      }}
                    >
                      {profile.bio}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />

          {/* Primary Stats */}
          <Box>
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1} 
              sx={{ mb: 3 }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 24,
                  borderRadius: 2,
                  background: 'linear-gradient(180deg, #5299FF 0%, #3D7FE6 100%)',
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                }}
              >
                Profile Statistics
              </Typography>
            </Stack>
            <Grid container spacing={2}>
              {primaryStats.map(stat => <StatItem key={stat.label} {...stat} />)}
            </Grid>
          </Box>
          
          <Divider sx={{ my: 4 }} />

          {/* Engagement Stats */}
          <Box>
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1} 
              sx={{ mb: 3 }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 24,
                  borderRadius: 2,
                  background: 'linear-gradient(180deg, #3FB950 0%, #2EA043 100%)',
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                }}
              >
                Engagement Analytics
              </Typography>
            </Stack>
            <Grid container spacing={2}>
              {engagementStats.map(stat => <StatItem key={stat.label} {...stat} />)}
            </Grid>
          </Box>
          
          {posts && posts.length > 0 && (
            <AnalyticsCharts profile={profile} posts={posts} />
          )}
          
        </CardContent>
      </Paper>
    </Fade>
  );
};

export default ProfileCard;