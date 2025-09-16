import { bggApiService } from '@/services/bggApi';

// Simple test function for BGG API
export const testBGGApi = async () => {
  try {
    // BGG API test functionality would go here
    const searchResults = await bggApiService.searchGames('Wingspan');

    if (searchResults.length > 0) {
      const gameDetails = await bggApiService.getGameDetails(searchResults[0].id);
      return gameDetails;
    }
  } catch (error) {
    // Error handling would use proper logging in production
    throw error;
  }
};

export default testBGGApi;