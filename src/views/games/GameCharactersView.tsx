import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, Plus, PencilSimple, Trash, User, Lightning, Users, Star, TrendUp, Gear } from '@phosphor-icons/react';
import { useGameCharacters, UseGameCharactersProps } from '@/hooks/games/useGameCharacters';
import { AddCharacterDialog, EditCharacterDialog, DeleteCharacterDialog } from '@/components/dialogs';

export default function GameCharactersView(props: UseGameCharactersProps) {
  const {
    isAddDialogOpen,
    editingCharacter,
    deleteCharacterId,
    formData,
    characters,
    setIsAddDialogOpen,
    setDeleteCharacterId,
    setFormData,
    openEditDialog,
    closeDialogs,
    handleAddCharacter,
    handleEditCharacter,
    handleDeleteCharacter
  } = useGameCharacters(props);

  const {
    game,
    onNavigation,
    navigationSource,
    embedded = false
  } = props;

  return (
    <>
      {/* Header - Only show when not embedded */}
      {!embedded && (
        <div className="bg-slate-800/50 border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
            <div className="flex items-center gap-3 md:gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigation(navigationSource === 'game-detail' ? 'game-detail' : 'games', game.game_id)}
                    className="text-slate-300 hover:text-white hover:bg-slate-700/50 p-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{navigationSource === 'game-detail' ? 'Back to Game Details' : 'Back to Games List'}</p>
                </TooltipContent>
              </Tooltip>
              <div className="h-6 w-px bg-slate-600 hidden md:block"></div>
              <h1 className="text-lg md:text-xl font-semibold text-white flex-1 truncate">
                Personnages - {game.name}
              </h1>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm md:text-base"
                  >
                    <Plus className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Ajouter un personnage</span>
                    <span className="md:hidden">Ajouter</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add New Character</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={embedded ? "" : "max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 pb-32 md:pb-8"}>
        {/* Embedded Header with Add Button */}
        {embedded && (
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white">Personnages ({characters.length})</h2>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
            >
              <Plus className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Ajouter</span>
            </Button>
          </div>
        )}
        
        {characters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {characters.map((character) => (
              <Card key={character.character_id} className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3 md:pb-6">
                  <div className="flex items-center gap-3">
                    {character.avatar ? (
                      <img
                        src={character.avatar}
                        alt={character.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-white text-base md:text-lg">{character.name}</CardTitle>
                      <p className="text-slate-400 text-sm">{character.character_key}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  {character.description && (
                    <p className="text-slate-300 text-sm">{character.description}</p>
                  )}
                  
                  {character.abilities && character.abilities.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Lightning className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Capacités</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {character.abilities.map((ability, index) => (
                          <span
                            key={index}
                            className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded"
                          >
                            {ability}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 md:pt-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(character)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700/50 flex-1"
                        >
                          <PencilSimple className="w-4 h-4 md:mr-2" />
                          <span className="hidden md:inline">Modifier</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Character</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteCharacterId(character.character_id!)}
                          className="border-red-600/50 text-red-400 hover:bg-red-600/10 hover:border-red-600"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Character</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="text-center py-12">
              <p className="text-slate-400 mb-4">Aucun personnage ajouté pour ce jeu.</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter le premier personnage
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <AddCharacterDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddCharacter}
      />

      <EditCharacterDialog
        isOpen={!!editingCharacter}
        onOpenChange={(open) => !open && closeDialogs()}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditCharacter}
      />

      <DeleteCharacterDialog
        isOpen={!!deleteCharacterId}
        onOpenChange={(open) => !open && setDeleteCharacterId(null)}
        characterName={characters.find(c => c.character_id === deleteCharacterId)?.name || ''}
        onConfirm={() => handleDeleteCharacter(deleteCharacterId!)}
      />

      {/* Bottom Navigation - Mobile Only - Only show when not embedded */}
      {!embedded && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden">
          <div className="bg-slate-800 border-t border-slate-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigation(navigationSource === 'game-detail' ? 'game-detail' : 'games', game.game_id)}
                className="text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}