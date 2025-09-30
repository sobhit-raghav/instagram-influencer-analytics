import { 
  Grid, 
  Typography, 
  Box, 
  Stack, 
  Chip,
  Fade,
  Paper,
  Divider
} from '@mui/material';
import PostCard from './PostCard';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MoodIcon from '@mui/icons-material/Mood';

const PostList = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  // Calculate some overview stats
  const totalLikes = posts.reduce((sum, post) => sum + (post.likesCount || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.commentsCount || 0), 0);
  const avgEngagement = posts.length > 0 
    ? ((totalLikes + totalComments) / posts.length).toFixed(0) 
    : 0;

  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          mt: 6,
          px: { xs: 2, sm: 0 },
          maxWidth: '1400px',
          mx: 'auto',
        }}
      >
        {/* Section Header */}
        <Box sx={{ mb: 4 }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                }}
              >
                <PhotoLibraryIcon sx={{ color: '#fff', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2,
                  }}
                >
                  Recent Posts
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.875rem', mt: 0.5 }}
                >
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'} • Avg. {avgEngagement} engagements
                </Typography>
              </Box>
            </Stack>

            {/* Quick Stats */}
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <Paper
                elevation={0}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(82, 153, 255, 0.1) 0%, rgba(82, 153, 255, 0.05) 100%)',
                  border: '1px solid rgba(82, 153, 255, 0.2)',
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                  Total Likes
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.2 }}>
                  {totalLikes.toLocaleString()}
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.1) 0%, rgba(88, 166, 255, 0.05) 100%)',
                  border: '1px solid rgba(88, 166, 255, 0.2)',
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                  Total Comments
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main', lineHeight: 1.2 }}>
                  {totalComments.toLocaleString()}
                </Typography>
              </Paper>
            </Stack>
          </Stack>
          <Divider sx={{ opacity: 0.6 }} />
        </Box>

        {/* Posts Grid */}
        <Grid
          container
          spacing={{ xs: 3, sm: 3, md: 4 }}
          justifyContent={{ xs: 'center', sm: 'flex-start' }}
        >
          {posts.map((post, index) => (
            <Grid
              item
              key={post._id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              <Fade in timeout={300 + (index * 50)}>
                <Stack spacing={1.5}>
                  <PostCard post={post} />
                  
                  {/* Tags Section */}
                  {(post.analysis?.vibe || post.analysis?.tags?.length > 0) && (
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {post.analysis?.vibe && (
                        <Chip
                          icon={<MoodIcon sx={{ fontSize: 16 }} />}
                          label={post.analysis.vibe}
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, rgba(240, 98, 146, 0.15) 0%, rgba(240, 98, 146, 0.05) 100%)',
                            border: '1px solid rgba(240, 98, 146, 0.3)',
                            color: '#FF94BA',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(240, 98, 146, 0.2)',
                              borderColor: 'rgba(240, 98, 146, 0.5)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        />
                      )}
                      {post.analysis?.tags?.slice(1, 4).map((tag) => (
                        <Chip
                          key={tag}
                          icon={<LocalOfferIcon sx={{ fontSize: 14 }} />}
                          label={tag}
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, rgba(82, 153, 255, 0.12) 0%, rgba(82, 153, 255, 0.05) 100%)',
                            border: '1px solid rgba(82, 153, 255, 0.25)',
                            color: '#7AB4FF',
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(82, 153, 255, 0.18)',
                              borderColor: 'rgba(82, 153, 255, 0.4)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Fade>
  );
};

export default PostList;