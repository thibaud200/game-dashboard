import React from 'react';
import { Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlayerFormData } from '@/types';

interface AddPlayerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PlayerFormData;
  setFormData: (data: PlayerFormData) => void;
  onAdd: () => void;
  onCancel: () => void;
}

export function AddPlayerDialog({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onAdd,
  onCancel
}: AddPlayerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              value={formData.player_name}
              onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter player name"
            />
          </div>
          <div>
            <Label htmlFor="avatar" className="text-white">Avatar URL</Label>
            <Input
              id="avatar"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter avatar URL (optional)"
            />
          </div>
          <div>
            <Label htmlFor="favorite_game" className="text-white">Favorite Game</Label>
            <Input
              id="favorite_game"
              value={formData.favorite_game}
              onChange={(e) => setFormData({ ...formData, favorite_game: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter favorite game (optional)"
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={onAdd} className="flex-1">
              Add Player
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