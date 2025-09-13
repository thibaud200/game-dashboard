import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlayerFormData } from '@/types';

interface EditPlayerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PlayerFormData;
  setFormData: (data: PlayerFormData) => void;
  onUpdate: () => void;
  onCancel: () => void;
}

export function EditPlayerDialog({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onUpdate,
  onCancel
}: EditPlayerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Player</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit_player_name" className="text-white">Player Name</Label>
            <Input
              id="edit_player_name"
              value={formData.player_name}
              onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter player name"
            />
          </div>
          <div>
            <Label htmlFor="edit_avatar" className="text-white">Avatar URL</Label>
            <Input
              id="edit_avatar"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter avatar URL"
            />
          </div>
          <div>
            <Label htmlFor="edit_favorite_game" className="text-white">Favorite Game</Label>
            <Input
              id="edit_favorite_game"
              value={formData.favorite_game}
              onChange={(e) => setFormData({ ...formData, favorite_game: e.target.value })}
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
                value={formData.games_played}
                onChange={(e) => setFormData({ ...formData, games_played: parseInt(e.target.value) || 0 })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit_wins" className="text-white">Wins</Label>
              <Input
                id="edit_wins"
                type="number"
                value={formData.wins}
                onChange={(e) => setFormData({ ...formData, wins: parseInt(e.target.value) || 0 })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit_total_score" className="text-white">Total Score</Label>
            <Input
              id="edit_total_score"
              type="number"
              value={formData.total_score}
              onChange={(e) => setFormData({ ...formData, total_score: parseInt(e.target.value) || 0 })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={onUpdate} className="flex-1">
              Update Player
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}