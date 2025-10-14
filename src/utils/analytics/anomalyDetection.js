/**
 * Anomaly detection utilities for identifying unusual swim sessions
 * Detects outliers and significant deviations from normal performance
 */

/**
 * Calculate statistical thresholds for anomaly detection
 * @param {Array} values - Array of numeric values
 * @returns {Object} Mean, standard deviation, and thresholds
 */
const calculateStats = (values) => {
  if (values.length === 0) return null;

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean,
    stdDev,
    // Outliers are > 2 standard deviations from mean
    upperThreshold: mean + (2 * stdDev),
    lowerThreshold: mean - (2 * stdDev),
    // Extreme outliers are > 3 standard deviations
    extremeUpperThreshold: mean + (3 * stdDev),
    extremeLowerThreshold: mean - (3 * stdDev),
  };
};

/**
 * Detect anomalous swim sessions
 * @param {Array} sessions - Array of swim sessions
 * @returns {Object} Anomaly analysis with flagged sessions
 */
export const detectAnomalies = (sessions) => {
  if (sessions.length < 5) {
    return {
      hasSufficientData: false,
      anomalies: [],
    };
  }

  const anomalies = [];

  // Analyze pace anomalies
  const sessionsWithPace = sessions.filter(s => s.pace > 0);
  if (sessionsWithPace.length >= 5) {
    const paceStats = calculateStats(sessionsWithPace.map(s => s.pace));

    sessionsWithPace.forEach(session => {
      // Unusually fast
      if (session.pace < paceStats.extremeLowerThreshold) {
        anomalies.push({
          session,
          type: 'pace',
          severity: 'extreme',
          direction: 'positive',
          message: `Exceptionally fast pace: ${formatPace(session.pace)} (${Math.abs(((session.pace - paceStats.mean) / paceStats.mean) * 100).toFixed(1)}% faster than average)`,
          deviationFromMean: ((session.pace - paceStats.mean) / paceStats.mean) * 100,
        });
      } else if (session.pace < paceStats.lowerThreshold) {
        anomalies.push({
          session,
          type: 'pace',
          severity: 'moderate',
          direction: 'positive',
          message: `Notably fast pace: ${formatPace(session.pace)}`,
          deviationFromMean: ((session.pace - paceStats.mean) / paceStats.mean) * 100,
        });
      }
      // Unusually slow
      else if (session.pace > paceStats.extremeUpperThreshold) {
        anomalies.push({
          session,
          type: 'pace',
          severity: 'extreme',
          direction: 'negative',
          message: `Unusually slow pace: ${formatPace(session.pace)} (${Math.abs(((session.pace - paceStats.mean) / paceStats.mean) * 100).toFixed(1)}% slower than average)`,
          deviationFromMean: ((session.pace - paceStats.mean) / paceStats.mean) * 100,
        });
      } else if (session.pace > paceStats.upperThreshold) {
        anomalies.push({
          session,
          type: 'pace',
          severity: 'moderate',
          direction: 'negative',
          message: `Notably slow pace: ${formatPace(session.pace)}`,
          deviationFromMean: ((session.pace - paceStats.mean) / paceStats.mean) * 100,
        });
      }
    });
  }

  // Analyze distance anomalies
  const distances = sessions.map(s => s.distance);
  const distanceStats = calculateStats(distances);

  sessions.forEach(session => {
    // Unusually long
    if (session.distance > distanceStats.extremeUpperThreshold) {
      anomalies.push({
        session,
        type: 'distance',
        severity: 'extreme',
        direction: 'positive',
        message: `Exceptionally long swim: ${(session.distance / 1000).toFixed(2)}km (${Math.abs(((session.distance - distanceStats.mean) / distanceStats.mean) * 100).toFixed(1)}% longer than average)`,
        deviationFromMean: ((session.distance - distanceStats.mean) / distanceStats.mean) * 100,
      });
    } else if (session.distance > distanceStats.upperThreshold) {
      anomalies.push({
        session,
        type: 'distance',
        severity: 'moderate',
        direction: 'positive',
        message: `Notably long swim: ${(session.distance / 1000).toFixed(2)}km`,
        deviationFromMean: ((session.distance - distanceStats.mean) / distanceStats.mean) * 100,
      });
    }
    // Unusually short
    else if (session.distance < distanceStats.extremeLowerThreshold) {
      anomalies.push({
        session,
        type: 'distance',
        severity: 'extreme',
        direction: 'negative',
        message: `Unusually short swim: ${(session.distance / 1000).toFixed(2)}km`,
        deviationFromMean: ((session.distance - distanceStats.mean) / distanceStats.mean) * 100,
      });
    } else if (session.distance < distanceStats.lowerThreshold) {
      anomalies.push({
        session,
        type: 'distance',
        severity: 'moderate',
        direction: 'negative',
        message: `Notably short swim: ${(session.distance / 1000).toFixed(2)}km`,
        deviationFromMean: ((session.distance - distanceStats.mean) / distanceStats.mean) * 100,
      });
    }
  });

  // Analyze SWOLF anomalies (if available)
  const sessionsWithSwolf = sessions.filter(s => s.swolf > 0);
  if (sessionsWithSwolf.length >= 5) {
    const swolfStats = calculateStats(sessionsWithSwolf.map(s => s.swolf));

    sessionsWithSwolf.forEach(session => {
      // Unusually efficient
      if (session.swolf < swolfStats.extremeLowerThreshold) {
        anomalies.push({
          session,
          type: 'swolf',
          severity: 'extreme',
          direction: 'positive',
          message: `Exceptionally efficient swim: SWOLF ${session.swolf}`,
          deviationFromMean: ((session.swolf - swolfStats.mean) / swolfStats.mean) * 100,
        });
      }
      // Unusually inefficient
      else if (session.swolf > swolfStats.extremeUpperThreshold) {
        anomalies.push({
          session,
          type: 'swolf',
          severity: 'extreme',
          direction: 'negative',
          message: `Unusually inefficient swim: SWOLF ${session.swolf}`,
          deviationFromMean: ((session.swolf - swolfStats.mean) / swolfStats.mean) * 100,
        });
      }
    });
  }

  // Remove duplicates (same session flagged for multiple anomalies)
  // Keep the most severe anomaly for each session
  const uniqueAnomalies = [];
  const seenSessions = new Set();

  anomalies
    .sort((a, b) => {
      // Sort by severity (extreme first) and then by absolute deviation
      if (a.severity === 'extreme' && b.severity !== 'extreme') return -1;
      if (a.severity !== 'extreme' && b.severity === 'extreme') return 1;
      return Math.abs(b.deviationFromMean) - Math.abs(a.deviationFromMean);
    })
    .forEach(anomaly => {
      if (!seenSessions.has(anomaly.session.id)) {
        uniqueAnomalies.push(anomaly);
        seenSessions.add(anomaly.session.id);
      }
    });

  return {
    hasSufficientData: true,
    anomalies: uniqueAnomalies,
    stats: {
      pace: sessionsWithPace.length >= 5 ? calculateStats(sessionsWithPace.map(s => s.pace)) : null,
      distance: distanceStats,
      swolf: sessionsWithSwolf.length >= 5 ? calculateStats(sessionsWithSwolf.map(s => s.swolf)) : null,
    },
  };
};

/**
 * Detect sudden performance changes (between consecutive sessions)
 * @param {Array} sessions - Array of swim sessions (sorted newest first)
 * @returns {Array} Sudden changes detected
 */
export const detectSuddenChanges = (sessions) => {
  if (sessions.length < 3) {
    return [];
  }

  const changes = [];
  const sortedSessions = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date));

  for (let i = 1; i < sortedSessions.length; i++) {
    const prev = sortedSessions[i - 1];
    const curr = sortedSessions[i];

    // Check pace changes
    if (prev.pace > 0 && curr.pace > 0) {
      const paceChange = ((curr.pace - prev.pace) / prev.pace) * 100;

      if (Math.abs(paceChange) > 15) {
        changes.push({
          type: 'pace',
          previousSession: prev,
          currentSession: curr,
          changePercent: paceChange,
          direction: paceChange < 0 ? 'improvement' : 'decline',
          message: paceChange < 0
            ? `Pace improved by ${Math.abs(paceChange).toFixed(1)}% from previous swim`
            : `Pace declined by ${Math.abs(paceChange).toFixed(1)}% from previous swim`,
        });
      }
    }

    // Check distance changes
    const distanceChange = ((curr.distance - prev.distance) / prev.distance) * 100;
    if (Math.abs(distanceChange) > 30) {
      changes.push({
        type: 'distance',
        previousSession: prev,
        currentSession: curr,
        changePercent: distanceChange,
        direction: distanceChange > 0 ? 'increase' : 'decrease',
        message: distanceChange > 0
          ? `Distance increased by ${Math.abs(distanceChange).toFixed(1)}% from previous swim`
          : `Distance decreased by ${Math.abs(distanceChange).toFixed(1)}% from previous swim`,
      });
    }
  }

  return changes;
};

// Helper function for formatting pace
const formatPace = (pace) => {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
