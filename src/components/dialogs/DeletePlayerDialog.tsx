import React from 'react';
import { Trash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
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

interface DeletePlayerDialogProps {
  playerName: string;
  onDelete: () => void;
}

export function DeletePlayerDialog({ playerName, onDelete }: DeletePlayerDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="hover:bg-white/10 text-red-400 hover:text-red-300"
        >
          <Trash className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-slate-800 border-white/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Delete Player</AlertDialogTitle>
          <AlertDialogDescription className="text-white/80">
            Are you sure you want to delete {playerName}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/10 text-white border-white/20">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}