import { bggApiService } from '@/services/bggApi';
import log from "loglevel";

// Simple test function for BGG API
export const testBGGApi = async () => {
  try {
    log.info('Testing BGG API...');
    
    // Test search
    const searchResults = await bggApiService.searchGames('Wingspan');
    log.info('Search results:', searchResults);

    if (searchResults.length > 0) {
      // Test game details
      const gameDetails = await bggApiService.getGameDetails(searchResults[0].id);
      log.info('Game details:', gameDetails);
    }
  } catch (error) {
    log.error('BGG API test failed:', error);
  }
};

export default testBGGApi;