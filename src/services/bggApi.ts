// BoardGameGeek API integration service
export interface BGGGame {
  id: number
  name: string
  image: string
  thumbnail: string
  description: string
  min_players: number
  max_players: number
  playing_time: number
  min_playtime: number
  max_playtime: number
  min_age: number
  year_published: number
  designers: string[]
  publishers: string[]
  categories: string[]
  mechanics: string[]
  rating: number
  weight: number
  expansions: BGGExpansion[]
  characters: BGGCharacter[]
  supports_cooperative: boolean
  supports_competitive: boolean
  supports_campaign: boolean
  supports_hybrid: boolean
  is_expansion: boolean
  base_game_id?: number
}

export interface BGGExpansion {
  expansion_id?: number
  bgg_expansion_id: number
  name: string
  year_published: number
  description?: string
}

export interface BGGCharacter {
  character_id?: string
  character_key: string
  name: string
  description: string
  abilities: string[]
  avatar?: string
}

export interface BGGSearchResult {
  id: number
  name: string
  year_published: number
  type: string
}

class BGGApiService {
  private readonly baseUrl = 'https://boardgamegeek.com/xmlapi2'
  private readonly corsProxy = 'https://api.allorigins.win/raw?url='

  /**
   * Search for games by name
   */
  async searchGames(query: string): Promise<BGGSearchResult[]> {
    try {
      const encodedQuery = encodeURIComponent(query)
      const url = `${this.corsProxy}${encodeURIComponent(`${this.baseUrl}/search?query=${encodedQuery}&type=boardgame`)}`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`BGG API error: ${response.status}`)
      }
      
      const xmlText = await response.text()
      return this.parseSearchResults(xmlText)
    } catch (error) {
      console.error('Error searching BGG:', error)
      return []
    }
  }

  /**
   * Get detailed game information by BGG ID
   */
  async getGameDetails(bggId: number): Promise<BGGGame | null> {
    try {
      const url = `${this.corsProxy}${encodeURIComponent(`${this.baseUrl}/thing?id=${bggId}&stats=1`)}`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`BGG API error: ${response.status}`)
      }
      
      const xmlText = await response.text()
      return this.parseGameDetails(xmlText, bggId)
    } catch (error) {
      console.error('Error fetching BGG game details:', error)
      return null
    }
  }

  /**
   * Get expansions for a game
   */
  async getGameExpansions(bggId: number): Promise<BGGExpansion[]> {
    try {
      const url = `${this.corsProxy}${encodeURIComponent(`${this.baseUrl}/thing?id=${bggId}&stats=1`)}`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`BGG API error: ${response.status}`)
      }
      
      const xmlText = await response.text()
      return this.parseExpansions(xmlText)
    } catch (error) {
      console.error('Error fetching BGG expansions:', error)
      return []
    }
  }

  private parseSearchResults(xmlText: string): BGGSearchResult[] {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
      const items = xmlDoc.getElementsByTagName('item')
      
      const results: BGGSearchResult[] = []
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const id = parseInt(item.getAttribute('id') || '0')
        const nameElement = item.getElementsByTagName('name')[0]
        const yearElement = item.getElementsByTagName('yearpublished')[0]
        
        if (id && nameElement) {
          results.push({
            id,
            name: nameElement.getAttribute('value') || '',
            year_published: parseInt(yearElement?.getAttribute('value') || '0'),
            type: item.getAttribute('type') || ''
          })
        }
      }
      
      return results.slice(0, 10) // Limit to 10 results
    } catch (error) {
      console.error('Error parsing search results:', error)
      return []
    }
  }

  private parseGameDetails(xmlText: string, bggId: number): BGGGame | null {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
      const item = xmlDoc.getElementsByTagName('item')[0]
      
      if (!item) return null

      // Basic info
      const names = item.getElementsByTagName('name')
      const primaryName = names[0]?.getAttribute('value') || ''
      
      const images = item.getElementsByTagName('image')
      const thumbnails = item.getElementsByTagName('thumbnail')
      const descriptions = item.getElementsByTagName('description')
      
      // Player counts
      const minPlayers = parseInt(this.getNodeValue(item, 'minplayers') || '1')
      const maxPlayers = parseInt(this.getNodeValue(item, 'maxplayers') || '1')
      const minAge = parseInt(this.getNodeValue(item, 'minage') || '8')
      const playingTime = parseInt(this.getNodeValue(item, 'playingtime') || '0')
      const minPlaytime = parseInt(this.getNodeValue(item, 'minplaytime') || playingTime.toString())
      const maxPlaytime = parseInt(this.getNodeValue(item, 'maxplaytime') || playingTime.toString())
      
      // Publication info
      const yearPublished = parseInt(this.getNodeValue(item, 'yearpublished') || '0')
      
      // Get categories and mechanics
      const categories = this.getLinkValues(item, 'boardgamecategory')
      const mechanics = this.getLinkValues(item, 'boardgamemechanic')
      const designers = this.getLinkValues(item, 'boardgamedesigner')
      const publishers = this.getLinkValues(item, 'boardgamepublisher')
      
      // Stats
      const statistics = item.getElementsByTagName('statistics')[0]
      const ratings = statistics?.getElementsByTagName('ratings')[0]
      const average = parseFloat(ratings?.getElementsByTagName('average')[0]?.getAttribute('value') || '0')
      const averageweight = parseFloat(ratings?.getElementsByTagName('averageweight')[0]?.getAttribute('value') || '0')

      // Determine game modes based on categories and mechanics
      const gameModes = this.determineGameModes(categories, mechanics)
      
      // Get expansions
      const expansions = this.parseExpansions(xmlText)

      // Generate mock characters based on game theme
      const characters = this.generateMockCharacters(primaryName, categories)

      return {
        id: bggId,
        name: primaryName,
        image: images[0]?.textContent || '',
        thumbnail: thumbnails[0]?.textContent || '',
        description: descriptions[0]?.textContent?.replace(/<[^>]*>/g, '') || '',
        min_players: minPlayers,
        max_players: maxPlayers,
        playing_time: playingTime,
        min_playtime: minPlaytime,
        max_playtime: maxPlaytime,
        min_age: minAge,
        year_published: yearPublished,
        designers,
        publishers,
        categories,
        mechanics,
        rating: average,
        weight: averageweight,
        expansions,
        characters,
        supports_cooperative: gameModes.cooperative,
        supports_competitive: gameModes.competitive,
        supports_campaign: gameModes.campaign,
        supports_hybrid: gameModes.hybrid,
        is_expansion: this.getLinkValues(item, 'boardgameexpansion').length > 0,
        base_game_id: this.getBaseGameId(item)
      }
    } catch (error) {
      console.error('Error parsing game details:', error)
      return null
    }
  }

  private parseExpansions(xmlText: string): BGGExpansion[] {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
      const item = xmlDoc.getElementsByTagName('item')[0]
      
      if (!item) return []

      const expansionLinks = item.querySelectorAll('link[type="boardgameexpansion"]')
      const expansions: BGGExpansion[] = []

      expansionLinks.forEach(link => {
        const id = parseInt(link.getAttribute('id') || '0')
        const name = link.getAttribute('value') || ''
        
        if (id && name) {
          expansions.push({
            bgg_expansion_id: id,
            name,
            year_published: 0 // Would need separate API call for each expansion
          })
        }
      })

      return expansions
    } catch (error) {
      console.error('Error parsing expansions:', error)
      return []
    }
  }

  private generateMockCharacters(gameName: string, categories: string[]): BGGCharacter[] {
    // Simple character generation based on game categories
    const characters: BGGCharacter[] = []
    
    if (categories.some(cat => cat.toLowerCase().includes('fantasy') || cat.toLowerCase().includes('adventure'))) {
      characters.push(
        {
          character_key: 'warrior',
          name: 'Warrior',
          description: 'A brave fighter skilled in combat',
          abilities: ['Melee Combat', 'Heavy Armor', 'Battle Cry']
        },
        {
          character_key: 'mage',
          name: 'Mage',
          description: 'A wielder of arcane magic',
          abilities: ['Spell Casting', 'Elemental Magic', 'Mystic Shield']
        }
      )
    }
    
    if (categories.some(cat => cat.toLowerCase().includes('sci-fi') || cat.toLowerCase().includes('space'))) {
      characters.push(
        {
          character_key: 'pilot',
          name: 'Pilot',
          description: 'Expert spacecraft operator',
          abilities: ['Ship Navigation', 'Evasive Maneuvers', 'Technical Repair']
        },
        {
          character_key: 'engineer',
          name: 'Engineer',
          description: 'Technology specialist',
          abilities: ['Equipment Repair', 'System Hacking', 'Shield Boost']
        }
      )
    }

    if (categories.some(cat => cat.toLowerCase().includes('economic') || cat.toLowerCase().includes('trading'))) {
      characters.push(
        {
          character_key: 'merchant',
          name: 'Merchant',
          description: 'Expert trader and negotiator',
          abilities: ['Resource Trading', 'Market Analysis', 'Profit Boost']
        }
      )
    }

    return characters
  }

  private determineGameModes(categories: string[], mechanics: string[]): {
    cooperative: boolean,
    competitive: boolean,
    campaign: boolean,
    hybrid: boolean
  } {
    const categoryStr = categories.join(' ').toLowerCase()
    const mechanicStr = mechanics.join(' ').toLowerCase()
    
    const modes = {
      cooperative: false,
      competitive: true, // Default to competitive for most games
      campaign: false,
    hybrid: false
    }
    
    // Check for cooperative elements
    if (mechanicStr.includes('cooperative') || 
        mechanicStr.includes('co-op') ||
        categoryStr.includes('cooperative')) {
      modes.cooperative = true
    }
    
    // Check for campaign/legacy elements
    if (mechanicStr.includes('campaign') || 
        mechanicStr.includes('legacy') ||
        categoryStr.includes('campaign') || 
        categoryStr.includes('legacy') ||
        mechanicStr.includes('story') ||
        mechanicStr.includes('narrative')) {
      modes.campaign = true
    }
    
    // Check for hybrid elements (semi-cooperative, team vs team, etc.)
    if (mechanicStr.includes('semi-cooperative') || 
        mechanicStr.includes('semi cooperative') ||
        mechanicStr.includes('team') ||
        mechanicStr.includes('traitor') ||
        mechanicStr.includes('hidden role') ||
        (modes.cooperative && modes.competitive)) {
      modes.hybrid = true
    }
    
    // If cooperative but no competitive elements, turn off competitive
    if (modes.cooperative && !mechanicStr.includes('competitive') && !mechanicStr.includes('versus')) {
      // Keep competitive true unless clearly only cooperative
      if (mechanicStr.includes('fully cooperative') || categoryStr.includes('fully cooperative')) {
        modes.competitive = false
      }
    }
    
    return modes
  }

  private getNodeValue(item: Element, tagName: string): string | null {
    const elements = item.getElementsByTagName(tagName)
    return elements[0]?.getAttribute('value') || null
  }

  private getLinkValues(item: Element, type: string): string[] {
    const links = item.querySelectorAll(`link[type="${type}"]`)
    const values: string[] = []
    
    links.forEach(link => {
      const value = link.getAttribute('value')
      if (value) values.push(value)
    })
    
    return values
  }

  private getBaseGameId(item: Element): number | undefined {
    const baseGameLinks = item.querySelectorAll('link[type="boardgameimplementation"]')
    if (baseGameLinks.length > 0) {
      return parseInt(baseGameLinks[0].getAttribute('id') || '0') || undefined
    }
    return undefined
  }
}

export const bggApiService = new BGGApiService()