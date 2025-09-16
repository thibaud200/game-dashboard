import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface CharacterFormData {
  name: string;
  character_key: string;
  avatar: string;
  description: string;
  abilities: string;
}

interface CharacterFormProps {
  formData: CharacterFormData;
  setFormData: (data: CharacterFormData | ((prev: CharacterFormData) => CharacterFormData)) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitText: string;
}

const CharacterForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  submitText 
}: CharacterFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="name" className="text-white">Nom du personnage *</Label>
      <Input
        id="name"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData((prev: CharacterFormData) => ({ ...prev, name: e.target.value }))}
        className="bg-slate-700/50 border-slate-600 text-white"
        placeholder="Nom du personnage"
        required
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="character_key" className="text-white">Clé du personnage *</Label>
      <Input
        id="character_key"
        name="character_key"
        value={formData.character_key}
        onChange={(e) => setFormData((prev: CharacterFormData) => ({ ...prev, character_key: e.target.value }))}
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
        name="avatar"
        value={formData.avatar}
        onChange={(e) => setFormData((prev: CharacterFormData) => ({ ...prev, avatar: e.target.value }))}
        className="bg-slate-700/50 border-slate-600 text-white"
        placeholder="https://example.com/avatar.jpg"
        type="url"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="description" className="text-white">Description</Label>
      <Textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={(e) => setFormData((prev: CharacterFormData) => ({ ...prev, description: e.target.value }))}
        className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
        placeholder="Description du personnage..."
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="abilities" className="text-white">Capacités</Label>
      <Textarea
        id="abilities"
        name="abilities"
        value={formData.abilities}
        onChange={(e) => setFormData((prev: CharacterFormData) => ({ ...prev, abilities: e.target.value }))}
        className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
        placeholder="Attaque lourde, Bouclier, Intimidation..."
      />
      <p className="text-slate-400 text-xs">Séparez les capacités par des virgules</p>
    </div>

    <div className="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
      >
        Annuler
      </Button>
      <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
        {submitText}
      </Button>
    </div>
  </form>
);

interface AddCharacterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CharacterFormData;
  setFormData: (data: CharacterFormData | ((prev: CharacterFormData) => CharacterFormData)) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddCharacterDialog({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSubmit
}: AddCharacterDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-white">Ajouter un personnage</DialogTitle>
          <DialogDescription className="text-white/70">
            Ajoutez un nouveau personnage/rôle pour ce jeu.
          </DialogDescription>
        </DialogHeader>
        <CharacterForm 
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit} 
          onCancel={() => onOpenChange(false)}
          submitText="Ajouter" 
        />
      </DialogContent>
    </Dialog>
  );
}

interface EditCharacterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CharacterFormData;
  setFormData: (data: CharacterFormData | ((prev: CharacterFormData) => CharacterFormData)) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EditCharacterDialog({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSubmit
}: EditCharacterDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-white">Modifier le personnage</DialogTitle>
          <DialogDescription className="text-white/70">
            Modifiez les informations de ce personnage/rôle.
          </DialogDescription>
        </DialogHeader>
        <CharacterForm 
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit} 
          onCancel={() => onOpenChange(false)}
          submitText="Modifier" 
        />
      </DialogContent>
    </Dialog>
  );
}

interface DeleteCharacterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  characterName: string;
  onConfirm: () => void;
}

export function DeleteCharacterDialog({
  isOpen,
  onOpenChange,
  characterName,
  onConfirm
}: DeleteCharacterDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-800 border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Supprimer le personnage</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-300">
            Êtes-vous sûr de vouloir supprimer le personnage "{characterName}" ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700/50">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}