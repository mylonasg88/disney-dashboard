import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { disneyApi, DisneyCharacter } from '../../services/disneyApi';

interface CharactersState {
  characters: DisneyCharacter[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  loading: boolean;
  backgroundLoading: boolean;
  error: string | null;
  searchTerm: string;
  tvShowFilter: string;
  sortBy: 'name' | null;
  sortOrder: 'asc' | 'desc';
  selectedCharacter: DisneyCharacter | null;
}

const initialState: CharactersState = {
  characters: [],
  currentPage: 1,
  pageSize: 50,
  totalCount: 0,
  loading: false,
  backgroundLoading: false,
  error: null,
  searchTerm: '',
  tvShowFilter: '',
  sortBy: null,
  sortOrder: 'asc',
  selectedCharacter: null,
};

// Helper function to normalize characters
const normalizeCharacter = (char: DisneyCharacter): DisneyCharacter => ({
  ...char,
  tvShows: char.tvShows || [],
  videoGames: char.videoGames || [],
  allies: char.allies || [],
  enemies: char.enemies || [],
  films: char.films || [],
  imageUrl: char.imageUrl || char.url,
});

// Fetch first page only (for initial display)
export const fetchFirstPage = createAsyncThunk(
  'characters/fetchFirstPage',
  async (pageSize: number = 50) => {
    const response = await disneyApi.getCharacters(1, pageSize);
    return response.data.map(normalizeCharacter);
  },
);

// Fetch remaining characters in the background
export const fetchRemainingCharacters = createAsyncThunk<
  DisneyCharacter[],
  void,
  { state: RootState }
>(
  'characters/fetchRemainingCharacters',
  async (_, { getState }) => {
    const state = getState();
    const existingCharacters = state.characters.characters;

    // Start from page 2 if we already have page 1
    const startPage = existingCharacters.length > 0 ? 2 : 1;
    const allCharacters: DisneyCharacter[] = [...existingCharacters];
    let page = startPage;
    let hasMore = true;
    const maxPages = 100; // Safety limit

    while (hasMore && page <= maxPages) {
      const response = await disneyApi.getCharacters(page, 50);
      const normalizedChars = response.data.map(normalizeCharacter);
      allCharacters.push(...normalizedChars);

      if (response.nextPage) {
        page++;
      } else {
        hasMore = false;
      }
    }

    return allCharacters;
  },
);

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setTvShowFilter: (state, action: PayloadAction<string>) => {
      state.tvShowFilter = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action: PayloadAction<'name' | null>) => {
      if (state.sortBy === action.payload) {
        state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = action.payload;
        state.sortOrder = 'asc';
      }
    },
    setSelectedCharacter: (state, action: PayloadAction<DisneyCharacter | null>) => {
      state.selectedCharacter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // First page loading
      .addCase(fetchFirstPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFirstPage.fulfilled, (state, action) => {
        state.loading = false;
        state.characters = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchFirstPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch characters';
      })
      // Background loading for remaining characters
      .addCase(fetchRemainingCharacters.pending, (state) => {
        state.backgroundLoading = true;
      })
      .addCase(fetchRemainingCharacters.fulfilled, (state, action) => {
        state.backgroundLoading = false;
        state.characters = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchRemainingCharacters.rejected, (state) => {
        state.backgroundLoading = false;
        // Don't set error for background loading failures - they're non-critical
      });
  },
});

export const {
  setPageSize,
  setCurrentPage,
  setSearchTerm,
  setTvShowFilter,
  setSortBy,
  setSelectedCharacter,
} = charactersSlice.actions;

export default charactersSlice.reducer;

