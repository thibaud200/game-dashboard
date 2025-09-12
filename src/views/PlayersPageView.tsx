import React from 'react';
import {
  ArrowLeft,
  Plus,
  Search,
  Trophy,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  ChartLineUp,
  MoreVertical
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import BottomNavigation from '@/components/BottomNavigation';
import { Player, PlayerFormData } from '@/types';

interface PlayersPageViewProps {
  players: Player[];
  currentView: string;
  totalPlayers: number;
  totalGamesPlayed: number;
  totalWins: number;
  isMobile: boolean;
  formData: PlayerFormData;
  setFormData: (data: PlayerFormData) => void;
  editingPlayer: Player | null;
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleBackClick: () => void;
  handlePlayerStatsClick: () => void;
  handleAddDialogOpen: (open: boolean) => void;
  handleEditDialogOpen: (open: boolean) => void;
  handleAddPlayer: () => void;
  handleEditPlayer: (player: Player) => void;
  handleUpdatePlayer: () => void;
  handleDeletePlayer: (playerId: number) => void;
  handleViewPlayerStats: (playerId: number) => void;
  resetForm: () => void;
  onNavigation: (view: string, id?: number) => void;
}

export function PlayersPageView(props: PlayersPageViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={props.handleBackClick}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Players</h1>
          <button
            onClick={props.handlePlayerStatsClick}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <TrendingUp className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <div className="text-center">
              <div className="text-lg font-bold">{props.totalPlayers}</div>
              <div className="text-xs text-white/60">Players</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <div className="text-center">
              <div className="text-lg font-bold">{props.totalGamesPlayed}</div>
              <div className="text-xs text-white/60">Games</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
            <div className="text-center">
              <div className="text-lg font-bold">{props.totalWins}</div>
              <div className="text-xs text-white/60">Wins</div>
            </div>
          </div>
        </div>

        {/* Search and Add */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            <Input
              placeholder="Search players..."
              value={props.searchQuery}
              onChange={(e) => props.setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
          
          {/* Add Player Dialog */}
          <Dialog open={props.isAddDialogOpen} onOpenChange={props.handleAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Player</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="player_name" className="text-white">Player Name</Label>
                  <Input
                    id="player_name"
                    value={props.formData.player_name}
                    onChange={(e) => props.setFormData({ ...props.formData, player_name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Enter player name"
                  />
                </div>
                <div>
                  <Label htmlFor="avatar" className="text-white">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={props.formData.avatar}
                    onChange={(e) => props.setFormData({ ...props.formData, avatar: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Enter avatar URL (optional)"
                  />
                </div>
                <div>
                  <Label htmlFor="favorite_game" className="text-white">Favorite Game</Label>
                  <Input
                    id="favorite_game"
                    value={props.formData.favorite_game}
                    onChange={(e) => props.setFormData({ ...props.formData, favorite_game: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Enter favorite game (optional)"
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={props.handleAddPlayer} className="flex-1">
                    Add Player
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      props.resetForm();
                      props.handleAddDialogOpen(false);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Players List */}
      <div className="px-4 space-y-3 pb-32">
        {props.players.map((player) => (
          <div key={player.player_id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl">
            <div className="flex items-center space-x-4">
              <img
                src={player.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`}
                alt={player.player_name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold text-white">{player.player_name}</div>
                <div className="text-white/60 text-sm">{player.stats || `${player.total_score} pts`}</div>
                <div className="text-white/40 text-xs">
                  {player.games_played} games • {player.wins} wins • Avg: {player.average_score}
                </div>
              </div>
              
              {/* Actions */}
              {props.isMobile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-800 border-white/20">
                    <DropdownMenuItem 
                      onClick={() => props.handleViewPlayerStats(player.player_id)}
                      className="text-white hover:bg-white/10"
                    >
                      <ChartLineUp className="w-4 h-4 mr-2" />
                      View Stats
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => props.handleEditPlayer(player)}
                      className="text-white hover:bg-white/10"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => props.handleDeletePlayer(player.player_id)}
                      className="text-white hover:bg-white/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => props.handleViewPlayerStats(player.player_id)}
                        className="hover:bg-white/10"
                      >
                        <ChartLineUp className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View Stats</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => props.handleEditPlayer(player)}
                        className="hover:bg-white/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit Player</TooltipContent>
                  </Tooltip>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-white/10 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-800 border-white/20">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Player</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/80">
                          Are you sure you want to delete {player.player_name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/10 text-white border-white/20">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => props.handleDeletePlayer(player.player_id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>
        ))}

        {props.players.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <div className="text-white/60 mb-4">No players found</div>
            <Button 
              onClick={() => props.handleAddDialogOpen(true)}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Player
            </Button>
          </div>
        )}
      </div>

      {/* Edit Player Dialog */}
      <Dialog open={props.isEditDialogOpen} onOpenChange={props.handleEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Player</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_player_name" className="text-white">Player Name</Label>
              <Input
                id="edit_player_name"
                value={props.formData.player_name}
                onChange={(e) => props.setFormData({ ...props.formData, player_name: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter player name"
              />
            </div>
            <div>
              <Label htmlFor="edit_avatar" className="text-white">Avatar URL</Label>
              <Input
                id="edit_avatar"
                value={props.formData.avatar}
                onChange={(e) => props.setFormData({ ...props.formData, avatar: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter avatar URL"
              />
            </div>
            <div>
              <Label htmlFor="edit_favorite_game" className="text-white">Favorite Game</Label>
              <Input
                id="edit_favorite_game"
                value={props.formData.favorite_game}
                onChange={(e) => props.setFormData({ ...props.formData, favorite_game: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter favorite game"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_games_played" className="text-white">Games Played</Label>
                <Input
                  id="edit_games_played"
                  type="number"
                  value={props.formData.games_played}
                  onChange={(e) => props.setFormData({ ...props.formData, games_played: parseInt(e.target.value) || 0 })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit_wins" className="text-white">Wins</Label>
                <Input
                  id="edit_wins"
                  type="number"
                  value={props.formData.wins}
                  onChange={(e) => props.setFormData({ ...props.formData, wins: parseInt(e.target.value) || 0 })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit_total_score" className="text-white">Total Score</Label>
              <Input
                id="edit_total_score"
                type="number"
                value={props.formData.total_score}
                onChange={(e) => props.setFormData({ ...props.formData, total_score: parseInt(e.target.value) || 0 })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={props.handleUpdatePlayer} className="flex-1">
                Update Player
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  props.resetForm();
                  props.handleEditDialogOpen(false);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <BottomNavigation currentView={props.currentView} onNavigation={props.onNavigation} />
    </div>
  );
}