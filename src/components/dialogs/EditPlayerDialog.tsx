import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlayerFormData } from '@/types/index';

interface EditPlayerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PlayerFormData;
  setFormData: (data: PlayerFormData) => void;
  onUpdate: () => void;
  onCancel: () => void;
}

interface ValidationErrors {
  player_name?: string;
  avatar?: string;
  games_played?: string;
  wins?: string;
  total_score?: string;
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

    // Player name validation
    if (!formData.player_name.trim()) {
      newErrors.player_name = 'Player name is required';
    } else if (formData.player_name.trim().length < 2) {
      newErrors.player_name = 'Player name must be at least 2 characters long';
    } else if (formData.player_name.trim().length > 50) {
      newErrors.player_name = 'Player name must be less than 50 characters';
    }

    // Avatar URL validation (if provided)
    if (formData.avatar && formData.avatar.trim()) {
      const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
      if (!urlPattern.test(formData.avatar.trim())) {
        newErrors.avatar = 'Please enter a valid image URL (jpg, jpeg, png, gif, webp)';
      }
    }

    // Games played validation
    if (formData.games_played < 0) {
      newErrors.games_played = 'Games played cannot be negative';
    }

    // Wins validation
    if (formData.wins < 0) {
      newErrors.wins = 'Wins cannot be negative';
    } else if (formData.wins > formData.games_played) {
      newErrors.wins = 'Wins cannot exceed games played';
    }

    // Total score validation
    if (formData.total_score < 0) {
      newErrors.total_score = 'Total score cannot be negative';
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
    // Clear error for this field when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Player</DialogTitle>
          <DialogDescription className="text-white/70">
            Update player information and statistics.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit_player_name" className="text-white">Player Name *</Label>
            <Input
              id="edit_player_name"
              name="edit_player_name"
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
              name="edit_avatar"
              value={formData.avatar}
              onChange={(e) => handleInputChange('avatar', e.target.value)}
              className={`bg-white/10 border-white/20 text-white ${errors.avatar ? 'border-red-500' : ''}`}
              placeholder="https://example.com/avatar.jpg"
            />
            {errors.avatar && (
              <p className="text-red-400 text-sm mt-1">{errors.avatar}</p>
            )}
          </div>
          <div>
            <Label htmlFor="edit_favorite_game" className="text-white">Favorite Game</Label>
            <Input
              id="edit_favorite_game"
              name="edit_favorite_game"
              value={formData.favorite_game}
              onChange={(e) => handleInputChange('favorite_game', e.target.value)}
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
                min="0"
                value={formData.games_played}
                onChange={(e) => handleInputChange('games_played', parseInt(e.target.value) || 0)}
                className={`bg-white/10 border-white/20 text-white ${errors.games_played ? 'border-red-500' : ''}`}
              />
              {errors.games_played && (
                <p className="text-red-400 text-sm mt-1">{errors.games_played}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit_wins" className="text-white">Wins</Label>
              <Input
                id="edit_wins"
                type="number"
                min="0"
                value={formData.wins}
                onChange={(e) => handleInputChange('wins', parseInt(e.target.value) || 0)}
                className={`bg-white/10 border-white/20 text-white ${errors.wins ? 'border-red-500' : ''}`}
              />
              {errors.wins && (
                <p className="text-red-400 text-sm mt-1">{errors.wins}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="edit_total_score" className="text-white">Total Score</Label>
            <Input
              id="edit_total_score"
              type="number"
              min="0"
              value={formData.total_score}
              onChange={(e) => handleInputChange('total_score', parseInt(e.target.value) || 0)}
              className={`bg-white/10 border-white/20 text-white ${errors.total_score ? 'border-red-500' : ''}`}
            />
            {errors.total_score && (
              <p className="text-red-400 text-sm mt-1">{errors.total_score}</p>
            )}
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