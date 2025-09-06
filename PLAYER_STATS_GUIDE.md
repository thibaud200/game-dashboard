# Individual Player Statistics - User Guide

## Overview
The application already provides comprehensive individual player statistics functionality through the PlayerStatsPage component.

## How to Access Individual Player Stats

### From Players Page
1. Navigate to the "Players" tab in the bottom navigation
2. Find the player card you want to view stats for
3. Look for the stats link/button on the player card
4. Click to view detailed individual statistics

### From Dashboard
1. Players displayed on the dashboard also have stats access
2. Click on any player to view their individual statistics

## Available Statistics

### Individual Player View
When viewing a specific player's statistics, you'll see:

- **Player Profile**: Name, avatar, and key metrics
- **Performance Metrics**: 
  - Total games played
  - Number of wins
  - Total score accumulated
  - Average score per game
  - Favorite game
- **Detailed Rankings**: Position compared to other players
- **Recent Activity**: Latest games played with scores and results
- **Performance Charts**: Visual representation of performance over time

### General Statistics View
When no specific player is selected, you see:
- Overview of all players
- Top player rankings
- Overall statistics across all players
- Recent activity from all players

## Key Features

### Real-time Data
- Statistics update automatically when new games are played
- Win/loss ratios calculated dynamically
- Score averages computed in real-time

### Visual Presentation
- Clean, modern interface with glassmorphic design
- Color-coded performance indicators
- Trophy and medal icons for achievements
- Chart placeholders for future data visualization

### Navigation
- Easy back navigation to players list
- Bottom navigation bar for quick access to other sections
- Contextual navigation based on user journey

## Technical Implementation

The PlayerStatsPage component handles:
- Individual player filtering when `selectedPlayerId` is provided
- Automatic calculation of statistics from game session data
- Responsive design for mobile and desktop viewing
- Integration with the overall app navigation system

## Future Enhancements
- Performance charts implementation
- Historical trend analysis
- Comparative statistics between players
- Export functionality for player statistics
- Achievement system integration