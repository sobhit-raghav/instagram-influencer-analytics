import { Card, CardContent, Grid, Typography, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { formatCompactNumber, formatPercentage } from '../utils/formatNumbers';

const MetricCard = ({ title, value, icon }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ textAlign: 'center' }}>
      <Box sx={{ color: 'primary.main', mb: 1 }}>
        {icon}
      </Box>
      <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const AnalyticsSection = ({ profile }) => {
  if (!profile || !profile.engagement) return null;

  const { avgLikes, avgComments, engagementRate } = profile.engagement;

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
        Engagement Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <MetricCard
            title="Average Likes"
            value={formatCompactNumber(avgLikes)}
            icon={<FavoriteIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MetricCard
            title="Average Comments"
            value={formatCompactNumber(avgComments)}
            icon={<CommentIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MetricCard
            title="Engagement Rate"
            value={formatPercentage(engagementRate)}
            icon={<ShowChartIcon fontSize="large" />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsSection;