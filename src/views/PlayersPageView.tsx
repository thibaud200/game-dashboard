import React from 'react';
import {
  ArrowLeft,
  Plus,
  MagnifyingGlass,
  Users,
  TrendUp,
  PencilSimple,
  Trash,
  ChartLineUp,
  DotsThreeVertical
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddPlayerDialog, EditPlayerDialog, DeletePlayerDialog } from '@/components/dialogs/PlayerDialogs';
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
  // Safety check for players array
  const safePlayers = props.players || [];
  
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
            <TrendUp className="w-6 h-6" />
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
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            <Input
              placeholder="Search players..."
              value={props.searchQuery}
              onChange={(e) => props.setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
          
          {/* Add Player Dialog */}
          <AddPlayerDialog
            isOpen={props.isAddDialogOpen}
            onOpenChange={props.handleAddDialogOpen}
            formData={props.formData}
            setFormData={props.setFormData}
            onAdd={props.handleAddPlayer}
            onCancel={() => {
              props.resetForm();
              props.handleAddDialogOpen(false);
            }}
          />
        </div>
      </div>

      {/* Players List */}
      <div className="px-4 space-y-3 pb-32">
        {safePlayers.map((player) => (
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
                      <DotsThreeVertical className="w-4 h-4" />
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
                      <PencilSimple className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${player.player_name}? This action cannot be undone.`)) {
                          props.handleDeletePlayer(player.player_id);
                        }
                      }}
                      className="text-white hover:bg-white/10"
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => props.handleViewPlayerStats(player.player_id)}
                    className="hover:bg-white/10"
                  >
                    <ChartLineUp className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => props.handleEditPlayer(player)}
                    className="hover:bg-white/10"
                  >
                    <PencilSimple className="w-4 h-4" />
                  </Button>

                  <DeletePlayerDialog
                    playerName={player.player_name}
                    onDelete={() => props.handleDeletePlayer(player.player_id)}
                  />
                </div>
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
      <EditPlayerDialog
        isOpen={props.isEditDialogOpen}
        onOpenChange={props.handleEditDialogOpen}
        formData={props.formData}
        setFormData={props.setFormData}
        onUpdate={props.handleUpdatePlayer}
        onCancel={() => {
          props.resetForm();
          props.handleEditDialogOpen(false);
        }}
      />

    </div>
  );
}