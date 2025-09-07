import { bggApiService } from '@/services/bggApi';

// Simple test function for BGG API
export const testBGGApi = async () => {
  try {
    console.info('Testing BGG API...');
    
    // Test search
    const searchResults = await bggApiService.searchGames('Wingspan');
    console.info('Search results:', searchResults);

    if (searchResults.length > 0) {
      // Test game details
      const gameDetails = await bggApiService.getGameDetails(searchResults[0].id);
      console.info('Game details:', gameDetails);
    }
  } catch (error) {
    console.error('BGG API test failed:', error);
  }
};

export default testBGGApi;