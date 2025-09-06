import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, Plus, Edit, Trash, UserCircle, Zap, Users, Gamepad2, TrendingUp, Settings } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface GameCharacter {
  character_id?: number
  game_id?: number
  character_key: string
  name: string
  description?: string
  avatar?: string
  abilities?: string[]
}

interface Game {
  game_id: number
  name: string
  characters: GameCharacter[]
}

interface GameCharactersPageProps {
  game: Game
  onNavigation: (view: string, gameId?: number, source?: string) => void
  navigationSource?: string
  onAddCharacter: (gameId: number, characterData: any) => Promise<GameCharacter>
  onUpdateCharacter: (characterId: number, characterData: any) => Promise<void>
  onDeleteCharacter: (characterId: number) => Promise<void>
  embedded?: boolean
}

export default function GameCharactersPage({ 
  game, 
  onNavigation, 
  navigationSource = 'games',
  onAddCharacter, 
  onUpdateCharacter, 
  onDeleteCharacter,
  embedded = false
}: GameCharactersPageProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<GameCharacter | null>(null)
  const [formData, setFormData] = useState({
    character_key: '',
    name: '',
    description: '',
    avatar: '',
    abilities: ''
  })

  const resetForm = () => {
    setFormData({
      character_key: '',
      name: '',
      description: '',
      avatar: '',
      abilities: ''
    })
  }

  const parseAbilities = (abilitiesString: string): string[] => {
    if (!abilitiesString.trim()) return []
    return abilitiesString.split(',').map(ability => ability.trim()).filter(ability => ability.length > 0)
  }

  const formatAbilities = (abilities: string[] | undefined): string => {
    if (!abilities || abilities.length === 0) return ''
    return abilities.join(', ')
  }

  const handleAddCharacter = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.character_key.trim()) {
      toast.error('Le nom et la clé du personnage sont requis')
      return
    }

    try {
      const characterData = {
        character_key: formData.character_key.trim().toLowerCase().replace(/\s+/g, '_'),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        avatar: formData.avatar.trim() || undefined,
        abilities: parseAbilities(formData.abilities)
      }

      await onAddCharacter(game.game_id, characterData)
      toast.success('Personnage ajouté avec succès')
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error adding character:', error)
      toast.error('Erreur lors de l\'ajout du personnage')
    }
  }

  const handleEditCharacter = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingCharacter || !formData.name.trim() || !formData.character_key.trim()) {
      toast.error('Le nom et la clé du personnage sont requis')
      return
    }

    try {
      const characterData = {
        character_key: formData.character_key.trim().toLowerCase().replace(/\s+/g, '_'),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        avatar: formData.avatar.trim() || undefined,
        abilities: parseAbilities(formData.abilities)
      }

      await onUpdateCharacter(editingCharacter.character_id!, characterData)
      toast.success('Personnage modifié avec succès')
      setEditingCharacter(null)
      resetForm()
    } catch (error) {
      console.error('Error updating character:', error)
      toast.error('Erreur lors de la modification du personnage')
    }
  }

  const handleDeleteCharacter = async (characterId: number, characterName: string) => {
    try {
      await onDeleteCharacter(characterId)
      toast.success(`Personnage "${characterName}" supprimé avec succès`)
    } catch (error) {
      console.error('Error deleting character:', error)
      toast.error('Erreur lors de la suppression du personnage')
    }
  }

  const openEditDialog = (character: GameCharacter) => {
    setEditingCharacter(character)
    setFormData({
      character_key: character.character_key,
      name: character.name,
      description: character.description || '',
      avatar: character.avatar || '',
      abilities: formatAbilities(character.abilities)
    })
  }

  const closeEditDialog = () => {
    setEditingCharacter(null)
    resetForm()
  }

  // Close dialogs and reset form when component unmounts or navigation changes
  React.useEffect(() => {
    return () => {
      setIsAddDialogOpen(false)
      setEditingCharacter(null)
      resetForm()
    }
  }, [])

  const CharacterForm = ({ onSubmit, submitText }: { onSubmit: (e: React.FormEvent) => void, submitText: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white">Nom du personnage *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="bg-slate-700/50 border-slate-600 text-white"
          placeholder="Nom du personnage"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="character_key" className="text-white">Clé du personnage *</Label>
        <Input
          id="character_key"
          value={formData.character_key}
          onChange={(e) => setFormData(prev => ({ ...prev, character_key: e.target.value }))}
          className="bg-slate-700/50 border-slate-600 text-white"
          placeholder="warrior, mage, archer..."
          required
        />
        <p className="text-slate-400 text-xs">Identifiant unique (sera automatiquement formaté)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar" className="text-white">Avatar (URL)</Label>
        <Input
          id="avatar"
          value={formData.avatar}
          onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
          className="bg-slate-700/50 border-slate-600 text-white"
          placeholder="https://example.com/avatar.jpg"
          type="url"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
          placeholder="Description du personnage..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="abilities" className="text-white">Capacités</Label>
        <Textarea
          id="abilities"
          value={formData.abilities}
          onChange={(e) => setFormData(prev => ({ ...prev, abilities: e.target.value }))}
          className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
          placeholder="Attaque lourde, Bouclier, Intimidation..."
        />
        <p className="text-slate-400 text-xs">Séparez les capacités par des virgules</p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={editingCharacter ? closeEditDialog : () => setIsAddDialogOpen(false)}
          className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
        >
          Annuler
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {submitText}
        </Button>
      </div>
    </form>
  )

  return (
    <div className={embedded ? "" : "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800"}>
      {/* Header - Only show when not embedded */}
      {!embedded && (
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center gap-3 md:gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Contextual navigation based on source
                      if (navigationSource === 'game-detail') {
                        onNavigation('game-detail', game.game_id)
                      } else {
                        onNavigation('games')
                      }
                    }}
                    className="text-white/80 hover:text-white hover:bg-white/10 p-2"
                  >
                    <ArrowLeft className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">
                      {navigationSource === 'game-detail' ? 'Retour au jeu' : 'Retour aux jeux'}
                    </span>
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
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm md:text-base">
                        <Plus className="w-4 h-4 md:mr-2" />
                        <span className="hidden md:inline">Ajouter un personnage</span>
                        <span className="md:hidden">Ajouter</span>
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add New Character</p>
                  </TooltipContent>
                </Tooltip>
                <DialogContent className="bg-slate-800 border-slate-700 max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-white">Ajouter un personnage</DialogTitle>
                  </DialogHeader>
                  <CharacterForm onSubmit={handleAddCharacter} submitText="Ajouter" />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={embedded ? "" : "max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 pb-32 md:pb-8"}>
        {/* Embedded Header with Add Button */}
        {embedded && (
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white">Personnages ({game.characters?.length || 0})</h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                  <Plus className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Ajouter</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle className="text-white">Ajouter un personnage</DialogTitle>
                </DialogHeader>
                <CharacterForm onSubmit={handleAddCharacter} submitText="Ajouter" />
              </DialogContent>
            </Dialog>
          </div>
        )}
        {game.characters && game.characters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {game.characters.map((character) => (
              <Card key={character.character_id} className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3 md:pb-6">
                  <div className="flex items-center gap-3">
                    {character.avatar ? (
                      <img 
                        src={character.avatar} 
                        alt={character.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-slate-600"
                      />
                    ) : (
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-600 rounded-full flex items-center justify-center">
                        <UserCircle className="w-6 h-6 md:w-8 md:h-8 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-white text-base md:text-lg">{character.name}</CardTitle>
                      <p className="text-slate-400 text-xs md:text-sm">{character.character_key}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  {character.description && (
                    <p className="text-slate-300 text-sm">{character.description}</p>
                  )}
                  
                  {character.abilities && character.abilities.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-white text-sm font-medium">Capacités</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {character.abilities.map((ability, index) => (
                          <span 
                            key={index}
                            className="bg-primary/20 text-primary px-2 py-1 rounded text-xs"
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
                          <Edit className="w-4 h-4 md:mr-2" />
                          <span className="hidden md:inline">Modifier</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Character</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <AlertDialog>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-600/50 text-red-400 hover:bg-red-600/10 hover:border-red-600"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Character</p>
                        </TooltipContent>
                      </Tooltip>
                      <AlertDialogContent className="bg-slate-800 border-slate-700 mx-4">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">
                            Supprimer le personnage
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-300">
                            Êtes-vous sûr de vouloir supprimer le personnage "{character.name}" ? 
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700/50">
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCharacter(character.character_id!, character.name)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-12 text-center">
              <UserCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Aucun personnage</h3>
              <p className="text-slate-400 mb-6">
                Ce jeu n'a pas encore de personnages enregistrés.
              </p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter le premier personnage
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-white">Ajouter un personnage</DialogTitle>
                  </DialogHeader>
                  <CharacterForm onSubmit={handleAddCharacter} submitText="Ajouter" />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingCharacter} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier le personnage</DialogTitle>
          </DialogHeader>
          <CharacterForm onSubmit={handleEditCharacter} submitText="Modifier" />
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation - Mobile Only - Only show when not embedded */}
      {!embedded && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-md border-t border-white/10 md:hidden">
          <div className="flex justify-around items-center py-2">
            <button
              onClick={() => onNavigation('dashboard')}
              className="flex flex-col items-center p-3 transition-colors text-white/60 hover:text-white"
            >
              <TrendingUp className="w-6 h-6 mb-1" />
              <span className="text-xs">Dashboard</span>
            </button>
            <button
              onClick={() => onNavigation('players')}
              className="flex flex-col items-center p-3 transition-colors text-white/60 hover:text-white"
            >
              <Users className="w-6 h-6 mb-1" />
              <span className="text-xs">Players</span>
            </button>
            <button
              onClick={() => onNavigation('games')}
              className="flex flex-col items-center p-3 transition-colors text-primary"
            >
              <Gamepad2 className="w-6 h-6 mb-1" />
              <span className="text-xs">Games</span>
            </button>
            <button
              onClick={() => onNavigation('settings')}
              className="flex flex-col items-center p-3 transition-colors text-white/60 hover:text-white"
            >
              <Settings className="w-6 h-6 mb-1" />
              <span className="text-xs">Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}