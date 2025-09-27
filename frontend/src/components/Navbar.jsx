import { useState } from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Navbar = ({ onSearch, isLoading }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <AppBar position="static" sx={{ background: '#1e1e1e', boxShadow: 'none', borderBottom: '1px solid #333' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Influencer Analytics
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
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
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" disabled={isLoading || !username.trim()}>
            {isLoading ? 'Loading...' : 'Search'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;