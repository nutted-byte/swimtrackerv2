import { parseCSVLine } from './csvHelpers';

/**
 * Parse VO2 max CSV file
 * Supports two formats:
 * 1. Simple: date,vo2max
 * 2. Apple Health export: type,sourceName,sourceVersion,device,unit,startDate,endDate,unit,value,...
 * Returns array of { date, vo2max } objects
 */
export const parseVO2MaxFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        let lines = e.target.result.split('\n').filter(line => line.trim());
        if (lines.length < 1) {
          throw new Error('VO2 max CSV file is empty');
        }

        // Skip separator line if present (Excel/Apple Health format)
        if (lines[0].startsWith('sep=')) {
          lines = lines.slice(1);
        }

        const vo2MaxData = [];

        // Check if this is Apple Health format (no header, starts with HKQuantityTypeIdentifierVO2Max)
        const firstLine = lines[0].trim();
        const isAppleHealth = firstLine.startsWith('HKQuantityTypeIdentifierVO2Max') ||
                              firstLine.includes('HKQuantityTypeIdentifierVO2Max');

        console.log('First line:', firstLine.substring(0, 50));
        console.log('Is Apple Health VO2 max format:', isAppleHealth);

        if (isAppleHealth) {
          parseAppleHealthFormat(lines, vo2MaxData);
        } else {
          parseSimpleFormat(lines, vo2MaxData);
        }

        console.log(`Parsed ${vo2MaxData.length} VO2 max entries from CSV`);
        resolve(vo2MaxData);
      } catch (error) {
        console.error('VO2 max CSV parse error:', error);
        reject(new Error(`Failed to parse VO2 max CSV file: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Parse Apple Health format VO2 max data (no header)
 */
const parseAppleHealthFormat = (lines, vo2MaxData) => {
  // Apple Health format: no header, fixed columns
  // Format: type,sourceName,sourceVersion,device,unit,startDate,endDate,unit,value,unknown,unknown,uuid
  for (let i = 0; i < lines.length; i++) {
    try {
      const values = parseCSVLine(lines[i]);

      if (values.length < 9) {
        console.warn(`Skipping row ${i}: too few columns`);
        continue;
      }

      // Extract date (column 5, startDate) and value (column 8)
      const dateStr = values[5]; // startDate: "2025-10-03 07:49:34 +0000"
      const vo2maxStr = values[8]; // value: "44.34"

      const vo2max = parseFloat(vo2maxStr);
      if (isNaN(vo2max) || vo2max <= 0) {
        console.warn(`Skipping row ${i}: invalid VO2 max value "${vo2maxStr}"`);
        continue;
      }

      vo2MaxData.push({
        date: dateStr,
        vo2max: vo2max,
      });
    } catch (rowError) {
      console.warn(`Error parsing row ${i}:`, rowError.message);
    }
  }
};

/**
 * Parse simple format VO2 max data (with header)
 */
const parseSimpleFormat = (lines, vo2MaxData) => {
  if (lines.length < 2) {
    throw new Error('VO2 max CSV file must have at least a header and one data row');
  }

  const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
  console.log('VO2 Max CSV Headers:', headers);
  console.log('Full header line:', lines[0]);

  // Determine column mapping for different CSV formats
  let dateCol = 'date';
  let vo2maxCol = 'vo2max';

  // Apple Health Export format
  if (headers.includes('startdate') && headers.includes('value')) {
    dateCol = 'startdate';
    vo2maxCol = 'value';
  } else if (!headers.includes('date') || !headers.includes('vo2max')) {
    throw new Error(`CSV must contain either "date" and "vo2max" columns, or "startdate" and "value" columns. Found headers: ${headers.join(', ')}`);
  }

  // Parse all data rows (skip header)
  for (let i = 1; i < lines.length; i++) {
    try {
      const values = parseCSVLine(lines[i]);

      if (values.length < 2) {
        console.warn(`Skipping row ${i}: too few columns`);
        continue;
      }

      const data = {};
      headers.forEach((header, index) => {
        data[header] = values[index] || '';
      });

      const vo2max = parseFloat(data[vo2maxCol]);
      if (isNaN(vo2max) || vo2max <= 0) {
        console.warn(`Skipping row ${i}: invalid VO2 max value`);
        continue;
      }

      vo2MaxData.push({
        date: data[dateCol],
        vo2max: vo2max,
      });
    } catch (rowError) {
      console.warn(`Error parsing row ${i}:`, rowError.message);
    }
  }
};
