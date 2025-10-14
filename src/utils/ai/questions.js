/**
 * Interactive Q&A generation for swim analysis
 */

// Helper function for formatting pace in answers
const formatPace = (pace) => {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Generate contextual questions about a swim
 * @param {Object} lastSwim - The swim session
 * @param {Object} deepAnalysis - Deep analysis from analyzeLastSwimDeep
 * @param {Array} sessions - All sessions
 * @returns {Array} Array of question objects
 */
export const generateSwimQuestions = (lastSwim, deepAnalysis, sessions) => {
  const questions = [];

  if (!lastSwim || !deepAnalysis) return questions;

  const { comparative, pacing, fatigue } = deepAnalysis;

  // Question 1: Pace performance
  if (comparative?.vsRecent) {
    const paceDiff = Math.abs(comparative.vsRecent.paceDiff);
    const isFaster = comparative.vsRecent.isBetter;

    questions.push({
      id: 'pace-why',
      question: `Why was my pace ${paceDiff.toFixed(1)}% ${isFaster ? 'faster' : 'slower'} than usual?`,
      icon: '🏃',
      category: 'performance'
    });
  }

  // Question 2: SWOLF meaning
  if (lastSwim.swolf > 0) {
    questions.push({
      id: 'swolf-meaning',
      question: `What does my SWOLF score of ${lastSwim.swolf} mean?`,
      icon: '📊',
      category: 'efficiency'
    });
  }

  // Question 3: Personal best proximity
  if (comparative?.vsPB) {
    const pbDiff = Math.abs(comparative.vsPB.paceDiff);

    questions.push({
      id: 'pb-proximity',
      question: comparative.vsPB.isPB
        ? `This is my personal best! What made it special?`
        : `I'm ${pbDiff.toFixed(1)}% off my PB. How do I close the gap?`,
      icon: '🏆',
      category: 'goals'
    });
  }

  // Question 4: Improvement focus
  questions.push({
    id: 'focus-next',
    question: 'What should I focus on improving next?',
    icon: '🎯',
    category: 'coaching'
  });

  // Question 5: Pacing strategy (if lap data available)
  if (pacing && lastSwim.laps && lastSwim.laps.length > 0) {
    questions.push({
      id: 'pacing-strategy',
      question: 'Did I pace this swim well?',
      icon: '⏱️',
      category: 'strategy'
    });
  }

  // Question 6: Consistency
  if (sessions.length >= 5) {
    questions.push({
      id: 'consistency',
      question: 'Am I building consistency in my swimming?',
      icon: '📈',
      category: 'progress'
    });
  }

  // Question 7: Same distance comparison
  if (comparative?.vsSameDistance) {
    questions.push({
      id: 'distance-comparison',
      question: `How does this compare to my other ${(lastSwim.distance / 1000).toFixed(2)}km swims?`,
      icon: '📏',
      category: 'comparison'
    });
  }

  return questions;
};

/**
 * Generate answer for a specific question about a swim
 * @param {string} questionId - The question ID
 * @param {Object} lastSwim - The swim session
 * @param {Object} deepAnalysis - Deep analysis from analyzeLastSwimDeep
 * @param {Object} ranking - Ranking from calculateSwimRanking
 * @param {Array} sessions - All sessions
 * @returns {string} Natural language answer
 */
export const answerSwimQuestion = (questionId, lastSwim, deepAnalysis, ranking, sessions) => {
  if (!lastSwim || !deepAnalysis) return 'Unable to analyze this swim.';

  const { comparative, pacing, fatigue, patterns, recommendations } = deepAnalysis;

  switch (questionId) {
    case 'pace-why': {
      if (!comparative?.vsRecent) return 'Not enough data to compare pace.';

      const paceDiff = comparative.vsRecent.paceDiff;
      const isFaster = comparative.vsRecent.isBetter;

      let answer = `Your pace was ${isFaster ? 'faster' : 'slower'} than your recent average. `;

      if (isFaster) {
        if (lastSwim.distance > (comparative.vsRecent.avgDistance || 0)) {
          answer += `Impressive, especially since you swam a longer distance! `;
        }
        answer += `This suggests improved fitness or better conditions. `;
      } else {
        if (fatigue && fatigue.index > 60) {
          answer += `You showed signs of fatigue (${fatigue.index.toFixed(0)}% index), which may have affected your pace. `;
        }
        if (lastSwim.distance > (comparative.vsRecent.avgDistance || 0)) {
          answer += `You swam a longer distance, which naturally affects pace. `;
        }
        answer += `This is normal variation - focus on consistency. `;
      }

      return answer;
    }

    case 'swolf-meaning': {
      const swolf = lastSwim.swolf;
      let answer = `SWOLF (Swim Golf) combines your time and stroke count per lap - lower is better. `;

      if (comparative?.vsRecent?.avgSwolf) {
        const swolfDiff = swolf - comparative.vsRecent.avgSwolf;
        if (swolfDiff < -2) {
          answer += `Your ${swolf} is excellent - ${Math.abs(swolfDiff).toFixed(0)} points better than your average! More efficient. `;
        } else if (swolfDiff > 2) {
          answer += `Your ${swolf} is ${swolfDiff.toFixed(0)} points higher than average. Try fewer, longer strokes. `;
        } else {
          answer += `Your ${swolf} is consistent with your average. `;
        }
      }

      if (swolf < 35) {
        answer += `Under 35 is elite territory!`;
      } else if (swolf < 45) {
        answer += `Under 45 shows good efficiency.`;
      } else if (swolf < 55) {
        answer += `There's room to improve - focus on technique.`;
      }

      return answer;
    }

    case 'pb-proximity': {
      if (!comparative?.vsPB) return 'No personal best data available.';

      if (comparative.vsPB.isPB) {
        let answer = `Congratulations on your new personal best! `;
        if (pacing?.strategy === 'even') {
          answer += `Your even pacing strategy paid off. `;
        }
        answer += `This is your fastest ${(lastSwim.distance / 1000).toFixed(2)}km swim!`;
        return answer;
      }

      const pbDiff = Math.abs(comparative.vsPB.paceDiff);
      let answer = `You're ${pbDiff.toFixed(1)}% off your PB pace. `;

      if (pbDiff < 5) {
        answer += `You're very close! A few tweaks could get you there: `;
        if (pacing?.strategy === 'negative') {
          answer += `Great negative split strategy. `;
        }
        answer += `Focus on maintaining pace in the middle section.`;
      } else if (pbDiff < 10) {
        answer += `To close the gap: `;
        if (comparative.targetPace) {
          answer += `Target ${comparative.targetPace} min/100m as an intermediate goal. `;
        }
        answer += `Work on maintaining consistency across laps.`;
      } else {
        answer += `That's a bigger gap. Focus on building fitness through regular training first.`;
      }

      return answer;
    }

    case 'focus-next': {
      if (!recommendations || recommendations.length === 0) {
        return 'Keep up your current training routine. Focus on consistency.';
      }

      const topRec = recommendations[0];
      let answer = `Based on this swim: ${topRec.message} `;
      answer += `Action: ${topRec.action}`;

      return answer;
    }

    case 'pacing-strategy': {
      if (!pacing) return 'No pacing data available for this swim.';

      let answer = `Your pacing strategy was ${pacing.strategy}. `;

      if (pacing.strategy === 'even') {
        answer += `Excellent! Even pacing is ideal for most swims. `;
        answer += `Your pace variation was ${pacing.paceChange.toFixed(1)}% - very consistent.`;
      } else if (pacing.strategy === 'negative') {
        answer += `Great job! Negative splits (getting faster) show good energy management. `;
        answer += `You sped up by ${Math.abs(pacing.paceChange).toFixed(1)}% in the second half.`;
      } else if (pacing.strategy === 'positive') {
        answer += `You slowed down ${pacing.paceChange.toFixed(1)}% over the swim. `;
        if (fatigue && fatigue.index > 70) {
          answer += `High fatigue (${fatigue.index.toFixed(0)}%) suggests you went out too fast. Try starting slower.`;
        } else {
          answer += `This is normal for longer swims. Try to maintain pace better in the second half.`;
        }
      }

      return answer;
    }

    case 'consistency': {
      if (!sessions || sessions.length < 5) {
        return 'You need more swims to analyze consistency patterns.';
      }

      const last10 = sessions.slice(0, 10);
      const paces = last10.filter(s => s.pace > 0).map(s => s.pace);

      if (paces.length < 5) {
        return 'Not enough pace data to analyze consistency.';
      }

      const avgPace = paces.reduce((sum, p) => sum + p, 0) / paces.length;
      const variance = paces.reduce((sum, p) => sum + Math.pow(p - avgPace, 2), 0) / paces.length;
      const stdDev = Math.sqrt(variance);
      const cv = (stdDev / avgPace) * 100; // Coefficient of variation

      let answer = '';
      if (cv < 5) {
        answer = `Excellent consistency! Your pace varies by only ${cv.toFixed(1)}% across recent swims. `;
        answer += `This shows strong training discipline.`;
      } else if (cv < 10) {
        answer = `Good consistency. Your pace varies by ${cv.toFixed(1)}%, which is normal. `;
        answer += `Keep up the regular training schedule.`;
      } else {
        answer = `Your pace varies by ${cv.toFixed(1)}% between swims. `;
        answer += `Try to swim similar distances at similar effort levels to build consistency.`;
      }

      if (patterns?.bestDayOfWeek) {
        answer += ` You tend to swim best on ${patterns.bestDayOfWeek}.`;
      }

      return answer;
    }

    case 'distance-comparison': {
      if (!comparative?.vsSameDistance) {
        return 'No other swims at this distance to compare to.';
      }

      const { isBest, paceDiff, bestPace } = comparative.vsSameDistance;

      let answer = `For ${(lastSwim.distance / 1000).toFixed(2)}km swims: `;

      if (isBest) {
        answer += `This is your fastest at this distance! `;
        answer += `Keep training at this distance to build on this success.`;
      } else {
        answer += `Your best at this distance was ${formatPace(bestPace)}. `;
        answer += `You're ${Math.abs(paceDiff).toFixed(1)}% ${paceDiff > 0 ? 'slower' : 'faster'} than that. `;

        if (Math.abs(paceDiff) < 5) {
          answer += `Very close to your best!`;
        } else {
          answer += `Keep working on this distance - you have room to improve.`;
        }
      }

      return answer;
    }

    default:
      return 'Question not recognized.';
  }
};
