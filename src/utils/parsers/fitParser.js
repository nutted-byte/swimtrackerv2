import FitParser from 'fit-file-parser';

/**
 * Parse a FIT file and extract swim session data
 * @param {File} file - The FIT file to parse
 * @returns {Promise<Object>} Parsed swim session data
 */
export const parseFitFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const fitParser = new FitParser({
          force: true,
          speedUnit: 'km/h',
          lengthUnit: 'm',
          temperatureUnit: 'celsius',
          elapsedRecordField: true,
          mode: 'cascade',
        });

        fitParser.parse(e.target.result, (error, data) => {
          if (error) {
            reject(new Error(`Failed to parse FIT file: ${error.message}`));
            return;
          }

          try {
            const swimSession = extractSwimData(data);
            resolve(swimSession);
          } catch (parseError) {
            reject(parseError);
          }
        });
      } catch (error) {
        reject(new Error(`Error processing FIT file: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Extract swim-specific metrics from parsed FIT data
 */
const extractSwimData = (data) => {
  const session = data.sessions?.[0];
  const laps = data.laps || [];
  const records = data.records || [];

  if (!session) {
    throw new Error('No session data found in FIT file');
  }

  // Calculate metrics
  const totalDistance = session.total_distance || 0; // meters
  const totalTime = session.total_elapsed_time || session.total_timer_time || 0; // seconds
  const avgPace = totalDistance > 0 ? (totalTime / 60) / (totalDistance / 100) : 0; // min/100m
  const totalStrokes = session.total_strokes || calculateTotalStrokes(laps);
  const swolf = calculateSWOLF(laps, records);

  // Extract lap data
  const lapData = laps.map((lap, index) => ({
    number: index + 1,
    distance: lap.total_distance || 0,
    duration: lap.total_elapsed_time || lap.total_timer_time || 0,
    strokes: lap.total_strokes || 0,
    avgPace: lap.total_distance > 0
      ? (lap.total_elapsed_time / 60) / (lap.total_distance / 100)
      : 0,
  }));

  return {
    id: `swim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: session.start_time || new Date().toISOString(),
    distance: Math.round(totalDistance), // meters
    duration: Math.round(totalTime / 60), // minutes
    pace: parseFloat(avgPace.toFixed(2)), // min/100m
    strokes: totalStrokes,
    swolf: swolf,
    calories: Math.round(session.total_calories || 0),
    laps: lapData,
    source: 'FIT file',
  };
};

/**
 * Calculate total strokes from laps if not available in session
 */
const calculateTotalStrokes = (laps) => {
  return laps.reduce((total, lap) => total + (lap.total_strokes || 0), 0);
};

/**
 * Calculate SWOLF score
 * SWOLF = Strokes + Time (for a given distance, typically 25m or 50m)
 */
const calculateSWOLF = (laps, records) => {
  if (laps.length === 0) return 0;

  // Try to calculate SWOLF from laps
  const validLaps = laps.filter(lap =>
    lap.total_distance >= 20 &&
    lap.total_distance <= 60 &&
    lap.total_strokes > 0
  );

  if (validLaps.length === 0) return 0;

  const swolfScores = validLaps.map(lap => {
    const timeInSeconds = lap.total_elapsed_time || lap.total_timer_time || 0;
    return (lap.total_strokes || 0) + timeInSeconds;
  });

  const avgSwolf = swolfScores.reduce((a, b) => a + b, 0) / swolfScores.length;
  return Math.round(avgSwolf);
};
