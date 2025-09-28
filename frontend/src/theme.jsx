import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5299FF',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F06292',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0D1117',
      paper: '#161B22',
    },
    text: {
      primary: '#E6EDF3',
      secondary: '#8B949E',
    },
    error: {
      main: '#F85149',
    },
    warning: {
      main: '#F0B429',
    },
    info: {
      main: '#58A6FF',
    },
    success: {
      main: '#3FB950',
    },
    divider: '#30363D',
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, color: '#E6EDF3' },
    h2: { fontWeight: 700, color: '#E6EDF3' },
    h3: { fontWeight: 600, color: '#E6EDF3' },
    h4: { fontWeight: 600, color: '#E6EDF3' },
    h5: { fontWeight: 500, color: '#C9D1D9' },
    h6: { fontWeight: 500, color: '#C9D1D9' },
    body1: { color: '#E6EDF3' },
    body2: { color: '#8B949E' },
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #30363D',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          backgroundColor: '#161B22',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 500,
          letterSpacing: 0.2,
        },
        containedPrimary: {
          backgroundColor: '#5299FF',
          '&:hover': { backgroundColor: '#4178CC' },
        },
        containedSecondary: {
          backgroundColor: '#F06292',
          '&:hover': { backgroundColor: '#D81B60' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          backgroundColor: '#21262D',
          color: '#E6EDF3',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#161B22',
          borderBottom: '1px solid #30363D',
        },
      },
    },
  },
});

export default theme;