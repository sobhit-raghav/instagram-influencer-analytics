import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5299FF',
      light: '#7AB4FF',
      dark: '#3D7FE6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F06292',
      light: '#FF94BA',
      dark: '#D81B60',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0A0E14',
      paper: '#151B23',
    },
    text: {
      primary: '#E6EDF3',
      secondary: '#8B949E',
      disabled: '#6E7681',
    },
    error: {
      main: '#F85149',
      light: '#FF7B72',
      dark: '#DA3633',
    },
    warning: {
      main: '#F0B429',
      light: '#FFC940',
      dark: '#D29922',
    },
    info: {
      main: '#58A6FF',
      light: '#79C0FF',
      dark: '#388BFD',
    },
    success: {
      main: '#3FB950',
      light: '#56D364',
      dark: '#2EA043',
    },
    divider: '#30363D',
    action: {
      hover: 'rgba(177, 186, 196, 0.12)',
      selected: 'rgba(177, 186, 196, 0.16)',
      disabled: 'rgba(139, 148, 158, 0.3)',
      disabledBackground: 'rgba(139, 148, 158, 0.12)',
    },
  },

  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { 
      fontWeight: 800, 
      color: '#E6EDF3',
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: { 
      fontWeight: 700, 
      color: '#E6EDF3',
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: { 
      fontWeight: 700, 
      color: '#E6EDF3',
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h4: { 
      fontWeight: 600, 
      color: '#E6EDF3',
      lineHeight: 1.4,
    },
    h5: { 
      fontWeight: 600, 
      color: '#C9D1D9',
      lineHeight: 1.4,
    },
    h6: { 
      fontWeight: 600, 
      color: '#C9D1D9',
      lineHeight: 1.5,
    },
    body1: { 
      color: '#E6EDF3',
      lineHeight: 1.6,
    },
    body2: { 
      color: '#8B949E',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
  },

  shape: {
    borderRadius: 12,
  },

  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.3)',
    '0 2px 6px rgba(0, 0, 0, 0.35)',
    '0 4px 12px rgba(0, 0, 0, 0.4)',
    '0 6px 16px rgba(0, 0, 0, 0.45)',
    '0 8px 24px rgba(0, 0, 0, 0.5)',
    '0 12px 32px rgba(0, 0, 0, 0.55)',
    '0 16px 40px rgba(0, 0, 0, 0.6)',
    '0 20px 48px rgba(0, 0, 0, 0.65)',
    '0 1px 3px rgba(0, 0, 0, 0.3)',
    '0 2px 6px rgba(0, 0, 0, 0.35)',
    '0 4px 12px rgba(0, 0, 0, 0.4)',
    '0 6px 16px rgba(0, 0, 0, 0.45)',
    '0 8px 24px rgba(0, 0, 0, 0.5)',
    '0 12px 32px rgba(0, 0, 0, 0.55)',
    '0 16px 40px rgba(0, 0, 0, 0.6)',
    '0 20px 48px rgba(0, 0, 0, 0.65)',
    '0 24px 56px rgba(0, 0, 0, 0.7)',
    '0 28px 64px rgba(0, 0, 0, 0.75)',
    '0 32px 72px rgba(0, 0, 0, 0.8)',
    '0 36px 80px rgba(0, 0, 0, 0.85)',
    '0 40px 88px rgba(0, 0, 0, 0.9)',
    '0 44px 96px rgba(0, 0, 0, 0.95)',
    '0 48px 104px rgba(0, 0, 0, 1)',
    '0 52px 112px rgba(0, 0, 0, 1)',
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
          '::-webkit-scrollbar': {
            width: '10px',
            height: '10px',
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#484F58',
            borderRadius: '6px',
            border: '2px solid #0A0E14',
            '&:hover': {
              backgroundColor: '#6E7681',
            },
            '&:active': {
              backgroundColor: '#8B949E',
            },
          },
          '::-webkit-scrollbar-track': {
            backgroundColor: '#161B22',
            borderRadius: '6px',
          },
          '::-webkit-scrollbar-corner': {
            backgroundColor: '#161B22',
          },
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#484F58 #161B22',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(48, 54, 61, 0.6)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          backgroundColor: '#151B23',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(82, 153, 255, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#151B23',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
        },
        elevation3: {
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.02em',
          padding: '8px 20px',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        containedPrimary: {
          backgroundColor: '#5299FF',
          boxShadow: '0 4px 12px rgba(82, 153, 255, 0.3)',
          '&:hover': { 
            backgroundColor: '#3D7FE6',
            boxShadow: '0 6px 20px rgba(82, 153, 255, 0.4)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            boxShadow: '0 2px 8px rgba(82, 153, 255, 0.3)',
          },
        },
        containedSecondary: {
          backgroundColor: '#F06292',
          boxShadow: '0 4px 12px rgba(240, 98, 146, 0.3)',
          '&:hover': { 
            backgroundColor: '#D81B60',
            boxShadow: '0 6px 20px rgba(240, 98, 146, 0.4)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            boxShadow: '0 2px 8px rgba(240, 98, 146, 0.3)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            transform: 'translateY(-2px)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(177, 186, 196, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(13, 17, 23, 0.5)',
            transition: 'all 0.25s ease',
            '& fieldset': {
              borderColor: '#30363D',
              borderWidth: '1.5px',
              transition: 'border-color 0.25s ease',
            },
            '&:hover fieldset': {
              borderColor: '#8B949E',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(13, 17, 23, 0.7)',
              '& fieldset': {
                borderColor: '#5299FF',
                borderWidth: '2px',
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: '#8B949E',
            '&.Mui-focused': {
              color: '#5299FF',
              fontWeight: 500,
            },
          },
          '& .MuiInputBase-input': {
            color: '#E6EDF3',
            '&::placeholder': {
              color: '#6E7681',
              opacity: 1,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.8125rem',
          backgroundColor: 'rgba(82, 153, 255, 0.12)',
          color: '#7AB4FF',
          border: '1px solid rgba(82, 153, 255, 0.2)',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(82, 153, 255, 0.18)',
            borderColor: 'rgba(82, 153, 255, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
        colorSecondary: {
          backgroundColor: 'rgba(240, 98, 146, 0.12)',
          color: '#FF94BA',
          borderColor: 'rgba(240, 98, 146, 0.2)',
          '&:hover': {
            backgroundColor: 'rgba(240, 98, 146, 0.18)',
            borderColor: 'rgba(240, 98, 146, 0.3)',
          },
        },
        outlined: {
          backgroundColor: 'transparent',
          borderColor: 'rgba(139, 148, 158, 0.3)',
          '&:hover': {
            backgroundColor: 'rgba(139, 148, 158, 0.08)',
            borderColor: 'rgba(139, 148, 158, 0.5)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(21, 27, 35, 0.85)',
          backdropFilter: 'blur(12px) saturate(180%)',
          borderBottom: '1px solid rgba(48, 54, 61, 0.6)',
          boxShadow: '0 2px 16px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px !important',
          padding: '0 24px',
          '@media (min-width: 600px)': {
            minHeight: '68px !important',
            padding: '0 32px',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '3px solid rgba(82, 153, 255, 0.3)',
          boxShadow: '0 4px 16px rgba(82, 153, 255, 0.2)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(48, 54, 61, 0.6)',
          opacity: 1,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid',
        },
        standardError: {
          backgroundColor: 'rgba(248, 81, 73, 0.12)',
          borderColor: 'rgba(248, 81, 73, 0.3)',
          color: '#FF7B72',
        },
        standardWarning: {
          backgroundColor: 'rgba(240, 180, 41, 0.12)',
          borderColor: 'rgba(240, 180, 41, 0.3)',
          color: '#FFC940',
        },
        standardInfo: {
          backgroundColor: 'rgba(88, 166, 255, 0.12)',
          borderColor: 'rgba(88, 166, 255, 0.3)',
          color: '#79C0FF',
        },
        standardSuccess: {
          backgroundColor: 'rgba(63, 185, 80, 0.12)',
          borderColor: 'rgba(63, 185, 80, 0.3)',
          color: '#56D364',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#5299FF',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: 'rgba(48, 54, 61, 0.6)',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(21, 27, 35, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(48, 54, 61, 0.6)',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: '0.8125rem',
          fontWeight: 500,
        },
        arrow: {
          color: 'rgba(21, 27, 35, 0.95)',
          '&::before': {
            border: '1px solid rgba(48, 54, 61, 0.6)',
          },
        },
      },
    },
  },

  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
});

export default theme;