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
          duration: totalTime / 60, // Keep as decimal minutes to preserve seconds
          pace: parseFloat(avgPace.toFixed(2)),
          strokes: Math.round(totalStrokes),
          swolf: 0, // TCX typically doesn't have SWOLF data
          calories: 0, // TCX typically doesn't have calorie data
          laps: lapData,
          source: 'TCX file',
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
