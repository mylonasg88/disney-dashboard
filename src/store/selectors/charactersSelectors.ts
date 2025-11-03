import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Base selectors
const selectCharactersState = (state: RootState) => state.characters;
const selectCharacters = (state: RootState) => state.characters.characters;
const selectSearchTerm = (state: RootState) => state.characters.searchTerm;
const selectTvShowFilter = (state: RootState) => state.characters.tvShowFilter;
const selectSortBy = (state: RootState) => state.characters.sortBy;
const selectSortOrder = (state: RootState) => state.characters.sortOrder;

// Memoized selector for filtered and sorted characters
export const selectFilteredCharacters = createSelector(
  [selectCharacters, selectSearchTerm, selectTvShowFilter, selectSortBy, selectSortOrder],
  (characters, searchTerm, tvShowFilter, sortBy, sortOrder) => {
    let filtered = [...characters];

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((char) =>
        char.name?.toLowerCase().includes(lowerSearchTerm),
      );
    }

    // Apply TV show filter
    if (tvShowFilter) {
      const lowerTvShowFilter = tvShowFilter.toLowerCase();
      filtered = filtered.filter((char) =>
        char.tvShows?.some((show) =>
          show?.toLowerCase().includes(lowerTvShowFilter),
        ),
      );
    }

    // Apply sorting
    if (sortBy === 'name') {
      filtered.sort((a, b) => {
        const nameA = a.name || '';
        const nameB = b.name || '';
        const comparison = nameA.localeCompare(nameB);
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  },
);

// Memoized selector for paginated characters
export const selectPaginatedCharacters = createSelector(
  [
    selectFilteredCharacters,
    (state: RootState) => state.characters.currentPage,
    (state: RootState) => state.characters.pageSize,
  ],
  (filteredCharacters, currentPage, pageSize) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCharacters.slice(startIndex, endIndex);
  },
);

// Memoized selector for filtered characters count
export const selectFilteredCharactersCount = createSelector(
  [selectFilteredCharacters],
  (filteredCharacters) => filteredCharacters.length,
);

// Memoized selector for total pages
export const selectTotalPages = createSelector(
  [selectFilteredCharacters, (state: RootState) => state.characters.pageSize],
  (filteredCharacters, pageSize) => Math.ceil(filteredCharacters.length / pageSize),
);

// Memoized selector for unique TV shows (extracted from filtered characters)
export const selectUniqueTvShows = createSelector(
  [selectFilteredCharacters],
  (filteredCharacters) => {
    const shows = new Set<string>();
    filteredCharacters.forEach((char) => {
      char.tvShows?.forEach((show) => {
        if (show) {shows.add(show);}
      });
    });
    return Array.from(shows).sort();
  },
);

// Export all character state selectors
export const selectCharactersStateData = createSelector(
  [selectCharactersState],
  (charactersState) => ({
    loading: charactersState.loading,
    error: charactersState.error,
    currentPage: charactersState.currentPage,
    pageSize: charactersState.pageSize,
    totalCount: charactersState.totalCount,
    searchTerm: charactersState.searchTerm,
    tvShowFilter: charactersState.tvShowFilter,
    sortBy: charactersState.sortBy,
    sortOrder: charactersState.sortOrder,
    selectedCharacter: charactersState.selectedCharacter,
  }),
);

