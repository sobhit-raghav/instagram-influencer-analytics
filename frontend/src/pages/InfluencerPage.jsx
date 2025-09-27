import { useState, useCallback } from 'react';
import { Container, Box, CircularProgress, Alert, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import AnalyticsSection from '../components/AnalyticsSection';
import PostList from '../components/PostList';
import ReelList from '../components/ReelList';
import useFetch from '../hooks/useFetch';
import { getInfluencerProfile, getPosts, getReels } from '../api/api';

const InitialStatePrompt = () => (
  <Box textAlign="center" sx={{ mt: 10 }}>
    <Typography variant="h4" gutterBottom>
      Instagram Profile Analytics
    </Typography>
    <Typography variant="h6" color="text.secondary">
      Enter an Instagram username above to get started.
    </Typography>
  </Box>
);

const InfluencerPage = () => {
  const [searchedUsername, setSearchedUsername] = useState('');
  
  const { data: profile, loading: profileLoading, error: profileError, execute: fetchProfile } = useFetch(getInfluencerProfile);
  const { data: posts, loading: postsLoading, error: postsError, execute: fetchPosts } = useFetch(getPosts);
  const { data: reels, loading: reelsLoading, error: reelsError, execute: fetchReels } = useFetch(getReels);

  const handleSearch = useCallback(async (username) => {
    if (!username) return;
    setSearchedUsername(username);

    try {
      const profileResult = await fetchProfile(username);

      if (profileResult.success) {
        await Promise.all([
          fetchPosts(username),
          fetchReels(username)
        ]);
      }
    } catch (err) {
      console.error("An unexpected error occurred during the search operation:", err);
    }
  }, [fetchProfile, fetchPosts, fetchReels]);

  const isLoading = profileLoading || postsLoading || reelsLoading;
  const combinedError = profileError || postsError || reelsError;
  const noDataFound = !!searchedUsername && !isLoading && !combinedError && !profile;
  const hasSearched = !!searchedUsername;

  return (
    <Box sx={{ minHeight: '100vh', pb: 4 }}>
      <Navbar onSearch={handleSearch} isLoading={isLoading} />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {!hasSearched && !isLoading && <InitialStatePrompt />}

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2, alignSelf: 'center' }}>
              Scraping live data for @{searchedUsername}...
            </Typography>
          </Box>
        )}

        {combinedError && !isLoading && (
          <Alert severity="error" sx={{ my: 2 }}>
            {combinedError}
          </Alert>
        )}

        {hasSearched && !isLoading && !combinedError && (
          <>
            {profile && <ProfileCard profile={profile} />}
            {profile && <AnalyticsSection profile={profile} />}
            {posts && posts.length > 0 && <PostList posts={posts} />}
            {reels && reels.length > 0 && <ReelList reels={reels} />}
            {noDataFound && (
                <Typography align="center" sx={{mt: 5}}>
                  No profile data found for "@<strong>{searchedUsername}</strong>". The profile may be private or does not exist.
                </Typography>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default InfluencerPage;