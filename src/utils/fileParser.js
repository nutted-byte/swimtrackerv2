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
    sport: session.sport || 'swimming',
    fileName: data.fileName || 'Unknown',
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

/**
 * Parse TCX file (XML format)
 */
export const parseTcxFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(e.target.result, 'text/xml');

        const activity = xmlDoc.querySelector('Activity');
        if (!activity) {
          throw new Error('No activity data found in TCX file');
        }

        const laps = Array.from(xmlDoc.querySelectorAll('Lap'));
        let totalDistance = 0;
        let totalTime = 0;
        let totalStrokes = 0;

        const lapData = laps.map((lap, index) => {
          const distance = parseFloat(lap.querySelector('DistanceMeters')?.textContent || 0);
          const time = parseFloat(lap.querySelector('TotalTimeSeconds')?.textContent || 0);
          const strokes = parseInt(lap.querySelector('Cadence')?.textContent || 0) * (time / 60);

          totalDistance += distance;
          totalTime += time;
          totalStrokes += strokes;

          return {
            number: index + 1,
            distance: Math.round(distance),
            duration: Math.round(time),
            strokes: Math.round(strokes),
            avgPace: distance > 0 ? (time / 60) / (distance / 100) : 0,
          };
        });

        const startTime = activity.querySelector('Id')?.textContent || new Date().toISOString();
        const avgPace = totalDistance > 0 ? (totalTime / 60) / (totalDistance / 100) : 0;

        resolve({
          id: `swim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          date: startTime,
          distance: Math.round(totalDistance),
          duration: Math.round(totalTime / 60),
          pace: parseFloat(avgPace.toFixed(2)),
          strokes: Math.round(totalStrokes),
          swolf: 0, // TCX typically doesn't have SWOLF data
          calories: 0, // TCX typically doesn't have calorie data
          laps: lapData,
          sport: 'swimming',
          fileName: file.name,
        });
      } catch (error) {
        reject(new Error(`Failed to parse TCX file: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Parse a CSV line handling quoted values
 */
const parseCSVLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add the last field
  values.push(current.trim());
  return values;
};

/**
 * Parse CSV file - supports both simple format and Apple Health export
 * Returns array of swim sessions (supports multiple rows)
 */
export const parseCsvFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        let lines = e.target.result.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          throw new Error('CSV file must have at least a header and one data row');
        }

        // Skip separator line if present (Apple Health format)
        if (lines[0].startsWith('sep=')) {
          lines = lines.slice(1);
        }

        const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
        const sessions = [];

        console.log('CSV Headers:', headers);

        // Detect if this is Apple Health format
        const isAppleHealth = headers.includes('startdate') && headers.includes('totaldistance');
        console.log('Is Apple Health format:', isAppleHealth);

        // Parse all data rows (skip header)
        for (let i = 1; i < lines.length; i++) {
          try {
            const values = parseCSVLine(lines[i]);

            if (values.length < 5) { // Need at least a few columns
              console.warn(`Skipping row ${i}: too few columns (${values.length})`);
              continue;
            }

            const data = {};
            headers.forEach((header, index) => {
              data[header] = values[index] || '';
            });

            let session;

            if (isAppleHealth) {
              // Parse Apple Health format
              // Extract numeric value from strings like "675 m" or "2834.6057649850845 sec"
              const distanceStr = data.totaldistance || '';
              const distance = parseFloat(distanceStr.replace(/[^0-9.]/g, '')) || 0;

              const durationStr = data.duration || '';
              const durationSec = parseFloat(durationStr.replace(/[^0-9.]/g, '')) || 0;
              const durationMin = durationSec / 60;

              const strokesStr = data.totalswimmingstrokecount || '';
              const strokes = parseInt(strokesStr.replace(/[^0-9]/g, '')) || 0;

              // Debug: Log all available calorie fields
              console.log('Calorie fields in CSV row:', {
                totalenergyburned: data.totalenergyburned,
                activeenergyburned: data.activeenergyburned,
                calories: data.calories
              });

              const caloriesStr = data.totalenergyburned || data.activeenergyburned || data.calories || '';
              const calories = parseFloat(caloriesStr.replace(/[^0-9.]/g, '')) || 0;
              console.log(`Parsed calories: ${calories} from string: "${caloriesStr}"`);

              // Calculate pace (min per 100m)
              const pace = distance > 0 ? (durationMin / (distance / 100)) : 0;

              // Calculate SWOLF estimate (strokes per 25m + time per 25m)
              const strokesPer25m = distance > 0 ? (strokes / (distance / 25)) : 0;
              const timePer25m = distance > 0 ? (durationSec / (distance / 25)) : 0;
              const swolf = Math.round(strokesPer25m + timePer25m);

              session = {
                id: `swim_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
                date: data.startdate || new Date().toISOString(),
                distance: Math.round(distance),
                duration: Math.round(durationMin),
                pace: parseFloat(pace.toFixed(2)),
                strokes: strokes,
                swolf: swolf > 0 ? swolf : 0,
                calories: Math.round(calories),
                laps: [],
                sport: 'swimming',
                fileName: file.name,
              };
            } else {
              // Parse simple format: date,distance,duration,pace,strokes,swolf,calories
              session = {
                id: `swim_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
                date: data.date || new Date().toISOString(),
                distance: parseInt(data.distance) || 0,
                duration: parseInt(data.duration) || 0,
                pace: parseFloat(data.pace) || 0,
                strokes: parseInt(data.strokes) || 0,
                swolf: parseInt(data.swolf) || 0,
                calories: parseInt(data.calories) || 0,
                laps: [],
                sport: data.sport || 'swimming',
                fileName: file.name,
              };
            }

            if (session.distance > 0) {
              sessions.push(session);
            }
          } catch (rowError) {
            console.warn(`Error parsing row ${i}:`, rowError.message);
          }
        }

        console.log(`Parsed ${sessions.length} sessions from CSV`);
        resolve(sessions);
      } catch (error) {
        console.error('CSV parse error:', error);
        reject(new Error(`Failed to parse CSV file: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Main parser function that routes to the appropriate parser based on file type
 */
export const parseSwimFile = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase();

  switch (extension) {
    case 'fit':
      return await parseFitFile(file);
    case 'tcx':
      return await parseTcxFile(file);
    case 'csv':
      return await parseCsvFile(file);
    default:
      throw new Error(`Unsupported file type: .${extension}`);
  }
};
