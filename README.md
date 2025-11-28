# 🎯 Darts Scores

A professional, full-stack web application for tracking darts scores with persistent data storage. Features real-time scoring, comprehensive statistics, and complete game management for 301/501/701 darts games.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.x-61dafb.svg)](https://reactjs.org/)

## ✨ Features

### 🎮 Game Management
- **Multiple Game Types**: Support for 301, 501, and 701 games
- **Format Options**: Double Out and Straight Out rules
- **Custom Player Names**: Personalize your gaming experience
- **New Game Flow**: Easy setup screen with game configuration
- **Winner Detection**: Automatic win detection with proper checkout rules
- **Bust Detection**: Smart bust detection for scores below 0 or exactly 1

### 🎯 Scoring Methods
- **Interactive Dartboard**: Click-based SVG dartboard with proper segment layout
  - Singles, doubles, and triples support
  - Bull (25) and Double Bull (50)
  - Visual feedback and hover effects
- **Manual Keypad**: Number pad for quick manual entry
  - Multiplier selection (Single/Double/Triple)
  - Input validation
  - Quick-access Bull and MISS buttons

### 📊 Statistics & Analytics
- **Real-time Statistics**: Live calculation of player performance
  - 3-dart average
  - 1-dart average
  - Highest score
  - Total darts thrown
  - Doubles hit
  - Triples hit
  - Total score
  - Turns played
- **Throw History**: Complete game history with turn-by-turn breakdown
  - Player names per turn
  - Individual dart scores
  - Turn totals
  - Bust indicators
  - Remaining scores
- **Checkout Suggestions**: Dynamic checkout paths for scores 2-170
  - Optimal finish routes (e.g., "T20 → T17 → D20")
  - Real-time updates based on remaining score

### 🎨 User Interface
- **Modern Dark Theme**: Professional color scheme
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Tab Navigation**: Easy switching between:
  - Dartboard view
  - Keypad entry
  - History timeline
  - Statistics dashboard
- **Current Turn Display**: Visual feedback for all 3 darts
- **Undo/Reset**: Mistake correction and turn management

### 💾 Data Persistence
- **SQLite Database**: Local file-based storage
- **Complete Game Tracking**: Players, games, legs, throws, and statistics
- **No Internet Required**: Fully standalone operation
- **Session Persistence**: All data saved between sessions

## 🚀 Quick Start

**Complete Beginner?** Read **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for detailed step-by-step instructions!

**Want the fastest method?** See **[QUICK_START.txt](QUICK_START.txt)** - 4 steps to get playing!

### Prerequisites
- [Node.js](https://nodejs.org/) 18.0 or higher
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd darts-scores
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server** (Terminal 1)
   ```bash
   cd backend
   npm start
   ```
   Backend will run on `http://localhost:3001`

2. **Start the frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` and start playing!

### Development Mode

For auto-reload during development:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```
The frontend uses Vite's HMR for instant updates.

## 📁 Project Structure

```
darts-scores/
├── frontend/               # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Dartboard.jsx       # Interactive dartboard
│   │   │   ├── Keypad.jsx          # Manual score entry
│   │   │   ├── PlayersList.jsx     # Player display
│   │   │   ├── CurrentTurn.jsx     # Turn management
│   │   │   ├── History.jsx         # Throw history
│   │   │   ├── Statistics.jsx      # Stats dashboard
│   │   │   └── GameSetup.jsx       # Game configuration
│   │   ├── services/      # API integration
│   │   │   └── api.js              # Backend API calls
│   │   ├── utils/         # Utilities
│   │   │   └── checkouts.js        # Checkout suggestions
│   │   ├── App.jsx        # Main application
│   │   └── index.css      # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── backend/               # Node.js + Express + SQLite
│   ├── server.js          # Express server
│   ├── database.js        # SQLite schema & initialization
│   ├── darts.db          # SQLite database (created on first run)
│   └── package.json
│
└── README.md
```

## 🎲 How to Play

1. **Game Setup**
   - Enter player names
   - Select game type (301/501/701)
   - Choose format (Double Out/Straight Out)
   - Click "Start Game"

2. **Scoring**
   - Use interactive dartboard or keypad
   - Enter 3 darts per turn
   - Scores automatically update
   - Undo button available for mistakes

3. **Winning**
   - **Double Out**: Must finish exactly on a double
   - **Straight Out**: Any dart can finish
   - Bust if score goes below 0 or lands on 1

4. **Tracking**
   - View throw history in History tab
   - Check statistics in Stats tab
   - See checkout suggestions for finishing

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern UI library
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first styling
- **SVG Graphics**: Interactive dartboard

### Backend
- **Node.js**: JavaScript runtime
- **Express 5**: Web framework
- **SQLite**: Embedded database
- **better-sqlite3**: Synchronous SQLite driver
- **CORS**: Cross-origin resource sharing

## 🗄️ Database Schema

- **players**: Player information
- **games**: Game sessions with type and format
- **game_players**: Many-to-many player-game relationships
- **legs**: Individual legs within games
- **throws**: Every dart thrown with score and multiplier
- **player_statistics**: Aggregated performance metrics

## 🚢 Deployment

### For Friends (Local Deployment)

1. Share the entire `darts-scores` folder
2. They install Node.js 18+
3. They run the installation steps above
4. Data persists in `backend/darts.db`
5. No internet required after setup

### Production Deployment

**Backend:**
- Deploy to any Node.js hosting (Heroku, Railway, DigitalOcean)
- Set `PORT` environment variable
- SQLite file will be created automatically

**Frontend:**
- Build: `npm run build`
- Deploy `dist/` folder to Netlify, Vercel, or any static host
- Update API base URL in `frontend/src/services/api.js`

## 🎯 Game Rules

### 501 Double Out (Default)
- Start with 501 points
- Subtract dart scores from total
- **Must finish exactly on a double**
- Landing on 0 or 1 = BUST (turn doesn't count)
- First to reach exactly 0 wins

### Other Game Types
- **301**: Shorter games, same rules
- **701**: Longer games, same rules
- **Straight Out**: Can finish on any dart

## 🤝 Contributing

This is a personal/friend project, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Claude Code](https://claude.com/claude-code)
- Dartboard design inspired by professional darts regulations
- Checkout suggestions based on professional darts strategies

## 📧 Support

Having issues? Check:
1. Node.js version is 18+
2. Both servers are running
3. No port conflicts (3001 for backend, 5173 for frontend)
4. Database file has write permissions

## 🎉 Have Fun!

Enjoy tracking your darts games and improving your skills!

---

Made with ❤️ for darts enthusiasts everywhere
