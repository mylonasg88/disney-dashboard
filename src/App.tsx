import React, { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { store } from './store/store';
import { theme } from './theme';

const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));

const App: React.FC = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense
        fallback={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <Dashboard />
      </Suspense>
    </ThemeProvider>
  </Provider>
);

export default App;

