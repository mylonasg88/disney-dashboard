import axios from 'axios';

export interface DisneyCharacter {
  _id: number;
  name: string;
  imageUrl?: string;
  url?: string;
  tvShows?: string[];
  videoGames?: string[];
  allies?: string[];
  enemies?: string[];
  films?: string[];
}

export interface DisneyApiResponse {
  data: DisneyCharacter[];
  count?: number;
  totalPages?: number;
  nextPage?: string | null;
  previousPage?: string | null;
  info?: {
    nextPage?: string | null;
    previousPage?: string | null;
  };
}

const BASE_URL = 'https://api.disneyapi.dev/character';

export const disneyApi = {
  async getCharacters(page: number = 1, pageSize: number = 50): Promise<DisneyApiResponse> {
    try {
      const response = await axios.get<DisneyApiResponse>(BASE_URL, {
        params: {
          page,
          pageSize,
        },
      });
      // Normalize response - handle both direct data and wrapped formats
      const { data } = response;
      const characters = Array.isArray(data.data)
        ? data.data
        : (Array.isArray(data) ? data : []);
      return {
        data: characters,
        count: data.count,
        totalPages: data.totalPages,
        nextPage: data.nextPage || data.info?.nextPage || null,
        previousPage: data.previousPage || data.info?.previousPage || null,
      };
    } catch (error) {
      console.error('Error fetching Disney characters:', error);
      throw error;
    }
  },

  async getAllCharacters(): Promise<DisneyCharacter[]> {
    try {
      const allCharacters: DisneyCharacter[] = [];
      let page = 1;
      let hasMore = true;
      const maxPages = 100; // Safety limit

      while (hasMore && page <= maxPages) {
        const response = await this.getCharacters(page, 50);
        const normalizedChars = response.data.map((char) => ({
          ...char,
          tvShows: char.tvShows || [],
          videoGames: char.videoGames || [],
          allies: char.allies || [],
          enemies: char.enemies || [],
          films: char.films || [],
          imageUrl: char.imageUrl || char.url,
        }));
        allCharacters.push(...normalizedChars);

        if (response.nextPage) {
          page++;
        } else {
          hasMore = false;
        }
      }

      return allCharacters;
    } catch (error) {
      console.error('Error fetching all Disney characters:', error);
      throw error;
    }
  },

  async getCharacterById(id: number): Promise<DisneyCharacter> {
    try {
      const response = await axios.get<{ data: DisneyCharacter }>(`${BASE_URL}/${id}`);
      const char = response.data.data || response.data;
      return {
        ...char,
        tvShows: char.tvShows || [],
        videoGames: char.videoGames || [],
        allies: char.allies || [],
        enemies: char.enemies || [],
        films: char.films || [],
        imageUrl: char.imageUrl || char.url,
      };
    } catch (error) {
      console.error(`Error fetching character ${id}:`, error);
      throw error;
    }
  },
};

