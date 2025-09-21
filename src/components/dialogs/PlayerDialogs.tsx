import React, { useState } from 'react';
import { Plus, Trash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlayerFormData } from '@/types/index';

interface ValidationErrors {
  player_name?: string;
  avatar?: string;
}

// Add Player Dialog Component
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
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.player_name.trim()) {
      newErrors.player_name = 'Player name is required';
    } else if (formData.player_name.trim().length < 2) {
      newErrors.player_name = 'Player name must be at least 2 characters long';
    }

    if (formData.avatar && formData.avatar.trim()) {
      const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
      if (!urlPattern.test(formData.avatar.trim())) {
        newErrors.avatar = 'Please enter a valid image URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (validateForm()) {
      onAdd();
    }
  };

  const handleInputChange = (field: keyof PlayerFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as keyof ValidationErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

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
            <Label htmlFor="player_name" className="text-white">Player Name *</Label>
            <Input
              id="player_name"
              value={formData.player_name}
              onChange={(e) => handleInputChange('player_name', e.target.value)}
              className={`bg-white/10 border-white/20 text-white ${errors.player_name ? 'border-red-500' : ''}`}
              placeholder="Enter player name"
            />
            {errors.player_name && (
              <p className="text-red-400 text-sm mt-1">{errors.player_name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="avatar" className="text-white">Avatar URL</Label>
            <Input
              id="avatar"
              value={formData.avatar}
              onChange={(e) => handleInputChange('avatar', e.target.value)}
              className={`bg-white/10 border-white/20 text-white ${errors.avatar ? 'border-red-500' : ''}`}
              placeholder="https://example.com/avatar.jpg (optional)"
            />
            {errors.avatar && (
              <p className="text-red-400 text-sm mt-1">{errors.avatar}</p>
            )}
          </div>
          <div>
            <Label htmlFor="favorite_game" className="text-white">Favorite Game</Label>
            <Input
              id="favorite_game"
              value={formData.favorite_game}
              onChange={(e) => handleInputChange('favorite_game', e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter favorite game (optional)"
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={handleAdd} className="flex-1">
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

// Edit Player Dialog Component
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
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.player_name.trim()) {
      newErrors.player_name = 'Player name is required';
    } else if (formData.player_name.trim().length < 2) {
      newErrors.player_name = 'Player name must be at least 2 characters long';
    }

    if (formData.avatar && formData.avatar.trim()) {
      const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
      if (!urlPattern.test(formData.avatar.trim())) {
        newErrors.avatar = 'Please enter a valid image URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (validateForm()) {
      onUpdate();
    }
  };

  const handleInputChange = (field: keyof PlayerFormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as keyof ValidationErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Player</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit_player_name" className="text-white">Player Name *</Label>
            <Input
              id="edit_player_name"
              value={formData.player_name}
              onChange={(e) => handleInputChange('player_name', e.target.value)}
              className={`bg-white/10 border-white/20 text-white ${errors.player_name ? 'border-red-500' : ''}`}
              placeholder="Enter player name"
            />
            {errors.player_name && (
              <p className="text-red-400 text-sm mt-1">{errors.player_name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="edit_avatar" className="text-white">Avatar URL</Label>
            <Input
              id="edit_avatar"
              value={formData.avatar}
              onChange={(e) => handleInputChange('avatar', e.target.value)}
              className={`bg-white/10 border-white/20 text-white ${errors.avatar ? 'border-red-500' : ''}`}
              placeholder="https://example.com/avatar.jpg (optional)"
            />
            {errors.avatar && (
              <p className="text-red-400 text-sm mt-1">{errors.avatar}</p>
            )}
          </div>
          <div>
            <Label htmlFor="edit_favorite_game" className="text-white">Favorite Game</Label>
            <Input
              id="edit_favorite_game"
              value={formData.favorite_game}
              onChange={(e) => handleInputChange('favorite_game', e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter favorite game (optional)"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit_games_played" className="text-white">Games Played</Label>
              <Input
                id="edit_games_played"
                type="number"
                value={formData.games_played || 0}
                onChange={(e) => handleInputChange('games_played', parseInt(e.target.value) || 0)}
                className="bg-white/10 border-white/20 text-white"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="edit_wins" className="text-white">Wins</Label>
              <Input
                id="edit_wins"
                type="number"
                value={formData.wins || 0}
                onChange={(e) => handleInputChange('wins', parseInt(e.target.value) || 0)}
                className="bg-white/10 border-white/20 text-white"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="edit_total_score" className="text-white">Total Score</Label>
              <Input
                id="edit_total_score"
                type="number"
                value={formData.total_score || 0}
                onChange={(e) => handleInputChange('total_score', parseInt(e.target.value) || 0)}
                className="bg-white/10 border-white/20 text-white"
                min="0"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleUpdate} className="flex-1">
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

// Delete Player Dialog Component
interface DeletePlayerDialogProps {
  playerName: string;
  onDelete: () => void;
}

export function DeletePlayerDialog({ playerName, onDelete }: DeletePlayerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="hover:bg-white/10 text-red-400 hover:text-red-300"
        >
          <Trash className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Delete Player</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-white/70">
            Are you sure you want to delete <strong>{playerName}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={handleDelete}
              variant="destructive"
              className="flex-1"
            >
              Delete
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsOpen(false)}
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