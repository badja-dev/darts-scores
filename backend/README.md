# Darts Scores - Backend API

RESTful API for the Darts Scores application. Built with Node.js, Express, and SQLite.

## 📋 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Players

#### Get All Players
```
GET /api/players
```
Returns array of all players.

#### Create Player
```
POST /api/players
Content-Type: application/json

{
  "name": "Player Name"
}
```

#### Get Player Statistics
```
GET /api/players/:id/statistics
```
Returns aggregated statistics for a player across all games.

### Games

#### Get All Games
```
GET /api/games
```
Returns array of all games.

#### Create Game
```
POST /api/games
Content-Type: application/json

{
  "game_type": "501",
  "format": "Double Out",
  "player_ids": [1, 2]
}
```

#### Get Game Details
```
GET /api/games/:id
```
Returns game with players and statistics.

### Throws

#### Record Throw
```
POST /api/throws
Content-Type: application/json

{
  "leg_id": 1,
  "player_id": 1,
  "throw_number": 1,
  "dart_number": 1,
  "score": 20,
  "multiplier": 3,
  "is_miss": false
}
```

## 🗄️ Database Schema

### players
- `id` INTEGER PRIMARY KEY
- `name` TEXT NOT NULL
- `created_at` DATETIME

### games
- `id` INTEGER PRIMARY KEY
- `game_type` TEXT NOT NULL (e.g., "501")
- `format` TEXT NOT NULL (e.g., "Double Out")
- `created_at` DATETIME
- `completed_at` DATETIME

### game_players
- `id` INTEGER PRIMARY KEY
- `game_id` INTEGER FOREIGN KEY
- `player_id` INTEGER FOREIGN KEY
- `final_score` INTEGER
- `position` INTEGER

### legs
- `id` INTEGER PRIMARY KEY
- `game_id` INTEGER FOREIGN KEY
- `leg_number` INTEGER
- `winner_id` INTEGER FOREIGN KEY
- `created_at` DATETIME
- `completed_at` DATETIME

### throws
- `id` INTEGER PRIMARY KEY
- `leg_id` INTEGER FOREIGN KEY
- `player_id` INTEGER FOREIGN KEY
- `throw_number` INTEGER
- `dart_number` INTEGER (1, 2, or 3)
- `score` INTEGER
- `multiplier` INTEGER (1, 2, or 3)
- `is_miss` BOOLEAN
- `created_at` DATETIME

### player_statistics
- `id` INTEGER PRIMARY KEY
- `player_id` INTEGER FOREIGN KEY
- `game_id` INTEGER FOREIGN KEY
- `three_dart_average` REAL
- `one_dart_average` REAL
- `darts_thrown` INTEGER
- `highest_checkout` INTEGER
- `doubles_hit` INTEGER
- `doubles_attempted` INTEGER
- `legs_played` INTEGER
- `legs_won` INTEGER

## 🚀 Running

### Development
```bash
npm run dev
```
Uses Node.js --watch flag for auto-reload.

### Production
```bash
npm start
```

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 3001)

### Database
- Database file: `darts.db` (created automatically)
- Location: Same directory as `server.js`

## 📦 Dependencies

- **express**: Web framework
- **better-sqlite3**: SQLite database driver
- **cors**: CORS middleware

## 🛡️ Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

Error responses include:
```json
{
  "error": "Error message description"
}
```

## 🔐 Security Notes

- CORS is enabled for all origins (suitable for local deployment)
- For production, configure CORS to allow specific origins only
- No authentication required (designed for local/friend use)
- Database is file-based and portable

## 📝 Notes

- Foreign key constraints are enabled
- Database is initialized automatically on first run
- All timestamps use SQLite's CURRENT_TIMESTAMP
- Transactions are used for multi-step operations
