/**
 * Fatigue curve analytics
 *
 * Within a session, pace per lap (seconds/100m) tells you how you faded.
 * Aggregating "lap N's pace" across all sessions gives the swimmer's typical fade shape.
 */

const hasLapTimestamps = (laps) =>
  Array.isArray(laps) && laps.length > 0 && laps[0]?.startDate && laps[0]?.endDate;

const paceSecondsPer100m = (lap) => {
  if (!lap.distance || !lap.duration) return null;
  return (lap.duration / lap.distance) * 100;
};

/**
 * Lap-by-lap pace for a single session.
 * Returns [{ lap, paceSec }, ...] or null when laps lack usable timing data.
 */
export const fatigueCurveForSession = (session) => {
  if (!session || !hasLapTimestamps(session.laps)) return null;

  const points = session.laps
    .map((lap, i) => {
      const pace = paceSecondsPer100m(lap);
      return pace === null ? null : { lap: i + 1, paceSec: pace };
    })
    .filter(Boolean);

  return points.length > 0 ? points : null;
};

/**
 * Median pace at each lap position across all qualifying sessions.
 * Optionally excludes one session (typically the one being displayed).
 *
 * Returns [{ lap, medianPaceSec, n }, ...] or null if <2 sessions have lap data.
 * Each lap position is only included if at least `minSamples` sessions reached that lap.
 */
export const medianFatigueCurveAcrossSessions = (
  sessions,
  { excludeSessionId = null, minSamples = 3 } = {}
) => {
  const curves = sessions
    .filter((s) => s.id !== excludeSessionId)
    .map((s) => fatigueCurveForSession(s))
    .filter(Boolean);

  if (curves.length < 2) return null;

  const maxLap = Math.max(...curves.map((c) => c.length));
  const result = [];

  for (let i = 0; i < maxLap; i++) {
    const paces = curves.map((c) => c[i]?.paceSec).filter((p) => typeof p === 'number');
    if (paces.length < minSamples) continue;

    paces.sort((a, b) => a - b);
    const mid = Math.floor(paces.length / 2);
    const median =
      paces.length % 2 === 0 ? (paces[mid - 1] + paces[mid]) / 2 : paces[mid];

    result.push({ lap: i + 1, medianPaceSec: median, n: paces.length });
  }

  return result.length > 0 ? result : null;
};

/**
 * Split-based fade metric: mean pace of the second half minus mean pace of the first half.
 * Positive = faded (slower later). Negative = negative split (faster later).
 * Returns { firstHalfPaceSec, secondHalfPaceSec, fadeSec, verdict } or null.
 */
export const fatigueMetricsForSession = (session) => {
  const curve = fatigueCurveForSession(session);
  if (!curve || curve.length < 4) return null;

  const mid = Math.floor(curve.length / 2);
  const firstHalf = curve.slice(0, mid);
  const secondHalf = curve.slice(mid);

  const mean = (arr) => arr.reduce((s, p) => s + p.paceSec, 0) / arr.length;
  const firstHalfPaceSec = mean(firstHalf);
  const secondHalfPaceSec = mean(secondHalf);
  const fadeSec = secondHalfPaceSec - firstHalfPaceSec;

  let verdict;
  if (fadeSec > 3) verdict = 'faded';
  else if (fadeSec < -3) verdict = 'negative-split';
  else verdict = 'even';

  return { firstHalfPaceSec, secondHalfPaceSec, fadeSec, verdict };
};
