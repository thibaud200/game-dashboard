import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock handlers pour BGG API
export const handlers = [
  // Mock BGG API via allorigins - intercepter TOUS les appels à cette URL
  http.get('https://api.allorigins.win/raw', ({ request }) => {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');
    
    // Toujours retourner Wingspan pour les tests
    if (targetUrl && targetUrl.includes('xmlapi2/search')) {
      return HttpResponse.text(`
        <?xml version="1.0" encoding="utf-8"?>
        <items total="1" termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">
          <item type="boardgame" id="266192">
            <name type="primary" value="Wingspan"/>
          </item>
        </items>
      `);
    }
    
    if (targetUrl && targetUrl.includes('xmlapi2/thing')) {
      return HttpResponse.text(`
        <?xml version="1.0" encoding="utf-8"?>
        <items termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">
          <item type="boardgame" id="266192">
            <thumbnail>https://cf.geekdo-images.com/test.jpg</thumbnail>
            <image>https://cf.geekdo-images.com/test-large.jpg</image>
            <name type="primary" value="Wingspan"/>
            <description>Wingspan is a competitive, medium-weight, card-driven, engine-building board game.</description>
            <yearpublished value="2019"/>
            <minplayers value="1"/>
            <maxplayers value="5"/>
            <playingtime value="70"/>
            <minplaytime value="40"/>
            <maxplaytime value="70"/>
            <minage value="10"/>
            <link type="boardgamecategory" id="1089" value="Animals"/>
            <link type="boardgamemechanic" id="2001" value="Action Retrieval"/>
            <statistics>
              <ratings>
                <average value="8.1"/>
                <averageweight value="2.44"/>
              </ratings>
            </statistics>
          </item>
        </items>
      `);
    }
    
    // Default fallback
    return HttpResponse.text(`
      <?xml version="1.0" encoding="utf-8"?>
      <items total="0" termsofuse="https://boardgamegeek.com/xmlapi/termsofuse">
      </items>
    `);
  }),

  // Mock API locale pour les tests
  http.get('http://localhost:3001/api/players', () => {
    return HttpResponse.json([
      { id: 1, name: 'Alice', email: 'alice@test.com' },
      { id: 2, name: 'Bob', email: 'bob@test.com' }
    ]);
  }),

  http.get('http://localhost:3001/api/games', () => {
    return HttpResponse.json([
      { id: 1, name: 'Wingspan', bgg_id: 266192, min_players: 1, max_players: 5 }
    ]);
  })
];

// Setup server avec les handlers
export const server = setupServer(...handlers);