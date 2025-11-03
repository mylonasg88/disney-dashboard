import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  SortByAlpha as SortIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  setPageSize,
  setCurrentPage,
  setSearchTerm,
  setTvShowFilter,
  setSortBy,
  setSelectedCharacter,
} from '../../store/slices/charactersSlice';
import {
  selectPaginatedCharacters,
  selectUniqueTvShows,
  selectFilteredCharactersCount,
} from '../../store/selectors/charactersSelectors';
import { DisneyCharacter } from '../../services/disneyApi';

const DataTable: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const {
    currentPage,
    pageSize,
    searchTerm,
    tvShowFilter,
    sortBy,
    sortOrder,
  } = useAppSelector((state) => state.characters);

  const paginatedCharacters = useAppSelector(selectPaginatedCharacters);
  const uniqueTvShows = useAppSelector(selectUniqueTvShows);
  const filteredCharactersCount = useAppSelector(selectFilteredCharactersCount);

  const handleRowClick = (character: DisneyCharacter) => {
    dispatch(setSelectedCharacter(character));
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    dispatch(setCurrentPage(newPage + 1));
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(setPageSize(Number(event.target.value)));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const handleTvShowFilterChange = (event: { target: { value: unknown } }) => {
    dispatch(setTvShowFilter((event.target.value as string) || ''));
  };

  const handleSort = () => {
    dispatch(setSortBy('name'));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Search Characters"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
          sx={{ minWidth: 250 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by TV Show</InputLabel>
          <Select
            value={tvShowFilter}
            label="Filter by TV Show"
            onChange={handleTvShowFilterChange}
            startAdornment={<FilterIcon sx={{ mr: 1, color: 'action.active' }} />}
          >
            <MenuItem value="">All TV Shows</MenuItem>
            {uniqueTvShows.map((show) => (
              <MenuItem key={show} value={show}>
                {show}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title={`Sort by name (${sortOrder === 'asc' ? 'Ascending' : 'Descending'})`}>
          <IconButton onClick={handleSort} color={sortBy === 'name' ? 'primary' : 'default'}>
            <SortIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
        <Table stickyHeader aria-label="disney characters table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Character Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">
                TV Shows Count
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">
                Video Games Count
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Allies</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Enemies</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCharacters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No characters found
                </TableCell>
              </TableRow>
            ) : (
              paginatedCharacters.map((character) => (
                <TableRow
                  key={character._id}
                  hover
                  onClick={() => handleRowClick(character)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component="th" scope="row">
                    {character.name || 'N/A'}
                  </TableCell>
                  <TableCell align="center">
                    {character.tvShows?.length || 0}
                  </TableCell>
                  <TableCell align="center">
                    {character.videoGames?.length || 0}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {character.allies && character.allies.length > 0 ? (
                        character.allies.slice(0, 3).map((ally) => (
                          <Chip key={`${character._id}-ally-${ally}`} label={ally} size="small" variant="outlined" />
                        ))
                      ) : (
                        <Chip label="None" size="small" variant="outlined" color="default" />
                      )}
                      {character.allies && character.allies.length > 3 && (
                        <Chip
                          label={`+${character.allies.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {character.enemies && character.enemies.length > 0 ? (
                        character.enemies.slice(0, 3).map((enemy) => (
                          <Chip
                            key={`${character._id}-enemy-${enemy}`}
                            label={enemy}
                            size="small"
                            variant="outlined"
                            color="error"
                          />
                        ))
                      ) : (
                        <Chip label="None" size="small" variant="outlined" color="default" />
                      )}
                      {character.enemies && character.enemies.length > 3 && (
                        <Chip
                          label={`+${character.enemies.length - 3}`}
                          size="small"
                          variant="outlined"
                          color="error"
                        />
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredCharactersCount}
        page={currentPage - 1}
        onPageChange={handlePageChange}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handlePageSizeChange}
        rowsPerPageOptions={[10, 20, 50, 100, 200, 500]}
        labelRowsPerPage="Characters per page:"
      />
    </Box>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;

