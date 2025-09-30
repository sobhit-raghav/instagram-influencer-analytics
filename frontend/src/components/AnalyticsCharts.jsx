import { Grid, Paper, Typography, Box, Stack, Chip, Divider } from '@mui/material';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AnalyticsCharts = ({ profile, posts }) => {
    // Calculate trend
    const sortedPosts = [...posts].sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt));
    const recentPosts = sortedPosts.slice(-5);
    const olderPosts = sortedPosts.slice(-10, -5);
    const recentAvgLikes = recentPosts.reduce((sum, p) => sum + p.likesCount, 0) / recentPosts.length;
    const olderAvgLikes = olderPosts.length > 0
        ? olderPosts.reduce((sum, p) => sum + p.likesCount, 0) / olderPosts.length
        : recentAvgLikes;
    const trendPercentage = olderAvgLikes > 0
        ? (((recentAvgLikes - olderAvgLikes) / olderAvgLikes) * 100).toFixed(1)
        : 0;
    const isPositiveTrend = trendPercentage >= 0;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#E6EDF3',
                    font: {
                        size: 13,
                        family: '"Inter", sans-serif',
                        weight: '500',
                    },
                    padding: 12,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(21, 27, 35, 0.95)',
                titleColor: '#E6EDF3',
                bodyColor: '#C9D1D9',
                borderColor: 'rgba(82, 153, 255, 0.3)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                    size: 14,
                    weight: 'bold',
                },
                bodyFont: {
                    size: 13,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#8B949E',
                    font: {
                        size: 12,
                    },
                },
                grid: {
                    color: 'rgba(48, 54, 61, 0.5)',
                    lineWidth: 1,
                },
                border: {
                    display: false,
                },
            },
            x: {
                ticks: {
                    color: '#8B949E',
                    font: {
                        size: 11,
                    },
                },
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
            },
        },
    };

    const barChartData = {
        labels: ['Average Engagement per Post'],
        datasets: [
            {
                label: 'Average Likes',
                data: [profile.averageLikes],
                backgroundColor: 'rgba(82, 153, 255, 0.7)',
                borderColor: '#5299FF',
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 60,
            },
            {
                label: 'Average Comments',
                data: [profile.averageComments],
                backgroundColor: 'rgba(240, 98, 146, 0.7)',
                borderColor: '#F06292',
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 60,
            },
        ],
    };

    const lineChartData = {
        labels: posts.map(p => {
            const date = new Date(p.postedAt);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }).reverse(),
        datasets: [
            {
                label: 'Likes',
                data: posts.map(p => p.likesCount).reverse(),
                borderColor: '#3FB950',
                backgroundColor: 'rgba(63, 185, 80, 0.15)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#3FB950',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#3FB950',
                pointHoverBorderColor: '#fff',
                borderWidth: 3,
            },
        ],
    };

    // Engagement breakdown
    const totalLikes = posts.reduce((sum, p) => sum + p.likesCount, 0);
    const totalComments = posts.reduce((sum, p) => sum + p.commentsCount, 0);

    const doughnutData = {
        labels: ['Likes', 'Comments'],
        datasets: [
            {
                data: [totalLikes, totalComments],
                backgroundColor: [
                    'rgba(248, 81, 73, 0.8)',
                    'rgba(88, 166, 255, 0.8)',
                ],
                borderColor: [
                    '#F85149',
                    '#58A6FF',
                ],
                borderWidth: 2,
                hoverOffset: 8,
            },
        ],
    };

    const doughnutOptions = {
        ...chartOptions,
        cutout: '65%',
        plugins: {
            ...chartOptions.plugins,
            legend: {
                ...chartOptions.plugins.legend,
                position: 'bottom',
            },
            tooltip: {
                ...chartOptions.plugins.tooltip,
                callbacks: {
                    label: function (context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return `${context.label}: ${context.parsed.toLocaleString()} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <Box sx={{ mt: 5, position: 'relative', zIndex: 1 }}>
            <Divider sx={{ mb: 4 }} />

            {/* Section Header */}
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #3FB950 0%, #2EA043 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(63, 185, 80, 0.3)',
                    }}
                >
                    <ShowChartIcon sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            letterSpacing: '-0.01em',
                            lineHeight: 1.2,
                        }}
                    >
                        Performance Analytics
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        Visual breakdown of engagement metrics
                    </Typography>
                </Box>
            </Stack>

            <Grid container spacing={3} sx={{ position: 'relative' }}>
                {/* Bar Chart */}
                <Grid item xs={12} lg={6}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '420px',
                            borderRadius: 3,
                            border: '1px solid rgba(48, 54, 61, 0.6)',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            zIndex: 1,
                            backgroundColor: 'background.paper',
                            '&:hover': {
                                borderColor: 'rgba(82, 153, 255, 0.4)',
                                boxShadow: '0 8px 24px rgba(82, 153, 255, 0.12)',
                            },
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            <BarChartIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                Average Engagement
                            </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                            Comparison of likes vs comments per post
                        </Typography>
                        <Box sx={{ height: '320px' }}>
                            <Bar options={chartOptions} data={barChartData} />
                        </Box>
                    </Paper>
                </Grid>

                {/* Line Chart */}
                <Grid item xs={12} lg={6}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '420px',
                            borderRadius: 3,
                            border: '1px solid rgba(48, 54, 61, 0.6)',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            zIndex: 1,
                            backgroundColor: 'background.paper',
                            '&:hover': {
                                borderColor: 'rgba(63, 185, 80, 0.4)',
                                boxShadow: '0 8px 24px rgba(63, 185, 80, 0.12)',
                            },
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ mb: 2 }}
                        >
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <ShowChartIcon sx={{ color: 'success.main', fontSize: 20 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                    Recent Performance
                                </Typography>
                            </Stack>
                            {trendPercentage !== 0 && (
                                <Chip
                                    icon={isPositiveTrend ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                    label={`${isPositiveTrend ? '+' : ''}${trendPercentage}%`}
                                    size="small"
                                    color={isPositiveTrend ? 'success' : 'error'}
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                    }}
                                />
                            )}
                        </Stack>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                            Likes trend across last {posts.length} posts
                        </Typography>
                        <Box sx={{ height: '320px' }}>
                            <Line options={chartOptions} data={lineChartData} />
                        </Box>
                    </Paper>
                </Grid>

                {/* Doughnut Chart */}
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '420px',
                            borderRadius: 3,
                            border: '1px solid rgba(48, 54, 61, 0.6)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderColor: 'rgba(240, 98, 146, 0.4)',
                                boxShadow: '0 8px 24px rgba(240, 98, 146, 0.12)',
                            },
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            <DonutLargeIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                Engagement Distribution
                            </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                            Total engagement breakdown
                        </Typography>
                        <Box sx={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Doughnut options={doughnutOptions} data={doughnutData} />
                        </Box>
                    </Paper>
                </Grid>

                {/* Stats Summary */}
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '420px',
                            borderRadius: 3,
                            border: '1px solid rgba(48, 54, 61, 0.6)',
                            background: 'linear-gradient(135deg, rgba(82, 153, 255, 0.05) 0%, rgba(240, 98, 146, 0.05) 100%)',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1rem' }}>
                            Key Insights
                        </Typography>
                        <Stack spacing={0.5}>
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    background: 'rgba(248, 81, 73, 0.1)',
                                    border: '1px solid rgba(248, 81, 73, 0.2)',
                                }}
                            >
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                    TOTAL LIKES
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main', mt: 0.5 }}>
                                    {totalLikes.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                    Across {posts.length} posts
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    background: 'rgba(88, 166, 255, 0.1)',
                                    border: '1px solid rgba(88, 166, 255, 0.2)',
                                }}
                            >
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                    TOTAL COMMENTS
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: 'info.main', mt: 0.5 }}>
                                    {totalComments.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                    Across {posts.length} posts
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    background: 'rgba(63, 185, 80, 0.1)',
                                    border: '1px solid rgba(63, 185, 80, 0.2)',
                                }}
                            >
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                    ENGAGEMENT RATE
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main', mt: 0.5 }}>
                                    {profile.engagementRate.toFixed(2)}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                    Based on followers
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsCharts;