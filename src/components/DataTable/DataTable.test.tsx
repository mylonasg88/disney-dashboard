import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DataTable from './DataTable';
import charactersReducer from '../../store/slices/charactersSlice';
import { DisneyCharacter } from '../../services/disneyApi';
import '../../test/setup';

const mockCharacters: DisneyCharacter[] = [
  {
    _id: 1,
    name: 'Mickey Mouse',
    tvShows: ['Mickey Mouse Clubhouse', 'The Mickey Mouse Club'],
    videoGames: ['Kingdom Hearts'],
    allies: ['Donald Duck', 'Goofy'],
    enemies: ['Pete'],
    films: ['Steamboat Willie', 'Fantasia'],
  },
  {
    _id: 2,
    name: 'Donald Duck',
    tvShows: ['DuckTales'],
    videoGames: ['Kingdom Hearts'],
    allies: ['Mickey Mouse'],
    enemies: [],
    films: ['Donald Duck'],
  },
];

const createMockStore = (initialState = {}) => configureStore({
  reducer: {
    characters: charactersReducer,
  },
  preloadedState: {
    characters: {
      characters: mockCharacters,
      currentPage: 1,
      pageSize: 50,
      totalCount: 2,
      loading: false,
      error: null,
      searchTerm: '',
      tvShowFilter: '',
      sortBy: null,
      sortOrder: 'asc' as const,
      selectedCharacter: null,
      ...initialState,
    },
  },
});

describe('DataTable', () => {
  it('renders table with character data', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <DataTable />
      </Provider>,
    );

    expect(screen.getByText('Mickey Mouse')).toBeInTheDocument();
    expect(screen.getByText('Donald Duck')).toBeInTheDocument();
  });

  it('handles search input', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <DataTable />
      </Provider>,
    );

    const searchInput = screen.getByLabelText(/search characters/i);
    fireEvent.change(searchInput, { target: { value: 'Mickey' } });

    expect(searchInput).toHaveValue('Mickey');
  });

  it('handles row click to select character', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <DataTable />
      </Provider>,
    );

    const row = screen.getByText('Mickey Mouse').closest('tr');
    if (row) {
      fireEvent.click(row);
      const state = store.getState();
      expect(state.characters.selectedCharacter?.name).toBe('Mickey Mouse');
    }
  });
});

