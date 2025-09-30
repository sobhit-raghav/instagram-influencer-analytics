import { useState, useCallback } from 'react';
import { 
  Container, 
  Box, 
  CircularProgress, 
  Alert, 
  Typography, 
  Stack,
  Fade,
  Paper,
  Button,
  useTheme
} from '@mui/material';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import PostList from '../components/PostList';
import ReelList from '../components/ReelList';
import useFetch from '../hooks/useFetch';
import { getInfluencerProfile } from '../api/api';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsightsIcon from '@mui/icons-material/Insights';
import SpeedIcon from '@mui/icons-material/Speed';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const InitialStatePrompt = () => {
  const theme = useTheme();
  
  const features = [
    { icon: <TrendingUpIcon />, title: 'Engagement Metrics', desc: 'Track likes, comments, and growth' },
    { icon: <InsightsIcon />, title: 'Content Analysis', desc: 'Understand what content performs best' },
    { icon: <SpeedIcon />, title: 'Real-time Data', desc: 'Get up-to-date profile statistics' },
  ];

  return (
    <Fade in timeout={800}>
      <Box textAlign="center" sx={{ mt: { xs: 8, md: 14 }, px: 2 }}>
        {/* Main Hero */}
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
              mb: 3,
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-10px)' },
              },
            }}
          >
            <SearchIcon sx={{ color: '#fff', fontSize: 40 }} />
          </Box>
          
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 800, 
              color: 'text.primary',
              letterSpacing: '-0.02em',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              background: 'linear-gradient(135deg, #E6EDF3 0%, #8B949E 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Instagram Profile Analytics
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 650, 
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              fontWeight: 400,
            }}
          >
            Discover deep insights into any Instagram profile. Track engagement, analyze content performance, and understand what makes influencers successful.
          </Typography>
        </Box>

        {/* Feature Cards */}
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6 }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3}
            justifyContent="center"
          >
            {features.map((feature, index) => (
              <Fade in timeout={1000 + (index * 200)} key={feature.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    flex: 1,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(82, 153, 255, 0.08) 0%, rgba(82, 153, 255, 0.02) 100%)',
                    border: '1px solid rgba(82, 153, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: 'rgba(82, 153, 255, 0.4)',
                      boxShadow: '0 8px 24px rgba(82, 153, 255, 0.15)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #5299FF 0%, #3D7FE6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      boxShadow: '0 4px 12px rgba(82, 153, 255, 0.3)',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </Paper>
              </Fade>
            ))}
          </Stack>
        </Box>

        {/* CTA */}
        <Box sx={{ mt: 6 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'success.main',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.5, transform: 'scale(1.2)' },
                },
              }}
            />
            Enter a username in the search bar above to begin
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

const InfluencerPage = () => {
  const [searchedUsername, setSearchedUsername] = useState('');
  const theme = useTheme();

  const {
    data,
    loading,
    error,
    execute: fetchInfluencerData,
  } = useFetch(getInfluencerProfile);

  const handleSearch = useCallback(
    (username) => {
      if (!username) return;
      setSearchedUsername(username);
      fetchInfluencerData(username);
    },
    [fetchInfluencerData]
  );

  const influencerProfile = data?.influencer;
  const posts = data?.posts;
  const reels = data?.reels;

  const noDataFound = !!searchedUsername && !loading && !error && !influencerProfile;
  const hasSearched = !!searchedUsername;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: 8,
        backgroundColor: 'background.default',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60vh',
          background: 'radial-gradient(ellipse at top, rgba(82, 153, 255, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <Navbar onSearch={handleSearch} isLoading={loading} />
      
      <Container maxWidth="xl" sx={{ mt: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
        {/* Initial State */}
        {!hasSearched && !loading && <InitialStatePrompt />}

        {/* Loading State */}
        {loading && (
          <Fade in timeout={300}>
            <Box sx={{ mt: { xs: 8, md: 14 } }}>
              <Paper
                elevation={0}
                sx={{
                  maxWidth: 500,
                  mx: 'auto',
                  p: 5,
                  textAlign: 'center',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(82, 153, 255, 0.08) 0%, rgba(82, 153, 255, 0.02) 100%)',
                  border: '1px solid rgba(82, 153, 255, 0.2)',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-flex',
                    mb: 3,
                  }}
                >
                  <CircularProgress 
                    size={80} 
                    thickness={3}
                    sx={{
                      color: 'primary.main',
                      animationDuration: '1.2s',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                  </Box>
                </Box>
                <Typography 
                  variant="h5" 
                  color="text.primary"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  Analyzing Profile
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Fetching analytics for <strong style={{ color: theme.palette.primary.main }}>@{searchedUsername}</strong>
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {[0, 1, 2].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: 'primary.main',
                          animation: 'bounce 1.4s ease-in-out infinite',
                          animationDelay: `${i * 0.2}s`,
                          '@keyframes bounce': {
                            '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: 0.5 },
                            '40%': { transform: 'scale(1.2)', opacity: 1 },
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Paper>
            </Box>
          </Fade>
        )}

        {/* Error State */}
        {error && !loading && (
          <Fade in timeout={300}>
            <Box sx={{ mt: { xs: 8, md: 12 } }}>
              <Alert 
                severity="error"
                icon={<ErrorOutlineIcon sx={{ fontSize: 28 }} />}
                sx={{ 
                  maxWidth: 600,
                  mx: 'auto',
                  borderRadius: 3,
                  py: 3,
                  '& .MuiAlert-message': {
                    width: '100%',
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Unable to Fetch Profile
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {error}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleSearch(searchedUsername)}
                  sx={{ mt: 1 }}
                >
                  Try Again
                </Button>
              </Alert>
            </Box>
          </Fade>
        )}

        {/* Content Display */}
        {hasSearched && !loading && !error && (
          <>
            {influencerProfile && <ProfileCard profile={influencerProfile} posts={posts} />}
            {posts && posts.length > 0 && <PostList posts={posts} />}
            {reels && reels.length > 0 && <ReelList reels={reels} />}
            
            {/* No Data Found */}
            {noDataFound && (
              <Fade in timeout={300}>
                <Box sx={{ mt: { xs: 8, md: 12 } }}>
                  <Paper
                    elevation={0}
                    sx={{
                      maxWidth: 500,
                      mx: 'auto',
                      p: 5,
                      textAlign: 'center',
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, rgba(139, 148, 158, 0.08) 0%, rgba(139, 148, 158, 0.02) 100%)',
                      border: '1px solid rgba(139, 148, 158, 0.2)',
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'rgba(139, 148, 158, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      <SentimentDissatisfiedIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                      Profile Not Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      No profile data found for{' '}
                      <strong style={{ color: theme.palette.text.primary }}>@{searchedUsername}</strong>.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      The profile may be private, doesn't exist, or there was an issue fetching the data.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<SearchIcon />}
                      onClick={() => setSearchedUsername('')}
                    >
                      Search Another Profile
                    </Button>
                  </Paper>
                </Box>
              </Fade>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default InfluencerPage;