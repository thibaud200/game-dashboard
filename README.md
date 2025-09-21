# 🎲 Board Game Dashboard

A modern, responsive web application for managing board game sessions, tracking player statistics, and organizing your game collection.

## ✨ Features

### 🎯 Game Management
- **Comprehensive Game Library**: Add, edit, and organize your board game collection
- **BoardGameGeek Integration**: Automatic game data population from BGG API
- **Game Details**: Track difficulty, player count, duration, and game modes
- **Expansions & Characters**: Manage game expansions and character roles
- **Smart Search**: Find games quickly with intelligent filtering

### 👥 Player Management  
- **Player Profiles**: Create and manage player profiles with avatars
- **Performance Tracking**: Track wins, scores, and game history
- **Individual Statistics**: Detailed stats for each player
- **Comparative Analytics**: Compare player performance across games

### 📊 Statistics & Analytics
- **Real-time Dashboard**: Overview of players, games, and recent activity
- **Performance Metrics**: Win rates, average scores, favorite games
- **Visual Charts**: Performance trends and historical data
- **Ranking Systems**: Player leaderboards and achievements

### 🎮 Game Sessions
- **Session Creation**: Set up new game sessions with selected players
- **Multiple Game Types**: Support for competitive, cooperative, and campaign games
- **Score Tracking**: Record scores and determine winners
- **Session History**: Complete game session archive

## 🏗️ Architecture

### Frontend Structure
```
src/
├── 📖 docs/                # Frontend documentation
├── 🎯 components/          # React components (business logic)
├── 🔄 hooks/              # Custom hooks (reusable logic)
├── 🎨 views/              # View components (presentation)
├── 🌐 services/           # API services (BGG, backend)
├── 📝 types/              # TypeScript definitions
├── 🛠️ utils/              # Utility functions
└── 🎨 styles/             # CSS and styling
```

### Key Patterns
- **Container/Presenter Pattern**: Separation of logic and presentation
- **Custom Hooks**: Reusable business logic extraction
- **TypeScript First**: Complete type safety throughout
- **Responsive Design**: Mobile-first, touch-friendly interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development
```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Build for production
npm run build
```

## 🎨 Design System

### Visual Identity
- **Glassmorphic Design**: Modern, clean aesthetic with glass-like elements
- **Dark Theme**: Sophisticated dark color scheme with teal/emerald accents
- **Consistent Typography**: Inter font family for optimal readability
- **Color Palette**: Carefully selected colors for accessibility and beauty

### User Experience
- **Mobile-First**: Responsive design optimizing for all screen sizes
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Context-Aware Navigation**: Smart navigation that remembers user journey
- **Instant Feedback**: Real-time validation and visual feedback

## 📱 Platform Support

### Desktop
- **Full Feature Access**: Complete functionality with rich interactions
- **Hover States**: Enhanced desktop experience with tooltips and hover effects
- **Keyboard Navigation**: Full keyboard accessibility support

### Mobile
- **Context Menus**: Touch-optimized action menus
- **Swipe Gestures**: Intuitive navigation gestures
- **Responsive Layout**: Adaptive interface for all screen sizes

## 📖 Documentation

### Frontend Documentation
- [`/src/docs/ARCHITECTURE.md`](src/docs/ARCHITECTURE.md) - Complete frontend architecture
- [`/src/docs/REFACTORING_GUIDE.md`](src/docs/REFACTORING_GUIDE.md) - Development patterns and guidelines  
- [`/src/docs/NAVIGATION_CONTEXT.md`](src/docs/NAVIGATION_CONTEXT.md) - Navigation system documentation
- [`/src/docs/PLAYER_STATS_GUIDE.md`](src/docs/PLAYER_STATS_GUIDE.md) - Player statistics implementation
- [`/src/docs/DIALOG_REORGANIZATION.md`](src/docs/DIALOG_REORGANIZATION.md) - Dialog management system
- [`/src/docs/ISSUE_RESOLUTION.md`](src/docs/ISSUE_RESOLUTION.md) - Common issues and solutions

### Migration Guides
- [`/DOCUMENTATION_MIGRATION.md`](DOCUMENTATION_MIGRATION.md) - Documentation migration guide

## 🛠️ Technology Stack

### Core Technologies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Complete type safety and developer experience
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework

### UI Components
- **shadcn/ui**: High-quality, accessible UI components
- **Radix UI**: Unstyled, accessible component primitives
- **Phosphor Icons**: Beautiful, consistent icon system

### External Integrations
- **BoardGameGeek API**: Game data and information
- **Local Storage**: Client-side data persistence

## 🔧 Development Guidelines

### Code Organization
1. **Components**: Business logic and state management
2. **Views**: Pure presentation components  
3. **Hooks**: Reusable logic extraction
4. **Services**: External API integrations
5. **Types**: Centralized TypeScript definitions

### Best Practices
- Follow Container/Presenter pattern
- Write comprehensive TypeScript types
- Implement proper error handling
- Ensure mobile responsiveness
- Add accessibility features
- Document complex logic

### Testing
- Test all navigation flows
- Verify form validation
- Check accessibility compliance
- Validate responsive design
- Test API integrations

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Follow** established patterns and conventions
4. **Test** thoroughly on mobile and desktop
5. **Document** any new features or changes
6. **Submit** a pull request

### Code Standards
- Follow existing TypeScript conventions
- Use established component patterns
- Implement proper error handling
- Ensure accessibility compliance
- Write clear, self-documenting code

## 📄 License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.

---

## 🎯 Getting Started

Ready to explore? Start by checking out the [`/src/docs/ARCHITECTURE.md`](src/docs/ARCHITECTURE.md) for a complete overview of the application structure, or dive into the code by running `npm run dev` to start the development server.

**Happy gaming!** 🎲✨