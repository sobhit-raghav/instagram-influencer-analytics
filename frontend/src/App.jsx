import { ThemeProvider, CssBaseline } from '@mui/material';
import InfluencerPage from './pages/InfluencerPage';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <InfluencerPage />
    </ThemeProvider>
  );
}

export default App;