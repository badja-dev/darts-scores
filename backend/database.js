const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const db = new Database(path.join(__dirname, 'darts.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const initDatabase = () => {
  // Players table
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Games table
  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_type TEXT NOT NULL,
      format TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    )
  `);

  // Game players (many-to-many relationship)
  db.exec(`
    CREATE TABLE IF NOT EXISTS game_players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      player_id INTEGER NOT NULL,
      final_score INTEGER DEFAULT 0,
      position INTEGER,
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
      FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
    )
  `);

  // Legs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS legs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      leg_number INTEGER NOT NULL,
      winner_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
      FOREIGN KEY (winner_id) REFERENCES players(id) ON DELETE SET NULL
    )
  `);

  // Throws table (individual dart throws)
  db.exec(`
    CREATE TABLE IF NOT EXISTS throws (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      leg_id INTEGER NOT NULL,
      player_id INTEGER NOT NULL,
      throw_number INTEGER NOT NULL,
      dart_number INTEGER NOT NULL CHECK(dart_number IN (1, 2, 3)),
      score INTEGER NOT NULL,
      multiplier INTEGER NOT NULL CHECK(multiplier IN (1, 2, 3)),
      is_miss BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (leg_id) REFERENCES legs(id) ON DELETE CASCADE,
      FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
    )
  `);

  // Statistics table for aggregated player stats
  db.exec(`
    CREATE TABLE IF NOT EXISTS player_statistics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id INTEGER NOT NULL,
      game_id INTEGER NOT NULL,
      three_dart_average REAL,
      one_dart_average REAL,
      darts_thrown INTEGER DEFAULT 0,
      highest_checkout INTEGER,
      doubles_hit INTEGER DEFAULT 0,
      doubles_attempted INTEGER DEFAULT 0,
      legs_played INTEGER DEFAULT 0,
      legs_won INTEGER DEFAULT 0,
      FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized successfully');
};

// Initialize on import
initDatabase();

module.exports = db;
