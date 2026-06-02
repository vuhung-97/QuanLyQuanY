import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0B3B60',
      dark: '#06253D',
    },
    secondary: {
      main: '#00B4D8',
    },
    success: {
      main: '#10B981',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    background: {
      default: '#F4F7F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A202C',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h1: {
      fontSize: 24,
      fontWeight: 700,
    },
    h2: {
      fontSize: 18,
      fontWeight: 600,
    },
    body1: {
      fontSize: 14,
    },
    caption: {
      fontSize: 12,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});
