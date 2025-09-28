import { useState, useCallback } from 'react';
import { Container, Box, CircularProgress, Alert, Typography, Stack } from '@mui/material';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import PostList from '../components/PostList';
import ReelList from '../components/ReelList';
import useFetch from '../hooks/useFetch';
import { getInfluencerProfile, getPosts, getReels } from '../api/api';

const InitialStatePrompt = () => (
  <Box textAlign="center" sx={{ mt: 14, px: 2 }}>
    <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
      Instagram Profile Analytics
    </Typography>
    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
      Enter an Instagram username above to get started
    </Typography>
  </Box>
);

const InfluencerPage = () => {
  const [searchedUsername, setSearchedUsername] = useState('');

  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
    execute: fetchProfile,
  } = useFetch(getInfluencerProfile);

  const {
    data: posts,
    loading: postsLoading,
    error: postsError,
    execute: fetchPosts,
  } = useFetch(getPosts);

  const {
    data: reels,
    loading: reelsLoading,
    error: reelsError,
    execute: fetchReels,
  } = useFetch(getReels);

  const handleSearch = useCallback(
    async (username) => {
      if (!username) return;
      setSearchedUsername(username);

      try {
        const profileResult = await fetchProfile(username);
        if (profileResult?.success) {
          await Promise.all([fetchPosts(username), fetchReels(username)]);
        }
      } catch (err) {
        console.error('Unexpected error during search:', err);
      }
    },
    [fetchProfile, fetchPosts, fetchReels]
  );

  const isLoading = profileLoading || postsLoading || reelsLoading;
  const combinedError = profileError || postsError || reelsError;
  const noDataFound = !!searchedUsername && !isLoading && !combinedError && !profile;
  const hasSearched = !!searchedUsername;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: 8,
        backgroundColor: 'background.default',
      }}
    >
      <Navbar onSearch={handleSearch} isLoading={isLoading} />
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        {!hasSearched && !isLoading && <InitialStatePrompt />}

        {isLoading && (
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 14 }}
          >
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.primary">
              Scraping data for @{searchedUsername}...
            </Typography>
          </Stack>
        )}

        {combinedError && !isLoading && (
          <Alert severity="error" sx={{ my: 4 }}>
            {combinedError}
          </Alert>
        )}

        {hasSearched && !isLoading && !combinedError && (
          <>
            {profile && <ProfileCard profile={profile} />}
            {posts && posts.length > 0 && (
              <PostList posts={posts} username={profile.username} />
            )}
            {reels && reels.length > 0 && (
              <ReelList reels={reels} username={profile.username} />
            )}
            {noDataFound && (
              <Box textAlign="center" sx={{ mt: 12, px: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  No profile data found for{' '}
                  <strong style={{ color: '#fff' }}>@{searchedUsername}</strong>. The profile may be private or does not exist.
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default InfluencerPage;