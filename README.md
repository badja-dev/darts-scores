# Darts Scores

A full-stack web application for tracking darts scores with persistent data storage. Track player performance, view rolling averages, and maintain a complete scoring system for darts games.

## Features

- **Player Score Tracking**: Record and track scores for multiple players
- **Rolling Averages**: View performance metrics and rolling averages over time
- **Session Persistence**: All data is saved between sessions using SQLite
- **Perfect Scoring System**: Accurate darts scoring with game rules built-in
- **Statistics Dashboard**: Comprehensive statistics and performance analytics
- **Standalone Deployment**: Can be deployed locally by anyone for personal use

## Project Structure

```
darts-scores/
├── frontend/          # React + Vite + Tailwind CSS frontend
├── backend/           # Node.js + Express + SQLite backend
└── README.md          # Project documentation
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: SQLite with better-sqlite3

## Getting Started

### Prerequisites
- Node.js 18+ installed

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd darts-scores
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```
The API will run on `http://localhost:3001`

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```
The app will run on `http://localhost:5173`

### Development Mode

For backend auto-reload on changes:
```bash
cd backend
npm run dev
```

## Database Schema

The SQLite database includes the following tables:
- **players**: Player information
- **games**: Game sessions (501, 301, etc.)
- **game_players**: Many-to-many relationship between games and players
- **legs**: Individual legs within games
- **throws**: Individual dart throws with scores
- **player_statistics**: Aggregated statistics per player per game

## Standalone Deployment

This application is designed to be deployed locally:
1. Share the codebase with friends
2. They run `npm install` in both frontend and backend
3. Start both servers locally
4. All data is stored in a local SQLite database file (`backend/darts.db`)
5. No internet connection required after installation

## License

TBD
