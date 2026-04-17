/**
 * Continuous swim analytics
 *
 * "Continuous swim" = consecutive laps with inter-lap rest gap <= CONTINUOUS_GAP_SECONDS.
 * 20s captures typical wall pauses/breath-catches but excludes real rest breaks.
 */

export const CONTINUOUS_GAP_SECONDS = 20;

const hasLapTimestamps = (laps) =>
  Array.isArray(laps) && laps.length > 0 && laps[0]?.startDate && laps[0]?.endDate;

/**
 * Longest continuous swim within a single session, in meters.
 * Returns 0 when laps lack timestamps (e.g., old data or workout-level-only sessions).
 */
export const longestContinuousInSession = (laps, gapThresholdSeconds = CONTINUOUS_GAP_SECONDS) => {
  if (!hasLapTimestamps(laps)) return 0;

  let longest = 0;
  let current = laps[0].distance;

  for (let i = 1; i < laps.length; i++) {
    const prevEnd = new Date(laps[i - 1].endDate).getTime();
    const thisStart = new Date(laps[i].startDate).getTime();
    const gapSeconds = (thisStart - prevEnd) / 1000;

    if (gapSeconds <= gapThresholdSeconds) {
      current += laps[i].distance;
    } else {
      if (current > longest) longest = current;
      current = laps[i].distance;
    }
  }
  if (current > longest) longest = current;
  return Math.round(longest);
};

/**
 * Lifetime best continuous swim across all sessions that have lap timestamps.
 * Returns { distance, sessionId, date } or null if no qualifying data.
 */
export const longestContinuousEver = (sessions, gapThresholdSeconds = CONTINUOUS_GAP_SECONDS) => {
  let best = null;
  for (const session of sessions) {
    const distance = longestContinuousInSession(session.laps, gapThresholdSeconds);
    if (distance > 0 && (!best || distance > best.distance)) {
      best = { distance, sessionId: session.id, date: session.date };
    }
  }
  return best;
};

/**
 * Longest continuous swim bucketed by calendar month, for the last N months.
 * Returns array ordered oldest → newest:
 *   [{ monthKey: '2026-03', monthLabel: 'Mar', longestMeters: 700, hasData: true }, ...]
 */
export const longestContinuousByMonth = (
  sessions,
  monthsBack = 12,
  gapThresholdSeconds = CONTINUOUS_GAP_SECONDS
) => {
  const now = new Date();
  const buckets = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    buckets.push({
      monthKey,
      monthLabel: d.toLocaleString('en-US', { month: 'short' }),
      year: d.getFullYear(),
      longestMeters: 0,
      hasData: false,
    });
  }

  const byKey = new Map(buckets.map((b) => [b.monthKey, b]));

  for (const session of sessions) {
    const sessionDate = new Date(session.date);
    const key = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, '0')}`;
    const bucket = byKey.get(key);
    if (!bucket) continue;

    const distance = longestContinuousInSession(session.laps, gapThresholdSeconds);
    if (distance > bucket.longestMeters) {
      bucket.longestMeters = distance;
      bucket.hasData = true;
    }
  }

  return buckets;
};

/**
 * How many of the given sessions have the lap-timestamp data needed for continuous-swim analysis.
 */
export const countSessionsWithLapTimestamps = (sessions) =>
  sessions.reduce((n, s) => (hasLapTimestamps(s.laps) ? n + 1 : n), 0);

/**
 * Split laps into continuous streaks (inter-lap gap <= threshold).
 */
const splitIntoStreaks = (laps, gapThresholdSeconds) => {
  const streaks = [];
  let current = [laps[0]];
  for (let i = 1; i < laps.length; i++) {
    const prevEnd = new Date(laps[i - 1].endDate).getTime();
    const thisStart = new Date(laps[i].startDate).getTime();
    const gapSeconds = (thisStart - prevEnd) / 1000;
    if (gapSeconds <= gapThresholdSeconds) {
      current.push(laps[i]);
    } else {
      streaks.push(current);
      current = [laps[i]];
    }
  }
  streaks.push(current);
  return streaks;
};

/**
 * Fastest continuous window covering at least `targetMeters` within a single session.
 * Uses a sliding window within each continuous streak.
 * Returns { timeSeconds, actualMeters } or null if no qualifying window exists.
 */
export const bestTimeForDistanceInSession = (
  laps,
  targetMeters,
  gapThresholdSeconds = CONTINUOUS_GAP_SECONDS
) => {
  if (!hasLapTimestamps(laps)) return null;

  const streaks = splitIntoStreaks(laps, gapThresholdSeconds);
  let bestTime = Infinity;
  let bestActual = 0;

  for (const streak of streaks) {
    let left = 0;
    let sum = 0;
    for (let right = 0; right < streak.length; right++) {
      sum += streak[right].distance;
      while (left < right && sum - streak[left].distance >= targetMeters) {
        sum -= streak[left].distance;
        left++;
      }
      if (sum >= targetMeters) {
        const start = new Date(streak[left].startDate).getTime();
        const end = new Date(streak[right].endDate).getTime();
        const t = (end - start) / 1000;
        if (t < bestTime) {
          bestTime = t;
          bestActual = sum;
        }
      }
    }
  }

  if (bestTime === Infinity) return null;
  return { timeSeconds: bestTime, actualMeters: bestActual };
};

/**
 * Lifetime PR for a given target distance.
 * Returns { timeSeconds, actualMeters, sessionId, date } or null.
 */
export const bestTimeForDistanceEver = (
  sessions,
  targetMeters,
  gapThresholdSeconds = CONTINUOUS_GAP_SECONDS
) => {
  let best = null;
  for (const session of sessions) {
    const result = bestTimeForDistanceInSession(session.laps, targetMeters, gapThresholdSeconds);
    if (result && (!best || result.timeSeconds < best.timeSeconds)) {
      best = { ...result, sessionId: session.id, date: session.date };
    }
  }
  return best;
};
