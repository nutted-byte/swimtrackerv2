/**
 * Parse Apple Health lap data CSV and group into sessions
 *
 * This parser takes Apple Health swimming distance CSV exports and:
 * 1. Parses individual lap data (each row = 1 lap)
 * 2. Groups laps into sessions based on time gaps
 * 3. Calculates session-level metrics
 * 4. Returns sessions ready for matching
 */

const SESSION_GAP_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Parse Apple Health lap CSV file
 * @param {File} file - The CSV file to parse
 * @returns {Promise<Array>} Array of parsed sessions with lap data
 */
export const parseAppleHealthLapCSV = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const sessions = parseCSVText(text);
        resolve(sessions);
      } catch (error) {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Parse CSV text content
 */
const parseCSVText = (text) => {
  const lines = text.trim().split('\n');

  // Skip first line if it's "sep=,"
  let startIndex = 0;
  if (lines[0].trim() === 'sep=,') {
    startIndex = 1;
  }

  // Parse header
  const header = parseCSVLine(lines[startIndex]);

  // Find required column indices
  const startDateIdx = header.indexOf('startDate');
  const endDateIdx = header.indexOf('endDate');
  const valueIdx = header.indexOf('value');

  if (startDateIdx === -1 || endDateIdx === -1 || valueIdx === -1) {
    throw new Error('CSV missing required columns: startDate, endDate, value');
  }

  // Parse lap rows
  const laps = [];
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = parseCSVLine(line);

    const startDate = new Date(cols[startDateIdx]);
    const endDate = new Date(cols[endDateIdx]);
    const distance = parseFloat(cols[valueIdx]);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || isNaN(distance)) {
      console.warn(`Skipping invalid row ${i}: ${line}`);
      continue;
    }

    const duration = (endDate - startDate) / 1000; // seconds
    const avgPace = distance > 0 ? (duration / 60) / (distance / 100) : 0; // min/100m

    laps.push({
      startDate,
      endDate,
      distance,
      duration,
      avgPace
    });
  }

  // Sort laps by start date
  laps.sort((a, b) => a.startDate - b.startDate);

  // Group laps into sessions
  const sessions = groupLapsIntoSessions(laps);

  return sessions;
};

/**
 * Parse a CSV line, handling quoted values
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

/**
 * Group laps into sessions based on time gaps
 * A new session starts when there's >5 minutes between laps
 */
const groupLapsIntoSessions = (laps) => {
  if (laps.length === 0) return [];

  const sessions = [];
  let currentSession = {
    laps: [laps[0]],
    startDate: laps[0].startDate,
  };

  for (let i = 1; i < laps.length; i++) {
    const lap = laps[i];
    const prevLap = laps[i - 1];

    const gap = lap.startDate - prevLap.endDate;

    if (gap > SESSION_GAP_THRESHOLD) {
      // Gap detected - finish current session and start new one
      sessions.push(finalizeSession(currentSession));
      currentSession = {
        laps: [lap],
        startDate: lap.startDate,
      };
    } else {
      // Continue current session
      currentSession.laps.push(lap);
    }
  }

  // Add final session
  sessions.push(finalizeSession(currentSession));

  return sessions;
};

/**
 * Calculate session-level metrics from laps
 */
const finalizeSession = (session) => {
  const laps = session.laps;
  const startDate = laps[0].startDate;
  const endDate = laps[laps.length - 1].endDate;

  // Calculate totals
  const totalDistance = laps.reduce((sum, lap) => sum + lap.distance, 0);
  const totalDuration = (endDate - startDate) / 1000; // seconds
  const avgPace = totalDistance > 0 ? (totalDuration / 60) / (totalDistance / 100) : 0;

  // Number laps
  const numberedLaps = laps.map((lap, index) => ({
    number: index + 1,
    distance: lap.distance,
    duration: lap.duration,
    avgPace: lap.avgPace,
    strokes: 0, // Apple Health doesn't provide stroke data
  }));

  return {
    date: startDate.toISOString(),
    distance: Math.round(totalDistance),
    duration: totalDuration / 60, // minutes (as decimal to preserve seconds)
    pace: parseFloat(avgPace.toFixed(2)),
    laps: numberedLaps,
    lapCount: numberedLaps.length,
    source: 'Apple Health CSV (lap data)',
  };
};
