/**
 * Test data utilities for development
 * Generates realistic swim session data for testing
 */

// Generate a random swim session
export const generateRandomSession = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(Math.floor(Math.random() * 12) + 6); // 6am-6pm
  date.setMinutes(Math.floor(Math.random() * 60));

  const distances = [500, 750, 1000, 1500, 2000, 2500, 3000];
  const distance = distances[Math.floor(Math.random() * distances.length)];

  // Realistic pace: 1.5-3.0 min/100m
  const basePace = 1.8 + Math.random() * 1.0;
  const pace = parseFloat(basePace.toFixed(2));

  // Duration based on distance and pace
  const duration = Math.round((distance / 100) * pace);

  // Strokes: roughly 20-35 per 25m
  const strokesPer25m = 20 + Math.random() * 15;
  const strokes = Math.round((distance / 25) * strokesPer25m);

  // SWOLF: pace in seconds per 25m + strokes per 25m
  const paceSecondsper25m = (pace * 60) / 4; // 100m = 4 lengths
  const swolf = Math.round(paceSecondsper25m + strokesPer25m);

  // Random rating (30% good, 10% bad, 60% unrated)
  const rand = Math.random();
  const rating = rand > 0.7 ? true : rand < 0.1 ? false : null;

  // Generate lap data for variety
  const lapsCount = Math.floor(distance / 50); // 50m laps
  const laps = [];
  for (let i = 0; i < lapsCount; i++) {
    const lapPace = pace + (Math.random() - 0.5) * 0.4; // ±0.2 variance
    laps.push({
      number: i + 1,
      distance: 50,
      time: lapPace * 0.5 * 60, // seconds for 50m
      pace: parseFloat(lapPace.toFixed(2)),
      strokes: Math.round(strokesPer25m * 2)
    });
  }

  return {
    id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: date.toISOString(),
    distance,
    duration,
    pace,
    strokes,
    swolf,
    rating,
    laps: laps.length > 0 ? laps : undefined,
    calories: Math.round(distance * 0.5), // rough estimate
    source: 'test-data'
  };
};

// Generate a set of test sessions
export const generateTestSessions = (count = 20) => {
  const sessions = [];

  for (let i = 0; i < count; i++) {
    // Distribute sessions over the past 60 days
    const daysAgo = Math.floor(Math.random() * 60);
    sessions.push(generateRandomSession(daysAgo));
  }

  // Sort by date (newest first)
  return sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Generate a "perfect" swim for testing record features
export const generatePerfectSwim = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1); // Yesterday

  return {
    id: `perfect-${Date.now()}`,
    date: date.toISOString(),
    distance: 2000,
    duration: 30,
    pace: 1.50, // Very fast!
    strokes: 1200,
    swolf: 32, // Excellent efficiency
    rating: true,
    laps: [
      { number: 1, distance: 50, time: 45, pace: 1.50, strokes: 40 },
      { number: 2, distance: 50, time: 45, pace: 1.50, strokes: 40 },
      { number: 3, distance: 50, time: 45, pace: 1.50, strokes: 40 },
      { number: 4, distance: 50, time: 45, pace: 1.50, strokes: 40 }
    ],
    calories: 1000,
    source: 'test-data-perfect'
  };
};

// Generate a "struggling" swim for testing improvement features
export const generateStrugglingSwim = () => {
  const date = new Date();

  return {
    id: `struggling-${Date.now()}`,
    date: date.toISOString(),
    distance: 1000,
    duration: 35,
    pace: 2.80, // Slower
    strokes: 900,
    swolf: 52, // Less efficient
    rating: false,
    laps: [
      { number: 1, distance: 50, time: 70, pace: 2.33, strokes: 45 },
      { number: 2, distance: 50, time: 72, pace: 2.40, strokes: 46 },
      { number: 3, distance: 50, time: 75, pace: 2.50, strokes: 47 },
      { number: 4, distance: 50, time: 78, pace: 2.60, strokes: 48 }
    ],
    calories: 500,
    source: 'test-data-struggling'
  };
};

// Load test data into localStorage
export const loadTestData = () => {
  const testSessions = generateTestSessions(25);

  // Add a perfect swim as most recent
  testSessions.unshift(generatePerfectSwim());

  // Add a struggling swim from a few days ago
  const strugglingSwim = generateStrugglingSwim();
  strugglingSwim.date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  testSessions.splice(3, 0, strugglingSwim);

  localStorage.setItem('swimSessions', JSON.stringify(testSessions));

  console.log(`✅ Loaded ${testSessions.length} test swim sessions`);
  console.log('📊 Test data includes:');
  console.log(`   - ${testSessions.length} total sessions`);
  console.log(`   - Date range: ${new Date(testSessions[testSessions.length - 1].date).toLocaleDateString()} to ${new Date(testSessions[0].date).toLocaleDateString()}`);
  console.log(`   - 1 perfect swim (pace: 1:30/100m)`);
  console.log(`   - 1 struggling swim (pace: 2:48/100m)`);
  console.log(`   - ${testSessions.length - 2} regular swims (varied performance)`);

  return testSessions;
};

// Clear all test data
export const clearTestData = () => {
  localStorage.removeItem('swimSessions');
  console.log('🗑️ Cleared all test data');
};

// Check if data exists
export const hasData = () => {
  const data = localStorage.getItem('swimSessions');
  return data && JSON.parse(data).length > 0;
};

// Auto-load test data if none exists (for development)
export const ensureTestData = () => {
  if (!hasData()) {
    console.log('⚠️ No swim data found - loading test data...');
    return loadTestData();
  } else {
    const sessions = JSON.parse(localStorage.getItem('swimSessions'));
    console.log(`✅ Found ${sessions.length} existing swim sessions`);
    return sessions;
  }
};
