import { useState, useEffect } from 'react';
import { Container, Box, CircularProgress, Alert, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import AnalyticsSection from '../components/AnalyticsSection';
import PostList from '../components/PostList';
import ReelList from '../components/ReelList';
import useFetch from '../hooks/useFetch';
import { getInfluencerProfile, getPosts, getReels } from '../api/api';

const InfluencerPage = () => {
  const [currentUsername, setCurrentUsername] = useState('mrbeast');

  const { data: profile, loading: profileLoading, error: profileError, execute: fetchProfile } = useFetch(getInfluencerProfile);
  const { data: posts, loading: postsLoading, error: postsError, execute: fetchPosts } = useFetch(getPosts);
  const { data: reels, loading: reelsLoading, error: reelsError, execute: fetchReels } = useFetch(getReels);

  const handleSearch = async (username) => {
    setCurrentUsername(username);
    await Promise.all([
      fetchProfile(username),
      fetchPosts(username),
      fetchReels(username)
    ]);
  };

  useEffect(() => {
    handleSearch(currentUsername);
  }, []);

  const isLoading = profileLoading || postsLoading || reelsLoading;
  const hasError = profileError || postsError || reelsError;
  const noDataFound = !profile && !posts?.length && !reels?.length;

  return (
    <Box sx={{ minHeight: '100vh', pb: 4 }}>
      <Navbar onSearch={handleSearch} isLoading={isLoading} />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2, alignSelf: 'center' }}>
              Fetching live data...
            </Typography>
          </Box>
        )}

        {hasError && (
          <Alert severity="error" sx={{ my: 2 }}>
            {profileError || postsError || reelsError}
          </Alert>
        )}

        {!isLoading && !hasError && (
          <>
            {profile && <ProfileCard profile={profile} />}
            {profile && <AnalyticsSection profile={profile} />}
            {posts && posts.length > 0 && <PostList posts={posts} />}
            {reels && reels.length > 0 && <ReelList reels={reels} />}
            {noDataFound && (
                <Typography align='center' sx={{mt: 5}}>No data found for this user.</Typography>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default InfluencerPage;