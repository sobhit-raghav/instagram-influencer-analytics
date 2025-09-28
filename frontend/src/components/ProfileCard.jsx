import { Card, CardContent, Grid, Avatar, Typography, Box, Stack, Link } from '@mui/material';
import { formatCompactNumber } from '../utils/formatNumbers';

const ProfileCard = ({ profile }) => {
  if (!profile) return null;

  const proxiedImageUrl = profile.profilePicUrl 
    ? `http://localhost:8080/api/proxy?url=${encodeURIComponent(profile.profilePicUrl)}` 
    : '';

  const instaUrl = `https://www.instagram.com/${profile.username}/`;

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={3} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              src={proxiedImageUrl}
              alt={profile.name}
              sx={{ width: 120, height: 120, border: '3px solid', borderColor: 'primary.main' }}
            />
          </Grid>
          <Grid item xs={12} sm={9} md={10}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                {profile.name}
              </Typography>
              <Link 
                href={instaUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                underline="hover"
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  @{profile.username}
                </Typography>
              </Link>
              <Typography variant="body1" paragraph sx={{ mt: 1 }}>
                {profile.bio || ''}
              </Typography>
              <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                <Box textAlign="center">
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {formatCompactNumber(profile.postsCount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posts
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {formatCompactNumber(profile.followers)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Followers
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {formatCompactNumber(profile.following)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Following
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;