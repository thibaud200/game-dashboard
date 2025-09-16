import { Database } from 'sqlite3';
import { GameCharacter } from '../models/interfaces';

export class GameCharacterService {
  constructor(private db: Database) {}

  async getCharactersByGameId(gameId: number): Promise<GameCharacter[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT character_id, game_id, character_key, name, description, avatar, abilities
        FROM game_characters 
        WHERE game_id = ?
        ORDER BY character_key
      `;
      
      this.db.all(sql, [gameId], (err, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }
        
        const characters = rows.map(row => ({
          character_id: row.character_id,
          game_id: row.game_id,
          character_key: row.character_key,
          name: row.name,
          description: row.description,
          avatar: row.avatar,
          abilities: row.abilities ? JSON.parse(row.abilities) : []
        }));
        
        resolve(characters);
      });
    });
  }

  async createCharacter(character: Omit<GameCharacter, 'character_id'>): Promise<GameCharacter> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO game_characters (game_id, character_key, name, description, avatar, abilities)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      const abilities = character.abilities ? JSON.stringify(character.abilities) : null;
      
      this.db.run(
        sql,
        [character.game_id, character.character_key, character.name, character.description, character.avatar, abilities],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({
            character_id: this.lastID,
            ...character
          });
        }
      );
    });
  }

  async updateCharacter(characterId: number, updates: Partial<GameCharacter>): Promise<GameCharacter> {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];
      
      if (updates.character_key !== undefined) {
        fields.push('character_key = ?');
        values.push(updates.character_key);
      }
      if (updates.name !== undefined) {
        fields.push('name = ?');
        values.push(updates.name);
      }
      if (updates.description !== undefined) {
        fields.push('description = ?');
        values.push(updates.description);
      }
      if (updates.avatar !== undefined) {
        fields.push('avatar = ?');
        values.push(updates.avatar);
      }
      if (updates.abilities !== undefined) {
        fields.push('abilities = ?');
        values.push(JSON.stringify(updates.abilities));
      }
      
      if (fields.length === 0) {
        reject(new Error('No fields to update'));
        return;
      }
      
      values.push(characterId);
      
      const sql = `UPDATE game_characters SET ${fields.join(', ')} WHERE character_id = ?`;
      
      this.db.run(sql, values, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Return the updated character
        this.getCharacterById(characterId).then(resolve).catch(reject);
      });
    });
  }

  async getCharacterById(characterId: number): Promise<GameCharacter> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT character_id, game_id, character_key, name, description, avatar, abilities
        FROM game_characters 
        WHERE character_id = ?
      `;
      
      this.db.get(sql, [characterId], (err, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          reject(new Error('Character not found'));
          return;
        }
        
        resolve({
          character_id: row.character_id,
          game_id: row.game_id,
          character_key: row.character_key,
          name: row.name,
          description: row.description,
          avatar: row.avatar,
          abilities: row.abilities ? JSON.parse(row.abilities) : []
        });
      });
    });
  }

  async deleteCharacter(characterId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM game_characters WHERE character_id = ?';
      
      this.db.run(sql, [characterId], (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve();
      });
    });
  }

  async deleteCharactersByGameId(gameId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM game_characters WHERE game_id = ?';
      
      this.db.run(sql, [gameId], (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve();
      });
    });
  }
}