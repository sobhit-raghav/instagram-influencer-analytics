import { useState } from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Navbar = ({ onSearch, isLoading }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'background.paper', borderBottom: '1px solid #333', boxShadow: 'none' }}>
      <Toolbar sx={{ flexWrap: 'wrap', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Influencer Analytics
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, maxWidth: 400, gap: 1 }}>
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