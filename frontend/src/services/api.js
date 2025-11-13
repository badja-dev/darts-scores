const API_BASE_URL = 'http://localhost:3001/api';

// Players
export const getPlayers = async () => {
  const response = await fetch(`${API_BASE_URL}/players`);
  return response.json();
};

export const createPlayer = async (name) => {
  const response = await fetch(`${API_BASE_URL}/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return response.json();
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
  return response.json();
};

// Statistics
export const getPlayerStatistics = async (playerId) => {
  const response = await fetch(`${API_BASE_URL}/players/${playerId}/statistics`);
  return response.json();
};
