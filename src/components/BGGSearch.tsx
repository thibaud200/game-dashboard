import React, { useState, useEffect } from 'react';
import { Search, CircleNotch, ExternalLink } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { bggApiService, BGGSearchResult, BGGGame } from '@/services/bggApi';
import log from "loglevel";

interface BGGSearchProps {
  onGameSelect: (game: BGGGame) => void
  onClose: () => void
}

export default function BGGSearch({ onGameSelect, onClose }: BGGSearchProps) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BGGSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchError('');
    
    try {
      const results = await bggApiService.searchGames(query.trim());
      setSearchResults(results);
    } catch (error) {
      setSearchError('Failed to search BoardGameGeek. Please try again.');
      log.error('BGG Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGameSelect = async (result: BGGSearchResult) => {
    setIsLoadingDetails(true);
    
    try {
      const gameDetails = await bggApiService.getGameDetails(result.id);
      if (gameDetails) {
        onGameSelect(gameDetails);
        onClose();
      } else {
        setSearchError('Failed to load game details. Please try again.');
      }
    } catch (error) {
      setSearchError('Failed to load game details. Please try again.');
      log.error('BGG Details error:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search BoardGameGeek..."
            className="pl-10 bg-slate-700 border-slate-600 text-white"
            disabled={isSearching || isLoadingDetails}
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching || isLoadingDetails || !query.trim()}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {isSearching ? (
            <CircleNotch className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      {searchError && (
        <div className="text-red-400 text-sm p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          {searchError}
        </div>
      )}

      {isLoadingDetails && (
        <div className="flex items-center justify-center py-8">
          <CircleNotch className="w-6 h-6 animate-spin text-teal-400" />
          <span className="ml-2 text-white/60">Loading game details...</span>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {searchResults.map((result) => (
          <Card 
            key={result.id} 
            className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all cursor-pointer"
            onClick={() => handleGameSelect(result)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white">{result.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {result.year_published > 0 && (
                      <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                        {result.year_published}
                      </Badge>
                    )}
                    <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                      {result.type}
                    </Badge>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/40" />
              </div>
            </CardContent>
          </Card>
        ))}
        
        {searchResults.length === 0 && query && !isSearching && (
          <div className="text-center py-8 text-white/60">
            No games found. Try a different search term.
          </div>
        )}
      </div>

      <div className="text-xs text-white/40 text-center">
        Data from BoardGameGeek.com
      </div>
    </div>
  );
}