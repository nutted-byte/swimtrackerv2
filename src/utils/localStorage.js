const STORAGE_KEY = 'swim_tracker_sessions';

/**
 * Get all swim sessions from local storage
 */
export const getSessions = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

/**
 * Save a new swim session
 */
export const saveSession = (session) => {
  try {
    const sessions = getSessions();
    sessions.push(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return session;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw new Error('Failed to save session');
  }
};

/**
 * Save multiple sessions at once
 */
export const saveSessions = (newSessions) => {
  try {
    const sessions = getSessions();
    const updated = [...sessions, ...newSessions];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw new Error('Failed to save sessions');
  }
};

/**
 * Update a session by ID
 */
export const updateSession = (sessionId, updates) => {
  try {
    const sessions = getSessions();
    const updated = sessions.map(s =>
      s.id === sessionId ? { ...s, ...updates } : s
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error updating localStorage:', error);
    throw new Error('Failed to update session');
  }
};

/**
 * Delete a session by ID
 */
export const deleteSession = (sessionId) => {
  try {
    const sessions = getSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    throw new Error('Failed to delete session');
  }
};

/**
 * Clear all sessions
 */
export const clearSessions = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    throw new Error('Failed to clear sessions');
  }
};

/**
 * Get sessions sorted by date (newest first)
 */
export const getSessionsSorted = () => {
  const sessions = getSessions();
  return sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Get sessions within a date range
 */
export const getSessionsByDateRange = (startDate, endDate) => {
  const sessions = getSessions();
  return sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= startDate && sessionDate <= endDate;
  });
};

/**
 * Get sessions from the last N days
 */
export const getRecentSessions = (days = 30) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return getSessionsByDateRange(startDate, endDate);
};
