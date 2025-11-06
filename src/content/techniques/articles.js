// Technique articles metadata
// Content is lazy-loaded to optimize token usage

export const techniqueArticlesMetadata = {
  'understanding-swolf': {
    id: 'understanding-swolf',
    title: 'Understanding SWOLF: Your Efficiency Score',
    category: 'efficiency',
    level: 'beginner',
    readTime: '3 min',
    summary: 'Learn what SWOLF means and why it matters for your swimming.',
    keyTakeaways: [
      'SWOLF = strokes + seconds per length (lower is better)',
      'Good SWOLF for recreational swimmers: 55-70',
      'Improve through better technique OR better fitness',
      'Elite swimmers have SWOLF under 50'
    ]
  },
  'reduce-stroke-count': {
    id: 'reduce-stroke-count',
    title: 'How to Reduce Your Stroke Count',
    category: 'efficiency',
    level: 'beginner',
    readTime: '4 min',
    summary: 'Practical tips to take fewer strokes per length.',
    keyTakeaways: [
      'Count your strokes to establish baseline',
      'Focus on gliding longer between strokes',
      'High elbow catch and full pull-through',
      'Body rotation adds power without extra strokes'
    ],
    drills: [
      {
        name: 'Catch-up Freestyle',
        description: 'Extend one arm while other completes stroke',
        distance: '4x50m',
        focus: 'Glide and timing'
      },
      {
        name: 'Fist Swimming',
        description: 'Swim with closed fists to improve catch',
        distance: '4x25m',
        focus: 'High elbow position'
      }
    ]
  },
  'improve-freestyle-technique': {
    id: 'improve-freestyle-technique',
    title: 'Freestyle Technique Fundamentals',
    category: 'technique',
    level: 'beginner',
    readTime: '5 min',
    summary: 'Master the basics of efficient freestyle swimming.',
    keyTakeaways: [
      'Four phases: Catch, Pull, Recovery, Glide',
      'High elbow catch and pull for power',
      'Breathe by rotating head, not lifting',
      'Body rotation comes from core, not shoulders'
    ]
  },
  'consistent-pacing': {
    id: 'consistent-pacing',
    title: 'Mastering Consistent Pace',
    category: 'pacing',
    level: 'intermediate',
    readTime: '4 min',
    summary: 'Learn to maintain even pace throughout your swim.',
    keyTakeaways: [
      'Start controlled, finish strong (negative split)',
      'Use stroke count to maintain consistency',
      'Know your target pace zones',
      'Even pacing is faster than fast-start/fade'
    ]
  },
  'breathing-patterns': {
    id: 'breathing-patterns',
    title: 'Bilateral Breathing & Breathing Patterns',
    category: 'technique',
    level: 'intermediate',
    readTime: '3 min',
    summary: 'Master different breathing patterns to improve efficiency.',
    keyTakeaways: [
      'Bilateral breathing = breathing on both sides',
      'Most common pattern: every 3 strokes',
      'Improves balance and stroke symmetry',
      'Exhale continuously underwater - don\'t hold breath'
    ]
  },
  'streamline-technique': {
    id: 'streamline-technique',
    title: 'Perfect Your Streamline',
    category: 'technique',
    level: 'beginner',
    readTime: '3 min',
    summary: 'The most important position in swimming - master your streamline.',
    keyTakeaways: [
      'Streamline is the fastest position in swimming',
      'Perfect streamline = 60% less drag',
      'Hold streamline 3-5 meters off every wall',
      'Focus: locked arms, neutral head, pointed toes'
    ]
  }
};

// Lazy-load article content only when needed
export const loadArticleContent = async (articleId) => {
  try {
    const module = await import(`./content/${articleId}.js`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load article content for ${articleId}:`, error);
    return null;
  }
};

// Combined article data (metadata + content)
// This will be populated lazily
export const techniqueArticles = {};

// Initialize articles with metadata
Object.keys(techniqueArticlesMetadata).forEach(id => {
  techniqueArticles[id] = {
    ...techniqueArticlesMetadata[id],
    content: null, // Will be loaded on demand
    _loadContent: async function() {
      if (!this.content) {
        this.content = await loadArticleContent(id);
      }
      return this.content;
    }
  };
});
