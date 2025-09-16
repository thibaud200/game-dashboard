import React, { useState } from 'react';
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

interface ValidationErrors {
  player_name?: string;
  avatar?: string;
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
    // Clear error for this field when user starts typing
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
              name="player_name"
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
              name="avatar"
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
              name="favorite_game"
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