# Backend Directory

This directory contains all backend-related components for the Board Game Dashboard application.

## Structure

- `api/` - API endpoints and routes
- `services/` - Business logic and data services
- `models/` - Data models and schemas
- `utils/` - Utility functions and helpers
- `database/` - Database-related files and migrations
- `config/` - Configuration files

## Database Structure

The application uses a relational database structure as defined in `../database-structure.md`. Key entities include:

- Players
- Games
- Game Sessions
- Session Players
- Game Expansions
- Game Characters

## Integration

This backend is designed to work with the React frontend located in the `../src` directory.