// Warm-Up & Cool-Down routines
// Static, illustrated guide content for the /learn "Warm-Up & Cool-Down" tab.
// Shape mirrors the structured `drills[]` pattern used in src/content/techniques.
// `icon` is a lucide icon NAME (string) — mapped to a component in WarmupGuide.jsx.

export const warmupRoutine = {
  key: 'warmup',
  title: 'Warm-Up',
  tagline: 'Prime your body before you push off',
  totalTime: '10–15 min',
  variant: 'primary',
  intro:
    'A few easy minutes before the main set wakes up your heart, shoulders and hips, ' +
    'grooves your stroke, and makes the hard part feel smoother. Skip it and the first ' +
    '200m always feels like a fight — this is how you avoid that (and stay injury-free).',
  phases: [
    {
      id: 'poolside-activation',
      name: 'Poolside activation',
      location: 'Poolside',
      duration: '3 min',
      icon: 'Activity',
      why: 'Raises your heart rate and opens the shoulders and hips before they take any load.',
      activities: [
        { name: 'Arm swings & circles', detail: '10 forward, 10 backward — big, loose swings to loosen the shoulders.' },
        { name: 'Shoulder rolls', detail: '10 each way, slow and controlled.' },
        { name: 'Torso twists', detail: '10 gentle rotations to wake up the core and spine.' },
        { name: 'Leg swings', detail: '10 per leg, front-to-back, holding the wall for balance.' },
        { name: 'Ankle rolls', detail: '10 each foot — small thing, but it helps your kick.' },
      ],
    },
    {
      id: 'easy-swim',
      name: 'Easy swim',
      location: 'In the water',
      duration: '5 min',
      icon: 'Waves',
      why: 'Gets you used to the water and grooves your stroke at a relaxed effort.',
      activities: [
        { name: '200–300m easy', detail: 'Mixed strokes if you like. Conversational effort — you should be able to chat.' },
        { name: 'Focus on feel', detail: 'Long, smooth strokes. This is not the workout — it is the on-ramp.' },
      ],
    },
    {
      id: 'drills',
      name: 'Drills',
      location: 'In the water',
      duration: '4 min',
      icon: 'Target',
      why: 'Reinforces good technique while your body is fresh, before the main set.',
      activities: [
        { name: 'Catch-up freestyle', detail: '1×50m — one arm waits for the other, encouraging a long glide.' },
        { name: 'Kick with a board', detail: '1×50m — steady legs, relaxed ankles.' },
        { name: 'Single-arm freestyle', detail: '2×50m (25m each arm) — isolate and feel each pull.' },
      ],
    },
    {
      id: 'build-primer',
      name: 'Build / pace primer',
      location: 'In the water',
      duration: '2–3 min',
      icon: 'TrendingUp',
      why: 'Opens up your turnover and primes race pace without leaving you tired.',
      activities: [
        { name: '4×25m build', detail: 'Start easy, finish strong on each 25 — get faster within the length.' },
        { name: 'Short rest', detail: '15–20 sec between each. You want sharp, not fatigued.' },
      ],
    },
  ],
};

export const cooldownRoutine = {
  key: 'cooldown',
  title: 'Cool-Down',
  tagline: 'Ease your body back down after the effort',
  totalTime: '8–10 min',
  variant: 'accent',
  intro:
    'Stopping dead after a hard swim leaves your heart racing and your muscles full of ' +
    'the by-products of effort. A short, easy cool-down clears them out, brings your heart ' +
    'rate down gently, and means you feel less sore tomorrow.',
  phases: [
    {
      id: 'flush-swim',
      name: 'Flush swim',
      location: 'In the water',
      duration: '5 min',
      icon: 'Waves',
      why: 'Clears the by-products of hard effort and lowers your heart rate gradually.',
      activities: [
        { name: '100–200m very easy', detail: 'The slower the better — this is active recovery, not more training.' },
        { name: 'Add some backstroke', detail: 'A length or two on your back opens the chest and shoulders.' },
      ],
    },
    {
      id: 'easy-kick',
      name: 'Easy kick / float',
      location: 'In the water',
      duration: '2 min',
      icon: 'Wind',
      why: 'Keeps blood moving through tired legs and lets you relax.',
      activities: [
        { name: 'Gentle kick on your back', detail: 'Light, easy flutter — no board needed.' },
        { name: 'Or light sculling', detail: 'Small figure-8 hand movements while you float and breathe.' },
      ],
    },
    {
      id: 'poolside-stretches',
      name: 'Poolside stretches',
      location: 'Poolside',
      duration: '3 min',
      icon: 'Dumbbell',
      why: 'Maintains flexibility in the muscles you just worked and cuts next-day soreness.',
      activities: [
        { name: 'Cross-body shoulder', detail: 'Hold each arm across your chest for 20–30 sec.' },
        { name: 'Overhead triceps', detail: 'Reach down your back, gently ease with the other hand.' },
        { name: 'Chest / doorway stretch', detail: 'Forearm on a wall or post, turn away to open the chest.' },
        { name: 'Calf stretch', detail: 'Press one heel down against the pool wall or a step.' },
        { name: 'Gentle hamstring', detail: 'Easy forward fold — no bouncing, just let it lengthen.' },
      ],
    },
    {
      id: 'breathe-rehydrate',
      name: 'Breathe & rehydrate',
      location: 'Poolside',
      duration: '1 min',
      icon: 'Droplets',
      why: 'Shifts your body into recovery mode and replaces what you sweated out.',
      activities: [
        { name: 'Slow breathing', detail: 'A few long, slow breaths — in through the nose, out through the mouth.' },
        { name: 'Drink water', detail: 'Yes, you sweat in the pool. Rehydrate before you leave.' },
      ],
    },
  ],
};

export const routines = [warmupRoutine, cooldownRoutine];
