import { useMemo } from 'react';
import {
  aggregateByDay,
  aggregateByWeek,
  getCompareData,
  calculateLinearRegression,
  calculateConsistencyScore,
  calculateRollingAverage,
  findMilestones
} from '../utils/analytics';
import { calculateDPS } from '../utils/strokeEfficiency';

/**
 * Custom hook to process insights data
 */
export const useInsightsData = (sessions, timeRange, granularity, metric) => {
  // Filter sessions by time range
  const filteredSessions = useMemo(() => {
    // If timeRange is null (All Time), return all sessions
    if (timeRange === null) {
      return sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeRange);

    return sessions
      .filter(s => new Date(s.date) >= startDate && new Date(s.date) <= endDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Oldest first for charts
  }, [sessions, timeRange]);

  // Get comparison data for deltas
  const compareData = useMemo(() =>
    getCompareData(sessions, timeRange),
    [sessions, timeRange]
  );

  // Process data based on granularity
  const processedData = useMemo(() => {
    if (granularity === 'daily') {
      return aggregateByDay(filteredSessions);
    } else if (granularity === 'weekly') {
      return aggregateByWeek(filteredSessions);
    }
    return filteredSessions;
  }, [filteredSessions, granularity]);

  // Format date as DD/MM
  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  };

  // Transform to chart data format
  const chartData = useMemo(() => processedData.map((item, index) => {
    if (granularity === 'session') {
      return {
        date: formatShortDate(item.date),
        fullDate: new Date(item.date).toLocaleDateString(),
        pace: item.pace,
        paceSeconds: item.pace * 60,
        distance: item.distance / 1000,
        swolf: item.swolf,
        dps: calculateDPS(item),
        id: item.id,
        index
      };
    } else if (granularity === 'daily') {
      return {
        date: formatShortDate(item.date),
        fullDate: new Date(item.date).toLocaleDateString(),
        pace: item.avgPace,
        paceSeconds: item.avgPace * 60,
        distance: item.totalDistance / 1000,
        swolf: item.avgSwolf,
        dps: item.avgDPS || 0,
        count: item.count,
        index
      };
    } else {
      // weekly
      return {
        date: formatShortDate(item.weekStart),
        fullDate: `Week of ${new Date(item.weekStart).toLocaleDateString()}`,
        pace: item.avgPace,
        paceSeconds: item.avgPace * 60,
        distance: item.totalDistance / 1000,
        swolf: item.avgSwolf,
        dps: item.avgDPS || 0,
        count: item.count,
        index
      };
    }
  }), [processedData, granularity]);

  // Calculate valid data subsets
  const validPaceData = useMemo(() => chartData.filter(d => d.pace > 0), [chartData]);
  const validSwolfData = useMemo(() => chartData.filter(d => d.swolf > 0), [chartData]);
  const validDPSData = useMemo(() => chartData.filter(d => d.dps > 0), [chartData]);

  // Calculate statistics
  const stats = useMemo(() => ({
    avgPace: validPaceData.length > 0
      ? validPaceData.reduce((sum, d) => sum + d.pace, 0) / validPaceData.length
      : 0,
    totalDistance: chartData.reduce((sum, d) => sum + d.distance, 0),
    avgSwolf: validSwolfData.length > 0
      ? validSwolfData.reduce((sum, d) => sum + d.swolf, 0) / validSwolfData.length
      : 0,
    avgDPS: validDPSData.length > 0
      ? validDPSData.reduce((sum, d) => sum + d.dps, 0) / validDPSData.length
      : 0,
    count: filteredSessions.length
  }), [validPaceData, validSwolfData, validDPSData, chartData, filteredSessions.length]);

  // Calculate trends
  const paceTrend = useMemo(() => calculateLinearRegression(validPaceData, 'index', 'pace'), [validPaceData]);
  const distanceTrend = useMemo(() => calculateLinearRegression(chartData, 'index', 'distance'), [chartData]);
  const swolfTrend = useMemo(() => calculateLinearRegression(validSwolfData, 'index', 'swolf'), [validSwolfData]);
  const dpsTrend = useMemo(() => calculateLinearRegression(validDPSData, 'index', 'dps'), [validDPSData]);

  // Calculate consistency score
  const consistencyScore = useMemo(() =>
    calculateConsistencyScore(filteredSessions, timeRange),
    [filteredSessions, timeRange]
  );

  // Calculate sparkline data
  const sparklineData = useMemo(() => {
    const sparklineCount = Math.min(10, chartData.length);
    return {
      paceSparkline: validPaceData.slice(-sparklineCount).map(d => ({ value: d.pace })),
      distanceSparkline: chartData.slice(-sparklineCount).map(d => ({ value: d.distance })),
      swolfSparkline: validSwolfData.slice(-sparklineCount).map(d => ({ value: d.swolf }))
    };
  }, [chartData, validPaceData, validSwolfData]);

  // Calculate milestones
  const milestones = useMemo(() => findMilestones(filteredSessions), [filteredSessions]);

  // Calculate scatter plot data
  const scatterData = useMemo(() =>
    filteredSessions
      .filter(s => s.pace > 0 && s.swolf > 0)
      .map(s => ({
        pace: s.pace,
        swolf: s.swolf,
        distance: s.distance / 1000,
        date: new Date(s.date).toLocaleDateString(),
        id: s.id
      }))
  , [filteredSessions]);

  // Enrich chart data with rolling averages and trend lines
  const getMetricKey = () => {
    if (metric === 'pace') return 'paceSeconds';
    return metric;
  };

  const metricKey = getMetricKey();
  const chartDataWithRollingAvg = calculateRollingAverage(chartData, metricKey, 3);
  const currentTrend = metric === 'pace' ? paceTrend
    : metric === 'distance' ? distanceTrend
    : metric === 'dps' ? dpsTrend
    : swolfTrend;

  const enrichedChartData = chartData.map((point, index) => {
    const rollingPoint = chartDataWithRollingAvg[index];
    return {
      ...point,
      rollingAvg: rollingPoint?.[`${metricKey}RollingAvg`],
      trendValue: currentTrend.slope * index + currentTrend.intercept
    };
  });

  // Prepare previous window data for compare mode
  const previousWindowData = compareData.previous.length > 0
    ? compareData.previous
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((session, index) => ({
          date: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          pace: session.pace,
          paceSeconds: session.pace * 60,
          distance: session.distance / 1000,
          swolf: session.swolf,
          index
        }))
    : [];

  return {
    filteredSessions,
    compareData,
    chartData,
    enrichedChartData,
    validPaceData,
    validSwolfData,
    validDPSData,
    stats,
    trends: { paceTrend, distanceTrend, swolfTrend, dpsTrend },
    currentTrend,
    consistencyScore,
    sparklineData,
    milestones,
    scatterData,
    previousWindowData
  };
};
