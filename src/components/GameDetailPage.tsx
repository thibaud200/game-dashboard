import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { ArrowLeft, Users, Clock, Star, Weight, Calendar, Factory, User, Plus, Gamepad2, UserCircle, DotsThreeVertical, Crown } from '@phosphor-icons/react'
import GameExpansionsPage from '@/components/GameExpansionsPage'
import GameCharactersPage from '@/components/GameCharactersPage'

interface Game {
  game_id: number
  bgg_id?: number
  name: string
  description?: string
  image?: string
  min_players: number
  max_players: number
  duration?: string
  difficulty?: string
  category?: string
  year_published?: number
  publisher?: string
  designer?: string
  bgg_rating?: number
  weight?: number
  age_min?: number
  supports_cooperative: boolean
  supports_competitive: boolean
  supports_campaign: boolean
  supports_hybrid: boolean
  has_expansion: boolean
  has_characters: boolean
  created_at: Date
  updated_at?: Date
  expansions: GameExpansion[]
  characters: GameCharacter[]
  players?: string
}

interface GameExpansion {
  expansion_id?: number
  game_id?: number
  bgg_expansion_id?: number
  name: string
  year_published?: number
  description?: string
}

interface GameCharacter {
  character_id?: number
  game_id?: number
  character_key: string
  name: string
  description?: string
  avatar?: string
  abilities?: string[]
}

interface GameDetailPageProps {
  game: Game
  onNavigation: (view: string, gameId?: number) => void
  currentView: string
  onAddExpansion?: (gameId: number, expansionData: any) => Promise<any>
  onUpdateExpansion?: (expansionId: number, expansionData: any) => Promise<any>
  onDeleteExpansion?: (expansionId: number) => Promise<void>
  onAddCharacter?: (gameId: number, characterData: any) => Promise<any>
  onUpdateCharacter?: (characterId: number, characterData: any) => Promise<any>
  onDeleteCharacter?: (characterId: number) => Promise<void>
}

export default function GameDetailPage({ 
  game, 
  onNavigation, 
  currentView,
  onAddExpansion,
  onUpdateExpansion,
  onDeleteExpansion,
  onAddCharacter,
  onUpdateCharacter,
  onDeleteCharacter
}: GameDetailPageProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const gameTypes = []
  if (game.supports_competitive) gameTypes.push('Compétitif')
  if (game.supports_cooperative) gameTypes.push('Coopératif')
  if (game.supports_campaign) gameTypes.push('Campagne')
  if (game.supports_hybrid) gameTypes.push('Hybride')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigation('games')}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux jeux
            </Button>
            <div className="h-6 w-px bg-slate-600"></div>
            <h1 className="text-xl font-semibold text-white flex-1">{game.name}</h1>
            
            {/* Mobile Context Menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                    <DotsThreeVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('overview')}
                    className="hover:bg-slate-700 focus:bg-slate-700"
                  >
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Vue générale
                  </DropdownMenuItem>
                  {game.has_expansion && (
                    <DropdownMenuItem 
                      onClick={() => setActiveTab('expansions')}
                      className="hover:bg-slate-700 focus:bg-slate-700"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Extensions ({game.expansions?.length || 0})
                    </DropdownMenuItem>
                  )}
                  {game.has_characters && (
                    <DropdownMenuItem 
                      onClick={() => setActiveTab('characters')}
                      className="hover:bg-slate-700 focus:bg-slate-700"
                    >
                      <UserCircle className="w-4 h-4 mr-2" />
                      Personnages ({game.characters?.length || 0})
                    </DropdownMenuItem>
                  )}
                  {(!game.has_expansion && !game.has_characters) && (
                    <DropdownMenuItem disabled className="text-slate-400">
                      Aucune section disponible
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Desktop Layout with Tabs */}
        <div className="hidden md:block">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700/50">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-white"
              >
                Vue générale
              </TabsTrigger>
              <TabsTrigger 
                value="expansions" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-white"
                disabled={!game.has_expansion}
              >
                Extensions ({game.expansions?.length || 0})
              </TabsTrigger>
              <TabsTrigger 
                value="characters" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-white"
                disabled={!game.has_characters}
              >
                Personnages ({game.characters?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              {renderGameOverview()}
            </TabsContent>

            <TabsContent value="expansions" className="mt-6">
              {onAddExpansion && onUpdateExpansion && onDeleteExpansion && (
                <GameExpansionsPage
                  game={game}
                  onNavigation={onNavigation}
                  onAddExpansion={onAddExpansion}
                  onUpdateExpansion={onUpdateExpansion}
                  onDeleteExpansion={onDeleteExpansion}
                  embedded={true}
                />
              )}
            </TabsContent>

            <TabsContent value="characters" className="mt-6">
              {onAddCharacter && onUpdateCharacter && onDeleteCharacter && (
                <GameCharactersPage
                  game={game}
                  onNavigation={onNavigation}
                  onAddCharacter={onAddCharacter}
                  onUpdateCharacter={onUpdateCharacter}
                  onDeleteCharacter={onDeleteCharacter}
                  embedded={true}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Mobile Layout - Show current tab content */}
        <div className="md:hidden">
          {activeTab === 'overview' && renderGameOverview()}
          {activeTab === 'expansions' && onAddExpansion && onUpdateExpansion && onDeleteExpansion && (
            <GameExpansionsPage
              game={game}
              onNavigation={onNavigation}
              onAddExpansion={onAddExpansion}
              onUpdateExpansion={onUpdateExpansion}
              onDeleteExpansion={onDeleteExpansion}
              embedded={true}
            />
          )}
          {activeTab === 'characters' && onAddCharacter && onUpdateCharacter && onDeleteCharacter && (
            <GameCharactersPage
              game={game}
              onNavigation={onNavigation}
              onAddCharacter={onAddCharacter}
              onUpdateCharacter={onUpdateCharacter}
              onDeleteCharacter={onDeleteCharacter}
              embedded={true}
            />
          )}
        </div>
      </div>
    </div>
  )

  function renderGameOverview() {
    return (
      <>
        {/* Game Overview Card */}
        <Card className="bg-slate-800/50 border-slate-700/50 mb-8">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Game Image */}
              <div className="flex-shrink-0">
                {game.image ? (
                  <img 
                    src={game.image} 
                    alt={game.name}
                    className="w-32 h-32 object-cover rounded-lg border border-slate-600"
                  />
                ) : (
                  <div className="w-32 h-32 bg-slate-700/50 rounded-lg border border-slate-600 flex items-center justify-center">
                    <Gamepad2 className="w-12 h-12 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Game Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{game.name}</h2>
                    {game.description && (
                      <p className="text-slate-300 mb-4 max-w-2xl">{game.description}</p>
                    )}
                  </div>
                  {game.bgg_rating && (
                    <div className="flex items-center gap-1 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{game.bgg_rating}/10</span>
                    </div>
                  )}
                </div>

                {/* Game Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm">{game.min_players}-{game.max_players} joueurs</span>
                  </div>
                  {game.duration && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm">{game.duration}</span>
                    </div>
                  )}
                  {game.weight && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Weight className="w-4 h-4 text-primary" />
                      <span className="text-sm">Complexité {game.weight}/5</span>
                    </div>
                  )}
                  {game.year_published && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm">{game.year_published}</span>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {game.publisher && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Factory className="w-4 h-4 text-primary" />
                      <span className="text-sm">{game.publisher}</span>
                    </div>
                  )}
                  {game.designer && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-sm">{game.designer}</span>
                    </div>
                  )}
                </div>

                {/* Game Types */}
                {gameTypes.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {gameTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="bg-primary/20 text-primary">
                        {type}
                      </Badge>
                    ))}
                    {game.category && (
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {game.category}
                      </Badge>
                    )}
                    {game.difficulty && (
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {game.difficulty}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Overview of Extensions and Characters - Desktop Only */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Extensions Preview */}
          {game.has_expansion && game.expansions && game.expansions.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  Extensions ({game.expansions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {game.expansions.slice(0, 3).map((expansion) => (
                    <div key={expansion.expansion_id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">{expansion.name}</h4>
                        {expansion.year_published && (
                          <p className="text-slate-400 text-sm">{expansion.year_published}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {game.expansions.length > 3 && (
                    <p className="text-slate-400 text-sm text-center">
                      et {game.expansions.length - 3} autre(s)...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Characters Preview */}
          {game.has_characters && game.characters && game.characters.length > 0 && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-primary" />
                  Personnages ({game.characters.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {game.characters.slice(0, 3).map((character) => (
                    <div key={character.character_id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                      {character.avatar ? (
                        <img 
                          src={character.avatar} 
                          alt={character.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-600"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                          <UserCircle className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-white font-medium">{character.name}</h4>
                        {character.description && (
                          <p className="text-slate-400 text-sm">{character.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {game.characters.length > 3 && (
                    <p className="text-slate-400 text-sm text-center">
                      et {game.characters.length - 3} autre(s)...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </>
    )
  }
}