import { Request, Response } from 'express';
import { GameCharacterService } from '../services/GameCharacterService';
import { Database } from 'sqlite3';

//pour le logging
const winston = require('winston');
// Logger setup
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'backend/app-backend.log' })
  ]
});

export class GameCharacterController {
  private characterService: GameCharacterService;

  constructor(db: Database) {
    this.characterService = new GameCharacterService(db);
  }

  // GET /api/games/:gameId/characters
  async getCharactersByGameId(req: Request, res: Response) {
    try {
      const gameId = parseInt(req.params.gameId);
      
      if (isNaN(gameId)) {
        return res.status(400).json({ error: 'Invalid game ID' });
      }

      const characters = await this.characterService.getCharactersByGameId(gameId);
      res.json(characters);
    } catch (error) {
      logger.error('Error fetching characters:', error);
      res.status(500).json({ error: 'Failed to fetch characters' });
    }
  }

  // GET /api/characters/:characterId
  async getCharacterById(req: Request, res: Response) {
    try {
      const characterId = parseInt(req.params.characterId);
      
      if (isNaN(characterId)) {
        return res.status(400).json({ error: 'Invalid character ID' });
      }

      const character = await this.characterService.getCharacterById(characterId);
      res.json(character);
    } catch (error) {
      logger.error('Error fetching character:', error);
      if (error.message === 'Character not found') {
        res.status(404).json({ error: 'Character not found' });
      } else {
        res.status(500).json({ error: 'Failed to fetch character' });
      }
    }
  }

  // POST /api/games/:gameId/characters
  async createCharacter(req: Request, res: Response) {
    try {
      const gameId = parseInt(req.params.gameId);
      
      if (isNaN(gameId)) {
        return res.status(400).json({ error: 'Invalid game ID' });
      }

      const { character_key, name, description, avatar, abilities } = req.body;

      // Validation
      if (!character_key || !name) {
        return res.status(400).json({ error: 'Character key and name are required' });
      }

      const characterData = {
        game_id: gameId,
        character_key,
        name,
        description,
        avatar,
        abilities: Array.isArray(abilities) ? abilities : []
      };

      const newCharacter = await this.characterService.createCharacter(characterData);
      res.status(201).json(newCharacter);
    } catch (error) {
      logger.error('Error creating character:', error);
      res.status(500).json({ error: 'Failed to create character' });
    }
  }

  // PUT /api/characters/:characterId
  async updateCharacter(req: Request, res: Response) {
    try {
      const characterId = parseInt(req.params.characterId);
      
      if (isNaN(characterId)) {
        return res.status(400).json({ error: 'Invalid character ID' });
      }

      const updates = req.body;
      
      // Ensure abilities is properly formatted if provided
      if (updates.abilities && !Array.isArray(updates.abilities)) {
        return res.status(400).json({ error: 'Abilities must be an array' });
      }

      const updatedCharacter = await this.characterService.updateCharacter(characterId, updates);
      res.json(updatedCharacter);
    } catch (error) {
      logger.error('Error updating character:', error);
      if (error.message === 'Character not found') {
        res.status(404).json({ error: 'Character not found' });
      } else if (error.message === 'No fields to update') {
        res.status(400).json({ error: 'No fields to update' });
      } else {
        res.status(500).json({ error: 'Failed to update character' });
      }
    }
  }

  // DELETE /api/characters/:characterId
  async deleteCharacter(req: Request, res: Response) {
    try {
      const characterId = parseInt(req.params.characterId);
      
      if (isNaN(characterId)) {
        return res.status(400).json({ error: 'Invalid character ID' });
      }

      await this.characterService.deleteCharacter(characterId);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting character:', error);
      res.status(500).json({ error: 'Failed to delete character' });
    }
  }

  // POST /api/characters/bulk
  async createMultipleCharacters(req: Request, res: Response) {
    try {
      const { gameId, characters } = req.body;

      if (!gameId || !Array.isArray(characters)) {
        return res.status(400).json({ error: 'Game ID and characters array are required' });
      }

      const createdCharacters = [];

      for (const characterData of characters) {
        const { character_key, name, description, avatar, abilities } = characterData;

        if (!character_key || !name) {
          return res.status(400).json({ error: 'All characters must have character_key and name' });
        }

        const character = {
          game_id: gameId,
          character_key,
          name,
          description,
          avatar,
          abilities: Array.isArray(abilities) ? abilities : []
        };

        const newCharacter = await this.characterService.createCharacter(character);
        createdCharacters.push(newCharacter);
      }

      res.status(201).json(createdCharacters);
    } catch (error) {
      logger.error('Error creating multiple characters:', error);
      res.status(500).json({ error: 'Failed to create characters' });
    }
  }
}