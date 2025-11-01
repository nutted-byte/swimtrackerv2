import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '../Card';
import { Calendar, CheckCircle2, Target, TrendingUp, Clock, ArrowRight, Flame } from 'lucide-react';
import { useTrainingPlan } from '../../context/TrainingPlanContext';

export const TrainingPlanCard = () => {
  const { trainingPlan, nextWorkout, loading } = useTrainingPlan();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border-accent-blue/30">
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // No active plan - show create plan CTA
  if (!trainingPlan) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border-accent-blue/30">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.4 }}
                className="p-3 rounded-xl bg-accent-blue/20"
              >
                <Target className="w-8 h-8 text-accent-blue" />
              </motion.div>
              <div>
                <h3 className="font-display text-lg font-bold">Training Plan</h3>
                <p className="text-sm text-content-secondary">Reach your swimming goals</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-bg/30 rounded-lg p-6 mb-4 text-center">
            <p className="text-content-secondary mb-4">
              Get a personalized training plan to help you swim further, faster, or prepare for an event.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-content-tertiary mb-4">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-accent-blue" />
                <span>AI-generated</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-accent-blue" />
                <span>Progressive</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-accent-blue" />
                <span>Goal-focused</span>
              </div>
            </div>
          </div>

          <Link
            to="/training"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-accent-blue hover:bg-accent-blue/90 rounded-lg transition-colors font-medium"
          >
            Create Training Plan
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>
      </motion.div>
    );
  }

  // Has active plan - show progress
  const { goal, progress, weeks } = trainingPlan;
  const currentWeek = weeks.find(w => w.weekNumber === progress.currentWeek);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border-accent-blue/30">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.4 }}
              className="p-3 rounded-xl bg-accent-blue/20"
            >
              <Target className="w-8 h-8 text-accent-blue" />
            </motion.div>
            <div>
              <h3 className="font-display text-lg font-bold">Your Training Plan</h3>
              <p className="text-sm text-content-secondary">{goal.description}</p>
            </div>
          </div>
          {trainingPlan.status === 'active' && (
            <span className="text-[10px] px-2 py-1 rounded-full font-semibold bg-accent-blue/20 text-accent-blue">
              Active
            </span>
          )}
        </div>

        {/* Progress Section */}
        <div className="bg-dark-bg/30 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-content-secondary">Week {progress.currentWeek} of {weeks.length}</span>
            <span className="text-sm font-semibold text-accent-blue">{progress.percentComplete}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentComplete}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-accent-blue to-primary-500 rounded-full"
            />
          </div>

          {/* Current Week Focus */}
          {currentWeek && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-content-tertiary">This week:</span>
              <span className="text-sm font-medium text-content">{currentWeek.focus}</span>
            </div>
          )}

          {/* Stats Row */}
          <div className="flex items-center justify-between text-xs text-content-tertiary pt-3 border-t border-dark-border/30">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-blue" />
              <span>{progress.completedWorkouts} / {progress.totalWorkouts} workouts</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{progress.streak} day streak</span>
            </div>
          </div>
        </div>

        {/* Next Workout Preview */}
        {nextWorkout && (
          <div className="bg-dark-bg/30 rounded-lg p-4 mb-4 border border-accent-blue/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-accent-blue" />
              <span className="text-xs font-semibold text-accent-blue uppercase">Next Workout</span>
            </div>
            <h4 className="font-semibold text-sm mb-2">{nextWorkout.title}</h4>
            <div className="flex items-center gap-4 text-xs text-content-tertiary">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{(nextWorkout.totalDistance / 1000).toFixed(1)}km</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>~{nextWorkout.estimatedTime} min</span>
              </div>
              <div className="flex items-center gap-1 capitalize">
                <Calendar className="w-3.5 h-3.5" />
                <span>{nextWorkout.day}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link
          to="/training"
          className="flex items-center justify-between w-full px-4 py-2.5 bg-accent-blue/10 hover:bg-accent-blue/20 border border-accent-blue/30 rounded-lg transition-colors group"
        >
          <span className="font-semibold text-sm text-accent-blue">View Full Plan</span>
          <ArrowRight className="w-4 h-4 text-accent-blue group-hover:translate-x-1 transition-transform" />
        </Link>
      </Card>
    </motion.div>
  );
};
