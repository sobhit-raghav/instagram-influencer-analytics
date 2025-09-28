import { Card, CardContent, Grid, Avatar, Typography, Box, Stack, Link } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedIcon from '@mui/icons-material/Verified';
import { formatCompactNumber } from '../utils/formatNumbers';

const ProfileCard = ({ profile }) => {
  if (!profile) return null;

  const proxiedImageUrl = profile.profilePicUrl
    ? `http://localhost:8080/api/proxy?url=${encodeURIComponent(profile.profilePicUrl)}`
    : '';
  const instaUrl = `https://www.instagram.com/${profile.username}/`;

  return (
    <Card
      sx={{
        mb: 5,
        borderRadius: 3,
        backgroundColor: 'background.paper',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <CardContent>
        <Grid container spacing={4} alignItems="center">
          <Grid
            item
            xs={12}
            sm={3}
            md={2}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Avatar
              src={proxiedImageUrl}
              alt={profile.name}
              sx={{
                width: { xs: 100, sm: 120 },
                height: { xs: 100, sm: 120 },
                border: '3px solid',
                borderColor: 'primary.main',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={9} md={10}>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                flexWrap="wrap"
              >
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontWeight: 700, color: 'text.primary' }}
                >
                  {profile.name}
                </Typography>
                {profile.isVerified && (
                  <VerifiedIcon color="primary" fontSize="medium" />
                )}
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mt: 0.5 }}
                flexWrap="wrap"
              >
                <Link
                  href={instaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    @{profile.username}
                  </Typography>
                </Link>
                {profile.isPrivate && (
                  <LockIcon color="warning" fontSize="small" />
                )}
              </Stack>

              {profile.bio && (
                <Typography
                  variant="body1"
                  sx={{
                    mt: 1.5,
                    color: 'text.primary',
                    lineHeight: 1.6,
                    maxWidth: 700,
                  }}
                >
                  {profile.bio}
                </Typography>
              )}

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 4 }}
                sx={{ mt: 3 }}
              >
                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: 'text.primary' }}
                  >
                    {formatCompactNumber(profile.postsCount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posts
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: 'text.primary' }}
                  >
                    {formatCompactNumber(profile.followers)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Followers
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: 'text.primary' }}
                  >
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