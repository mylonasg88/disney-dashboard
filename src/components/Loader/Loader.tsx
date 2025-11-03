import { Box, LinearProgress } from '@mui/material';

export const Loader = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1300,
      height: 4,
    }}
  >
    <LinearProgress
      sx={{
        height: 4,
        '& .MuiLinearProgress-bar': {
          transition: 'transform 0.2s linear',
        },
      }}
    />
  </Box>
);

export default Loader;
