import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { ArrowLeft, Plus, Edit, Trash, Calendar, Users, Gamepad2, TrendingUp, Settings } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface GameExpansion {
  expansion_id?: number
  game_id?: number
  bgg_expansion_id?: number
  name: string
  year_published?: number
  description?: string
}

interface Game {
  game_id: number
  name: string
  expansions: GameExpansion[]
}

interface GameExpansionsPageProps {
  game: Game
  onNavigation: (view: string, gameId?: number, source?: string) => void
  navigationSource?: string
  onAddExpansion: (gameId: number, expansionData: any) => Promise<GameExpansion>
  onUpdateExpansion: (expansionId: number, expansionData: any) => Promise<void>
  onDeleteExpansion: (expansionId: number) => Promise<void>
  embedded?: boolean
}

export default function GameExpansionsPage({ 
  game, 
  onNavigation, 
  navigationSource = 'games',
  onAddExpansion, 
  onUpdateExpansion, 
  onDeleteExpansion,
  embedded = false
}: GameExpansionsPageProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingExpansion, setEditingExpansion] = useState<GameExpansion | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    year_published: '',
    description: '',
    bgg_expansion_id: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      year_published: '',
      description: '',
      bgg_expansion_id: ''
    })
  }

  const handleAddExpansion = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Le nom de l\'extension est requis')
      return
    }

    try {
      const expansionData = {
        name: formData.name.trim(),
        year_published: formData.year_published ? parseInt(formData.year_published) : undefined,
        description: formData.description.trim() || undefined,
        bgg_expansion_id: formData.bgg_expansion_id ? parseInt(formData.bgg_expansion_id) : undefined
      }

      await onAddExpansion(game.game_id, expansionData)
      toast.success('Extension ajoutée avec succès')
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error adding expansion:', error)
      toast.error('Erreur lors de l\'ajout de l\'extension')
    }
  }

  const handleEditExpansion = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingExpansion || !formData.name.trim()) {
      toast.error('Le nom de l\'extension est requis')
      return
    }

    try {
      const expansionData = {
        name: formData.name.trim(),
        year_published: formData.year_published ? parseInt(formData.year_published) : undefined,
        description: formData.description.trim() || undefined,
        bgg_expansion_id: formData.bgg_expansion_id ? parseInt(formData.bgg_expansion_id) : undefined
      }

      await onUpdateExpansion(editingExpansion.expansion_id!, expansionData)
      toast.success('Extension modifiée avec succès')
      setEditingExpansion(null)
      resetForm()
    } catch (error) {
      console.error('Error updating expansion:', error)
      toast.error('Erreur lors de la modification de l\'extension')
    }
  }

  const handleDeleteExpansion = async (expansionId: number, expansionName: string) => {
    try {
      await onDeleteExpansion(expansionId)
      toast.success(`Extension "${expansionName}" supprimée avec succès`)
    } catch (error) {
      console.error('Error deleting expansion:', error)
      toast.error('Erreur lors de la suppression de l\'extension')
    }
  }

  const openEditDialog = (expansion: GameExpansion) => {
    setEditingExpansion(expansion)
    setFormData({
      name: expansion.name,
      year_published: expansion.year_published?.toString() || '',
      description: expansion.description || '',
      bgg_expansion_id: expansion.bgg_expansion_id?.toString() || ''
    })
  }

  const closeEditDialog = () => {
    setEditingExpansion(null)
    resetForm()
  }

  // Close dialogs and reset form when component unmounts or navigation changes
  React.useEffect(() => {
    return () => {
      setIsAddDialogOpen(false)
      setEditingExpansion(null)
      resetForm()
    }
  }, [])

  const ExpansionForm = ({ onSubmit, submitText }: { onSubmit: (e: React.FormEvent) => void, submitText: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white">Nom de l'extension *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="bg-slate-700/50 border-slate-600 text-white"
          placeholder="Nom de l'extension"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="year_published" className="text-white">Année de publication</Label>
        <Input
          id="year_published"
          type="number"
          value={formData.year_published}
          onChange={(e) => setFormData(prev => ({ ...prev, year_published: e.target.value }))}
          className="bg-slate-700/50 border-slate-600 text-white"
          placeholder="2024"
          min="1900"
          max={new Date().getFullYear() + 5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bgg_expansion_id" className="text-white">ID BGG</Label>
        <Input
          id="bgg_expansion_id"
          type="number"
          value={formData.bgg_expansion_id}
          onChange={(e) => setFormData(prev => ({ ...prev, bgg_expansion_id: e.target.value }))}
          className="bg-slate-700/50 border-slate-600 text-white"
          placeholder="ID BoardGameGeek"
          min="1"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
          placeholder="Description de l'extension..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={editingExpansion ? closeEditDialog : () => setIsAddDialogOpen(false)}
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
              <div className="h-6 w-px bg-slate-600 hidden md:block"></div>
              <h1 className="text-lg md:text-xl font-semibold text-white flex-1 truncate">
                Extensions - {game.name}
              </h1>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm md:text-base">
                    <Plus className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Ajouter une extension</span>
                    <span className="md:hidden">Ajouter</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-white">Ajouter une extension</DialogTitle>
                  </DialogHeader>
                  <ExpansionForm onSubmit={handleAddExpansion} submitText="Ajouter" />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={embedded ? "" : "max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 pb-20 md:pb-8"}>
        {/* Embedded Header with Add Button */}
        {embedded && (
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white">Extensions ({game.expansions?.length || 0})</h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                  <Plus className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Ajouter</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle className="text-white">Ajouter une extension</DialogTitle>
                </DialogHeader>
                <ExpansionForm onSubmit={handleAddExpansion} submitText="Ajouter" />
              </DialogContent>
            </Dialog>
          </div>
        )}
        
        {game.expansions && game.expansions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {game.expansions.map((expansion) => (
              <Card key={expansion.expansion_id} className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3 md:pb-6">
                  <CardTitle className="text-white text-base md:text-lg">{expansion.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  {expansion.year_published && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm">{expansion.year_published}</span>
                    </div>
                  )}
                  
                  {expansion.description && (
                    <p className="text-slate-300 text-sm">{expansion.description}</p>
                  )}
                  
                  {expansion.bgg_expansion_id && (
                    <p className="text-slate-400 text-xs">BGG ID: {expansion.bgg_expansion_id}</p>
                  )}

                  <div className="flex gap-2 pt-2 md:pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(expansion)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700/50 flex-1"
                    >
                      <Edit className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">Modifier</span>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-600/50 text-red-400 hover:bg-red-600/10 hover:border-red-600"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-800 border-slate-700 mx-4">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">
                            Supprimer l'extension
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-300">
                            Êtes-vous sûr de vouloir supprimer l'extension "{expansion.name}" ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteExpansion(expansion.expansion_id!, expansion.name)}
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
            <CardContent className="text-center py-12">
              <p className="text-slate-400 mb-4">Aucune extension ajoutée pour ce jeu.</p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter la première extension
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-white">Ajouter une extension</DialogTitle>
                  </DialogHeader>
                  <ExpansionForm onSubmit={handleAddExpansion} submitText="Ajouter" />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}

      {/* Edit Dialog */}
      <Dialog open={!!editingExpansion} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier l'extension</DialogTitle>
          </DialogHeader>
          <ExpansionForm onSubmit={handleEditExpansion} submitText="Modifier" />
        </DialogContent>
      </Dialog>
      </div>

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