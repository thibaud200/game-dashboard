import { bggApiService } from '@/services/bggApi';

// Simple test function for BGG API
export const testBGGApi = async () => {
  // BGG API test functionality would go here
  const searchResults = await bggApiService.searchGames('Wingspan');

  if (searchResults.length > 0) {
    const gameDetails = await bggApiService.getGameDetails(searchResults[0].id);
    return gameDetails;
  }
};

export default testBGGApi;