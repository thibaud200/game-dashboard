# Dialog Reorganization and Form Validation Summary

## Changes Made

### 1. Dialog Reorganization
- **Moved all dialog components to a single `src/components/dialogs/` directory**
- **Old structure:**
  ```
  src/components/
    ├── dialogs/
    │   ├── AddPlayerDialog.tsx
    │   ├── EditPlayerDialog.tsx
    │   └── DeletePlayerDialog.tsx
    └── games/
        ├── AddGameDialog.tsx
        ├── EditGameDialog.tsx
        └── DeleteGameDialog.tsx
  ```

- **New structure:**
  ```
  src/components/dialogs/
    ├── index.ts (barrel export)
    ├── AddPlayerDialog.tsx (with validation)
    ├── EditPlayerDialog.tsx (with validation)
    ├── DeletePlayerDialog.tsx
    ├── AddGameDialog.tsx (with validation)
    ├── EditGameDialog.tsx
    └── DeleteGameDialog.tsx
  ```

### 2. Form Validation Added

#### Player Dialogs Validation:
- **Player Name**: Required, 2-50 characters
- **Avatar URL**: Optional, but if provided must be valid image URL (jpg, jpeg, png, gif, webp)
- **Games Played**: Cannot be negative
- **Wins**: Cannot be negative, cannot exceed games played
- **Total Score**: Cannot be negative

#### Game Dialog Validation (AddGameDialog):
- **Game Name**: Required, minimum 2 characters
- **Image URL**: Optional, but if provided must be valid image URL
- **Min/Max Players**: Must be at least 1, max cannot be less than min
- **Age**: Must be between 1-99
- **Year**: Must be between 1800 and current year + 5
- **BGG Rating**: Must be between 0-10
- **Weight**: Must be between 0-5

### 3. Updated Imports
- **Updated all files to use centralized imports from `@/components/dialogs`**
- **Updated `src/views/GamesPageView.tsx`** to import from new location
- **Updated `src/views/PlayersPageView.tsx`** to use barrel imports

### 4. Enhanced User Experience
- **Visual error indicators**: Form fields show red border when invalid
- **Real-time validation**: Errors clear as user types/fixes issues
- **Error messages**: Clear, actionable error messages below each field
- **Validation on submit**: Prevents submission until all validation passes

## Files Modified
1. `src/components/dialogs/AddPlayerDialog.tsx` - Added comprehensive validation
2. `src/components/dialogs/EditPlayerDialog.tsx` - Added comprehensive validation  
3. `src/components/dialogs/AddGameDialog.tsx` - Added comprehensive validation
4. `src/components/dialogs/EditGameDialog.tsx` - Moved from games directory
5. `src/components/dialogs/DeleteGameDialog.tsx` - Moved from games directory
6. `src/components/dialogs/index.ts` - New barrel export file
7. `src/views/GamesPageView.tsx` - Updated imports
8. `src/views/PlayersPageView.tsx` - Updated imports

## Benefits
- **Centralized dialog management**: All dialogs in one location
- **Consistent validation**: Standardized validation patterns across forms
- **Better UX**: Immediate feedback and clear error messages
- **Maintainability**: Easier to find and modify dialog components
- **Reusability**: Barrel exports make importing multiple dialogs cleaner

## Next Steps
- Consider adding validation to EditGameDialog for consistency
- Add form validation to other dialog components as needed
- Implement backend validation when API integration is added