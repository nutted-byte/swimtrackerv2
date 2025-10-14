import { parseCSVLine } from './csvHelpers';

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
              session = parseAppleHealthRow(data, i);
            } else {
              session = parseSimpleRow(data, i);
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
 * Parse a row in Apple Health export format
 */
const parseAppleHealthRow = (data, rowIndex) => {
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

  return {
    id: `swim_${Date.now()}_${rowIndex}_${Math.random().toString(36).substr(2, 9)}`,
    date: data.startdate || new Date().toISOString(),
    distance: Math.round(distance),
    duration: Math.round(durationMin),
    pace: parseFloat(pace.toFixed(2)),
    strokes: strokes,
    swolf: swolf > 0 ? swolf : 0,
    calories: Math.round(calories),
    laps: [],
    source: 'CSV file',
  };
};

/**
 * Parse a row in simple CSV format: date,distance,duration,pace,strokes,swolf,calories
 */
const parseSimpleRow = (data, rowIndex) => {
  return {
    id: `swim_${Date.now()}_${rowIndex}_${Math.random().toString(36).substr(2, 9)}`,
    date: data.date || new Date().toISOString(),
    distance: parseInt(data.distance) || 0,
    duration: parseInt(data.duration) || 0,
    pace: parseFloat(data.pace) || 0,
    strokes: parseInt(data.strokes) || 0,
    swolf: parseInt(data.swolf) || 0,
    calories: parseInt(data.calories) || 0,
    laps: [],
    source: 'CSV file',
  };
};
