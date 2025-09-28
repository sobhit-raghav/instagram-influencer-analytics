import { useState } from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Box, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const Navbar = ({ onSearch, isLoading }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed) onSearch(trimmed);
  };

  const handleClear = () => {
    setUsername('');
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ flexWrap: 'wrap', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Influencer Analytics
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            maxWidth: 420,
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            label="Instagram Username"
            variant="outlined"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            placeholder="e.g., mrbeast"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: username && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    edge="end"
                    disabled={isLoading}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading || !username.trim()}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;