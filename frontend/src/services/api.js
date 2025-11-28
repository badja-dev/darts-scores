const API_BASE_URL = 'http://localhost:3001/api';

// Players
export const getAllPlayers = async () => {
  const response = await fetch(`${API_BASE_URL}/players`);
  if (!response.ok) throw new Error('Failed to fetch players');
  return response.json();
};

export const createPlayer = async (name) => {
  const response = await fetch(`${API_BASE_URL}/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Failed to create player');
  return response.json();
};

export const getOrCreatePlayer = async (name) => {
  // Try to find existing player
  const players = await getAllPlayers();
  const existing = players.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing;

  // Create new player if not found
  return createPlayer(name);
};

// Games
export const getGames = async () => {
  const response = await fetch(`${API_BASE_URL}/games`);
  return response.json();
};

export const createGame = async (gameType, format, playerIds) => {
  const response = await fetch(`${API_BASE_URL}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      game_type: gameType,
      format: format,
      player_ids: playerIds,
    }),
  });
  return response.json();
};

export const getGame = async (gameId) => {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}`);
  return response.json();
};

// Legs
export const createLeg = async (gameId, legNumber) => {
  const response = await fetch(`${API_BASE_URL}/legs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      game_id: gameId,
      leg_number: legNumber,
    }),
  });
  if (!response.ok) throw new Error('Failed to create leg');
  return response.json();
};

export const completeLeg = async (legId, winnerId) => {
  const response = await fetch(`${API_BASE_URL}/legs/${legId}/complete`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      winner_id: winnerId,
    }),
  });
  if (!response.ok) throw new Error('Failed to complete leg');
  return response.json();
};

// Throws
export const recordThrow = async (legId, playerId, throwNumber, dartNumber, score, multiplier, isMiss) => {
  const response = await fetch(`${API_BASE_URL}/throws`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      leg_id: legId,
      player_id: playerId,
      throw_number: throwNumber,
      dart_number: dartNumber,
      score: score,
      multiplier: multiplier,
      is_miss: isMiss,
    }),
  });
  if (!response.ok) throw new Error('Failed to record throw');
  return response.json();
};

// Statistics
export const getPlayerStatistics = async (playerId) => {
  const response = await fetch(`${API_BASE_URL}/players/${playerId}/statistics`);
  return response.json();
};

// Get player game history
export const getPlayerGames = async (playerId) => {
  const response = await fetch(`${API_BASE_URL}/players/${playerId}/games`);
  if (!response.ok) throw new Error('Failed to fetch player games');
  return response.json();
};

// Get statistics for a specific leg and player
export const getLegPlayerStatistics = async (legId, playerId) => {
  const response = await fetch(`${API_BASE_URL}/legs/${legId}/players/${playerId}/statistics`);
  if (!response.ok) throw new Error('Failed to fetch leg statistics');
  return response.json();
};

// Delete a specific game
export const deleteGame = async (gameId) => {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete game');
  return response.json();
};

// Delete all games for a player
export const deleteAllPlayerGames = async (playerId) => {
  const response = await fetch(`${API_BASE_URL}/players/${playerId}/games`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete all games');
  return response.json();
};
