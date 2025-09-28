import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1e88e5', 
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff4081', 
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e2f',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#9e9e9e',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ffb300',
    },
    info: {
      main: '#29b6f6',
    },
    success: {
      main: '#66bb6a',
    },
  },

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    body1: { color: '#e0e0e0' },
    body2: { color: '#b0bec5' },
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #2c2c3f',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
          backgroundColor: '#1e1e2f',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
        },
        containedPrimary: {
          backgroundColor: '#1e88e5',
          '&:hover': { backgroundColor: '#1565c0' },
        },
        containedSecondary: {
          backgroundColor: '#ff4081',
          '&:hover': { backgroundColor: '#f50057' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;