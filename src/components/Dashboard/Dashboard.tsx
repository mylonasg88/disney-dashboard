import React, { useEffect } from 'react';
import { Container, Box, Typography, Paper, Chip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchFirstPage,
  fetchRemainingCharacters,
} from '../../store/slices/charactersSlice';
import { selectFilteredCharactersCount } from '../../store/selectors/charactersSelectors';
import DataTable from '../DataTable/DataTable';
import CharacterModal from '../CharacterModal/CharacterModal';
import PieChart from '../PieChart/PieChart';
import Loader from '../Loader/Loader';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, backgroundLoading, characters, pageSize } = useAppSelector(
    (state) => state.characters,
  );
  const filteredCharactersCount = useAppSelector(selectFilteredCharactersCount);

  // Fetch first page on mount
  useEffect(() => {
    if (characters.length === 0) {
      dispatch(fetchFirstPage(pageSize));
    }
  }, [dispatch, characters.length, pageSize]);

  // Start background loading after first page is loaded
  useEffect(() => {
    // Start background loading if:
    // 1. Initial loading is complete
    // 2. We have characters (first page loaded)
    // 3. Background loading hasn't started yet
    // 4. We have exactly one page worth of data (indicating we haven't loaded all yet)
    const hasFirstPageOnly =
      characters.length > 0 && characters.length <= pageSize;
    const shouldLoadRemaining =
      !loading && hasFirstPageOnly && !backgroundLoading;

    if (shouldLoadRemaining) {
      dispatch(fetchRemainingCharacters());
    }
  }, [dispatch, loading, characters.length, pageSize, backgroundLoading]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {backgroundLoading && <Loader />}

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{ color: 'white', fontWeight: 'bold' }}
          >
            Disney Characters Dashboard
          </Typography>
          <Chip
            label={`${filteredCharactersCount} Characters`}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold',
              height: 40,
            }}
          />
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary">
            Loading characters...
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <PieChart />
          </Box>
          <Box sx={{ mb: 4 }}>
            <DataTable />
          </Box>
        </>
      )}

      <CharacterModal />
    </Container>
  );
};

export default Dashboard;
