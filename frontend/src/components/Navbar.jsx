import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  InputAdornment, 
  IconButton,
  Container,
  useMediaQuery,
  useTheme,
  Fade,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import InstagramIcon from '@mui/icons-material/Instagram';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Navbar = ({ onSearch, isLoading }) => {
  const [username, setUsername] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim().replace('@', '');
    if (trimmed) onSearch(trimmed);
  };

  const handleClear = () => {
    setUsername('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && username.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(21, 27, 35, 0.85)',
        backdropFilter: 'blur(12px) saturate(180%)',
        borderBottom: '1px solid rgba(48, 54, 61, 0.6)',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters
          sx={{ 
            minHeight: { xs: '64px', sm: '70px' },
            py: 1,
            gap: { xs: 2, sm: 3 },
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            justifyContent: 'space-between',
          }}
        >
          {/* Logo & Brand */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'rotate(5deg) scale(1.05)',
                },
              }}
            >
              <TrendingUpIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                Influencer Analytics
              </Typography>
              {!isMobile && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  Instagram Insights
                </Typography>
              )}
            </Box>
          </Box>

          {/* Search Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5 },
              ml: 'auto',
              maxWidth: { xs: '100%', sm: '450px', md: '520px' },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <TextField
              fullWidth
              label={isMobile ? "Username" : "Instagram Username"}
              variant="outlined"
              size="small"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="e.g., cristiano or @mrbeast"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InstagramIcon 
                      sx={{ 
                        color: isFocused ? 'primary.main' : 'action.active',
                        transition: 'color 0.3s ease',
                      }} 
                    />
                  </InputAdornment>
                ),
                endAdornment: username && (
                  <Fade in={!!username}>
                    <InputAdornment position="end">
                      <Tooltip title="Clear" arrow>
                        <IconButton
                          size="small"
                          onClick={handleClear}
                          edge="end"
                          disabled={isLoading}
                          sx={{
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              color: 'error.main',
                              backgroundColor: 'rgba(248, 81, 73, 0.1)',
                            },
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  </Fade>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isFocused 
                    ? 'rgba(82, 153, 255, 0.05)' 
                    : 'rgba(13, 17, 23, 0.5)',
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: isFocused ? 'primary.main' : '#30363D',
                    borderWidth: isFocused ? '2px' : '1.5px',
                  },
                  '&:hover fieldset': {
                    borderColor: isFocused ? 'primary.main' : '#8B949E',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading || !username.trim()}
              startIcon={!isLoading && <SearchIcon />}
              sx={{ 
                whiteSpace: 'nowrap',
                minWidth: { xs: 'auto', sm: 120 },
                px: { xs: 2, sm: 3 },
                height: 42,
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                fontWeight: 600,
                boxShadow: username.trim() && !isLoading 
                  ? '0 4px 14px rgba(82, 153, 255, 0.4)' 
                  : 'none',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.5s ease',
                },
                '&:hover::before': {
                  left: '100%',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(82, 153, 255, 0.12)',
                  color: 'rgba(230, 237, 243, 0.3)',
                },
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                  {!isMobile && <span>Searching...</span>}
                </Box>
              ) : (
                <span>{isMobile ? 'Search' : 'Analyze'}</span>
              )}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;