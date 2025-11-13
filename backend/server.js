const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Darts Scores API is running' });
});

// Get all players
app.get('/api/players', (req, res) => {
  try {
    const players = db.prepare('SELECT * FROM players ORDER BY created_at DESC').all();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new player
app.post('/api/players', (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Player name is required' });
    }

    const stmt = db.prepare('INSERT INTO players (name) VALUES (?)');
    const result = stmt.run(name);

    const player = db.prepare('SELECT * FROM players WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all games
app.get('/api/games', (req, res) => {
  try {
    const games = db.prepare('SELECT * FROM games ORDER BY created_at DESC').all();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new game
app.post('/api/games', (req, res) => {
  try {
    const { game_type, format, player_ids } = req.body;

    if (!game_type || !format || !player_ids || player_ids.length === 0) {
      return res.status(400).json({ error: 'Game type, format, and players are required' });
    }

    // Start transaction
    const insertGame = db.prepare('INSERT INTO games (game_type, format) VALUES (?, ?)');
    const insertGamePlayer = db.prepare('INSERT INTO game_players (game_id, player_id) VALUES (?, ?)');

    const transaction = db.transaction((gameType, gameFormat, playerIds) => {
      const result = insertGame.run(gameType, gameFormat);
      const gameId = result.lastInsertRowid;

      playerIds.forEach(playerId => {
        insertGamePlayer.run(gameId, playerId);
      });

      return gameId;
    });

    const gameId = transaction(game_type, format, player_ids);
    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);

    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get game details with players and statistics
app.get('/api/games/:id', (req, res) => {
  try {
    const { id } = req.params;

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Get players in this game
    const players = db.prepare(`
      SELECT p.*, gp.final_score, gp.position
      FROM players p
      JOIN game_players gp ON p.id = gp.player_id
      WHERE gp.game_id = ?
    `).all(id);

    // Get statistics for each player
    const statistics = db.prepare(`
      SELECT * FROM player_statistics WHERE game_id = ?
    `).all(id);

    res.json({ ...game, players, statistics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record a throw
app.post('/api/throws', (req, res) => {
  try {
    const { leg_id, player_id, throw_number, dart_number, score, multiplier, is_miss } = req.body;

    const stmt = db.prepare(`
      INSERT INTO throws (leg_id, player_id, throw_number, dart_number, score, multiplier, is_miss)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(leg_id, player_id, throw_number, dart_number, score, multiplier, is_miss ? 1 : 0);
    const throwRecord = db.prepare('SELECT * FROM throws WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(throwRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player statistics
app.get('/api/players/:id/statistics', (req, res) => {
  try {
    const { id } = req.params;

    // Get overall statistics across all games
    const stats = db.prepare(`
      SELECT
        COUNT(DISTINCT ps.game_id) as games_played,
        AVG(ps.three_dart_average) as avg_3dart,
        AVG(ps.one_dart_average) as avg_1dart,
        MAX(ps.highest_checkout) as highest_checkout,
        SUM(ps.doubles_hit) as total_doubles_hit,
        SUM(ps.doubles_attempted) as total_doubles_attempted,
        SUM(ps.legs_won) as total_legs_won,
        SUM(ps.legs_played) as total_legs_played
      FROM player_statistics ps
      WHERE ps.player_id = ?
    `).get(id);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🎯 Darts Scores API running on http://localhost:${PORT}`);
});
