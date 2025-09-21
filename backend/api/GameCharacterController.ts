import { Request, Response } from 'express';
import { GameCharacterService } from '../services/GameCharacterService';
import { Database } from 'sqlite3';
import { 
  CreateCharacterSchema, 
  UpdateCharacterSchema, 
  BulkCreateCharactersSchema,
  GameIdParamSchema,
  CharacterIdParamSchema
} from '../validation/schemas';
import { validateData, safeValidateData } from '../validation/middleware';

//pour le logging
import winston from 'winston';
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
      // Validation simple du paramètre gameId
      const gameIdStr = req.params.gameId;
      const gameId = parseInt(gameIdStr);
      
      if (isNaN(gameId) || gameId <= 0) {
        return res.status(400).json({ 
          error: 'ID de jeu invalide'
        });
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
      if (error instanceof Error && error.message === 'Character not found') {
        res.status(404).json({ error: 'Character not found' });
      } else {
        res.status(500).json({ error: 'Failed to fetch character' });
      }
    }
  }

  // POST /api/games/:gameId/characters
  async createCharacter(req: Request, res: Response) {
    try {
      // Validation simple du paramètre gameId
      const gameIdStr = req.params.gameId;
      const gameId = parseInt(gameIdStr);
      
      if (isNaN(gameId) || gameId <= 0) {
        return res.status(400).json({ 
          error: 'ID de jeu invalide'
        });
      }

      // Validation du corps de la requête avec Zod
      const validation = safeValidateData(CreateCharacterSchema, {
        ...req.body,
        game_id: gameId
      });
      
      if (!validation.success) {
        return res.status(400).json({
          error: 'Données de personnage invalides',
          details: validation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      const characterData = validation.data;
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
      // Validation simple du paramètre characterId
      const characterIdStr = req.params.characterId;
      const characterId = parseInt(characterIdStr);
      
      if (isNaN(characterId) || characterId <= 0) {
        return res.status(400).json({ 
          error: 'ID de personnage invalide'
        });
      }

      // Validation du corps de la requête avec Zod
      const validation = safeValidateData(UpdateCharacterSchema, req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          error: 'Données de mise à jour invalides',
          details: validation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      const updates = validation.data;
      const updatedCharacter = await this.characterService.updateCharacter(characterId, updates);
      res.json(updatedCharacter);
    } catch (error: any) {
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
      // Validation du corps de la requête avec Zod
      const validation = safeValidateData(BulkCreateCharactersSchema, req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          error: 'Données de création en lot invalides',
          details: validation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      const { gameId, characters } = validation.data;
      const createdCharacters = [];

      for (const characterData of characters) {
        const character = {
          ...characterData,
          game_id: gameId
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