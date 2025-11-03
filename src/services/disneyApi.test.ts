import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { disneyApi } from './disneyApi';
import type { Mock } from 'vitest';

vi.mock('axios');
const mockedAxios = axios as unknown as Mock<typeof axios>;

describe('disneyApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCharacters', () => {
    it('should fetch characters with pagination', async () => {
      const mockResponse = {
        data: {
          data: [
            { _id: 1, name: 'Mickey Mouse', tvShows: [], videoGames: [], allies: [], enemies: [], films: [] },
          ],
          count: 1,
          totalPages: 1,
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await disneyApi.getCharacters(1, 50);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.disneyapi.dev/character',
        { params: { page: 1, pageSize: 50 } },
      );
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Mickey Mouse');
    });

    it('should handle errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(disneyApi.getCharacters(1, 50)).rejects.toThrow();
    });
  });

  describe('getCharacterById', () => {
    it('should fetch a single character by id', async () => {
      const mockResponse = {
        data: {
          data: {
            _id: 1,
            name: 'Mickey Mouse',
            tvShows: [],
            videoGames: [],
            allies: [],
            enemies: [],
            films: [],
          },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await disneyApi.getCharacterById(1);

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.disneyapi.dev/character/1');
      expect(result.name).toBe('Mickey Mouse');
    });
  });
});

