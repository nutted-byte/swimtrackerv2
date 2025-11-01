import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { sampleTrainingPlan, getNextWorkout, getUpcomingWorkouts, getThisWeekWorkouts } from '../data/sampleTrainingPlan';
import { generateTrainingPlan } from '../utils/planGenerator';

const TrainingPlanContext = createContext();

export const useTrainingPlan = () => {
  const context = useContext(TrainingPlanContext);
  if (!context) {
    throw new Error('useTrainingPlan must be used within TrainingPlanProvider');
  }
  return context;
};

export const TrainingPlanProvider = ({ children }) => {
  const { user } = useAuth();
  const [trainingPlan, setTrainingPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load training plan on mount
  useEffect(() => {
    if (user) {
      loadTrainingPlan();
    } else {
      setTrainingPlan(null);
      setLoading(false);
    }
  }, [user]);

  /**
   * Load user's active training plan from Supabase
   */
  const loadTrainingPlan = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('training_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no rows returned, that's okay - user has no plan
        if (error.code === 'PGRST116') {
          setTrainingPlan(null);
        } else {
          throw error;
        }
      } else {
        setTrainingPlan(data);
        console.log('Loaded plan from Supabase:', data.id);
      }
    } catch (error) {
      console.error('Error loading training plan:', error);
      setTrainingPlan(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new training plan
   * @param {PlanCreationParams} params - Plan creation parameters
   */
  const createPlan = async (params) => {
    try {
      setLoading(true);

      // Map wizard formData to planGenerator parameters
      const planParams = {
        goalType: params.goalType,
        currentValue: parseFloat(params.current),
        targetValue: parseFloat(params.target),
        timeline: parseInt(params.timeline) || 8,
        eventName: params.eventName || null,
        eventDate: params.eventDate || null,
        experienceLevel: params.userLevel,
        daysPerWeek: parseInt(params.frequency),
        minutesPerSession: parseInt(params.sessionLength),
        poolLength: parseInt(params.poolLength) || 25,
        startDate: params.startDate || new Date()
      };

      // Generate personalized plan based on form inputs (with AI enhancement)
      console.log('Calling generateTrainingPlan with params:', planParams);
      const generatedPlan = await generateTrainingPlan(planParams);
      console.log('Generated plan:', generatedPlan);

      // Set user ID
      generatedPlan.user_id = user?.id;

      // Save to Supabase
      const { data, error } = await supabase
        .from('training_plans')
        .insert([generatedPlan])
        .select()
        .single();

      if (error) throw error;

      console.log('Saved plan to Supabase:', data.id);

      setTrainingPlan(data);
      return data;
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mark a workout as complete
   * @param {string} workoutId - Workout ID
   * @param {Object} actualPerformance - Actual performance data
   */
  const completeWorkout = async (workoutId, actualPerformance = {}) => {
    if (!trainingPlan) return;

    try {
      // Find and update the workout
      const updatedPlan = {
        ...trainingPlan,
        weeks: trainingPlan.weeks.map(week => ({
          ...week,
          sessions: week.sessions.map(session => {
            if (session.id === workoutId) {
              return {
                ...session,
                completed: true,
                completedAt: new Date(),
                actualPerformance: actualPerformance || null
              };
            }
            return session;
          })
        }))
      };

      // Update progress
      const completedWorkouts = updatedPlan.weeks
        .flatMap(w => w.sessions)
        .filter(s => s.completed).length;

      updatedPlan.progress = {
        ...updatedPlan.progress,
        completed_workouts: completedWorkouts,
        percent_complete: Math.round((completedWorkouts / updatedPlan.progress.total_workouts) * 100),
        streak: updatedPlan.progress.streak + 1,
        longest_streak: Math.max(updatedPlan.progress.streak + 1, updatedPlan.progress.longest_streak)
      };

      setTrainingPlan(updatedPlan);

      // Save to Supabase
      const { error: updateError } = await supabase
        .from('training_plans')
        .update(updatedPlan)
        .eq('id', trainingPlan.id);

      if (updateError) throw updateError;

      return updatedPlan;
    } catch (error) {
      console.error('Error completing workout:', error);
      throw error;
    }
  };

  const uncompleteWorkout = async (workoutId) => {
    if (!trainingPlan) return;

    try {
      // Find and update the workout
      const updatedPlan = {
        ...trainingPlan,
        weeks: trainingPlan.weeks.map(week => ({
          ...week,
          sessions: week.sessions.map(session => {
            if (session.id === workoutId) {
              return {
                ...session,
                completed: false,
                completedAt: null,
                actualPerformance: null
              };
            }
            return session;
          })
        }))
      };

      // Update progress
      const completedWorkouts = updatedPlan.weeks
        .flatMap(w => w.sessions)
        .filter(s => s.completed).length;

      updatedPlan.progress = {
        ...updatedPlan.progress,
        completed_workouts: completedWorkouts,
        percent_complete: Math.round((completedWorkouts / updatedPlan.progress.total_workouts) * 100)
      };

      setTrainingPlan(updatedPlan);

      // Save to Supabase
      const { error: updateError } = await supabase
        .from('training_plans')
        .update(updatedPlan)
        .eq('id', trainingPlan.id);

      if (updateError) throw updateError;

      return updatedPlan;
    } catch (error) {
      console.error('Error uncompleting workout:', error);
      throw error;
    }
  };

  /**
   * Link a swim session to a workout
   * @param {string} workoutId - Workout ID
   * @param {string} swimId - Swim session ID
   */
  const linkSwimToWorkout = async (workoutId, swimId, swimData) => {
    if (!trainingPlan) return;

    try {
      const actualPerformance = {
        distance: swimData.distance,
        duration: swimData.duration,
        pace: swimData.pace
      };

      await completeWorkout(workoutId, actualPerformance);

      // TODO: In Phase 2, update swim session with workout link
      // await supabase
      //   .from('sessions')
      //   .update({ workout_id: workoutId })
      //   .eq('id', swimId);

    } catch (error) {
      console.error('Error linking swim to workout:', error);
      throw error;
    }
  };

  /**
   * Delete/abandon training plan
   */
  const deletePlan = async () => {
    try {
      // Mark as abandoned in Supabase
      const { error } = await supabase
        .from('training_plans')
        .update({ status: 'abandoned' })
        .eq('id', trainingPlan.id);

      if (error) throw error;

      setTrainingPlan(null);
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  };

  /**
   * Pause/resume training plan
   */
  const togglePlanStatus = async () => {
    if (!trainingPlan) return;

    try {
      const newStatus = trainingPlan.status === 'active' ? 'paused' : 'active';

      const updatedPlan = {
        ...trainingPlan,
        status: newStatus
      };

      setTrainingPlan(updatedPlan);

      // Save to Supabase
      const { error } = await supabase
        .from('training_plans')
        .update({ status: newStatus })
        .eq('id', trainingPlan.id);

      if (error) throw error;

    } catch (error) {
      console.error('Error toggling plan status:', error);
      throw error;
    }
  };

  // Helper functions using imported utilities
  const nextWorkout = trainingPlan ? getNextWorkout(trainingPlan) : null;
  const upcomingWorkouts = trainingPlan ? getUpcomingWorkouts(trainingPlan) : [];
  const thisWeekWorkouts = trainingPlan ? getThisWeekWorkouts(trainingPlan) : [];

  const value = {
    // State
    trainingPlan,
    loading,
    hasActivePlan: !!trainingPlan,

    // Helper data
    nextWorkout,
    upcomingWorkouts,
    thisWeekWorkouts,

    // Actions
    loadTrainingPlan,
    createPlan,
    completeWorkout,
    uncompleteWorkout,
    linkSwimToWorkout,
    deletePlan,
    togglePlanStatus
  };

  return (
    <TrainingPlanContext.Provider value={value}>
      {children}
    </TrainingPlanContext.Provider>
  );
};
