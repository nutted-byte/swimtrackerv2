import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import {
  Target,
  User,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Clock,
  Zap,
  Award
} from 'lucide-react';
import { GOAL_TYPES, USER_LEVELS } from '../types/trainingPlan';

export const PlanCreationWizard = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Goal
    goalType: GOAL_TYPES.DISTANCE,
    current: '',
    target: '',
    timeline: 8,

    // Step 2: Experience
    userLevel: USER_LEVELS.BEGINNER,

    // Step 3: Availability
    frequency: 3,
    sessionLength: 45,
    poolLength: 25,
    preferredDays: [],

    // Step 4: Start date
    startDate: new Date()
  });

  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  const totalSteps = 4;

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.current || formData.current <= 0) {
        newErrors.current = 'Please enter your current level';
      }
      if (!formData.target || formData.target <= 0) {
        newErrors.target = 'Please enter your target';
      }
      if (formData.goalType === GOAL_TYPES.DISTANCE && formData.target <= formData.current) {
        newErrors.target = 'Target must be greater than current';
      }
      if (formData.goalType === GOAL_TYPES.PACE && formData.target >= formData.current) {
        newErrors.target = 'Target pace must be faster (lower) than current';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setIsGenerating(true);
      setErrors({});
      await onComplete(formData);
      // Note: Don't reset isGenerating here - parent component will unmount wizard
    } catch (error) {
      console.error('Error creating plan:', error);
      setErrors({ submit: 'Failed to create plan. Please try again.' });
      setIsGenerating(false);
    }
  };

  const getGoalDescription = () => {
    if (formData.goalType === GOAL_TYPES.DISTANCE) {
      return `Swim ${formData.target}m continuous`;
    } else if (formData.goalType === GOAL_TYPES.PACE) {
      return `Improve pace to ${formData.target} min/100m`;
    }
    return 'Improve fitness';
  };

  return (
    <div className="max-w-3xl">
      {/* AI Generation Loading Overlay */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="font-display text-xl font-bold mb-2">Generating Your Plan...</h3>
            <p className="text-content-secondary text-sm max-w-md">
              AI is creating personalized weekly focuses and coaching tips tailored to your goals and experience level.
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="relative">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-accent-blue/20">
                <Target className="w-6 h-6 text-accent-blue" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">Create Training Plan</h2>
                <p className="text-sm text-content-secondary">Step {currentStep} of {totalSteps}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-accent-blue to-primary-500 rounded-full"
              />
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <StepOne
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}
            {currentStep === 2 && (
              <StepTwo
                formData={formData}
                updateFormData={updateFormData}
              />
            )}
            {currentStep === 3 && (
              <StepThree
                formData={formData}
                updateFormData={updateFormData}
              />
            )}
            {currentStep === 4 && (
              <StepFour
                formData={formData}
                getGoalDescription={getGoalDescription}
              />
            )}
          </AnimatePresence>

          {/* Error message */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-border">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 rounded-lg hover:bg-dark-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-accent-blue hover:bg-accent-blue/90 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-gradient-to-r from-accent-blue to-primary-500 hover:opacity-90 rounded-lg transition-opacity font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Create Plan
              </button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

// Step 1: Choose Your Goal
const StepOne = ({ formData, updateFormData, errors }) => {
  const goalOptions = [
    {
      type: GOAL_TYPES.DISTANCE,
      label: 'Build to Distance',
      icon: TrendingUp,
      description: 'Swim continuously for a target distance',
      example: 'e.g., Swim 1500m without stopping'
    },
    {
      type: GOAL_TYPES.PACE,
      label: 'Improve Pace',
      icon: Zap,
      description: 'Get faster over your typical distance',
      example: 'e.g., 2:00/100m pace'
    },
    {
      type: GOAL_TYPES.EVENT,
      label: 'Prepare for Event',
      icon: Award,
      description: 'Train for a competition or triathlon',
      example: 'Coming soon'
    }
  ];

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="font-display text-xl font-bold mb-2">What's your goal?</h3>
        <p className="text-sm text-content-secondary">Choose the type of improvement you want to achieve</p>
      </div>

      {/* Goal Type Selection */}
      <div className="grid grid-cols-1 gap-3">
        {goalOptions.map((option) => {
          const Icon = option.icon;
          const isDisabled = option.type === GOAL_TYPES.EVENT;

          return (
            <button
              key={option.type}
              onClick={() => !isDisabled && updateFormData('goalType', option.type)}
              disabled={isDisabled}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                formData.goalType === option.type
                  ? 'border-accent-blue bg-accent-blue/10'
                  : 'border-dark-border hover:border-dark-border/60'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  formData.goalType === option.type ? 'bg-accent-blue/20' : 'bg-dark-bg'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    formData.goalType === option.type ? 'text-accent-blue' : 'text-content-tertiary'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">{option.label}</div>
                  <div className="text-sm text-content-secondary">{option.description}</div>
                  <div className="text-xs text-content-tertiary mt-1 italic">{option.example}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Current & Target Inputs */}
      {(formData.goalType === GOAL_TYPES.DISTANCE || formData.goalType === GOAL_TYPES.PACE) && (
        <div className="space-y-4 pt-4 border-t border-dark-border">
          <div>
            <label className="block text-sm font-medium mb-2">
              Current {formData.goalType === GOAL_TYPES.DISTANCE ? 'Distance' : 'Pace'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.current}
                onChange={(e) => updateFormData('current', parseFloat(e.target.value))}
                className={`flex-1 px-4 py-2 bg-dark-bg border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue ${
                  errors.current ? 'border-red-500' : 'border-dark-border'
                }`}
                placeholder={formData.goalType === GOAL_TYPES.DISTANCE ? '800' : '2.5'}
              />
              <span className="text-content-tertiary">
                {formData.goalType === GOAL_TYPES.DISTANCE ? 'meters' : 'min/100m'}
              </span>
            </div>
            {errors.current && (
              <p className="text-xs text-red-400 mt-1">{errors.current}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Target {formData.goalType === GOAL_TYPES.DISTANCE ? 'Distance' : 'Pace'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.target}
                onChange={(e) => updateFormData('target', parseFloat(e.target.value))}
                className={`flex-1 px-4 py-2 bg-dark-bg border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue ${
                  errors.target ? 'border-red-500' : 'border-dark-border'
                }`}
                placeholder={formData.goalType === GOAL_TYPES.DISTANCE ? '1500' : '2.0'}
              />
              <span className="text-content-tertiary">
                {formData.goalType === GOAL_TYPES.DISTANCE ? 'meters' : 'min/100m'}
              </span>
            </div>
            {errors.target && (
              <p className="text-xs text-red-400 mt-1">{errors.target}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Timeline</label>
            <select
              value={formData.timeline}
              onChange={(e) => updateFormData('timeline', parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue"
            >
              <option value={4}>4 weeks</option>
              <option value={6}>6 weeks</option>
              <option value={8}>8 weeks</option>
              <option value={10}>10 weeks</option>
              <option value={12}>12 weeks</option>
            </select>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Step 2: Experience Level
const StepTwo = ({ formData, updateFormData }) => {
  const levels = [
    {
      level: USER_LEVELS.BEGINNER,
      label: 'Beginner',
      description: 'Less than 6 months of regular swimming',
      features: ['Foundational technique', 'Gradual progression', 'Extra recovery']
    },
    {
      level: USER_LEVELS.INTERMEDIATE,
      label: 'Intermediate',
      description: '6 months to 2 years of training',
      features: ['Moderate volume', 'Technique refinement', 'Pace variation']
    },
    {
      level: USER_LEVELS.ADVANCED,
      label: 'Advanced',
      description: '2+ years, competitive background',
      features: ['High volume', 'Race-specific training', 'Advanced drills']
    }
  ];

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="font-display text-xl font-bold mb-2">What's your experience level?</h3>
        <p className="text-sm text-content-secondary">This helps us tailor the training intensity</p>
      </div>

      <div className="space-y-3">
        {levels.map((option) => (
          <button
            key={option.level}
            onClick={() => updateFormData('userLevel', option.level)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              formData.userLevel === option.level
                ? 'border-accent-blue bg-accent-blue/10'
                : 'border-dark-border hover:border-dark-border/60'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold">{option.label}</div>
                <div className="text-sm text-content-secondary">{option.description}</div>
              </div>
              {formData.userLevel === option.level && (
                <CheckCircle2 className="w-5 h-5 text-accent-blue flex-shrink-0" />
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {option.features.map((feature, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-1 rounded ${
                    formData.userLevel === option.level
                      ? 'bg-accent-blue/20 text-accent-blue'
                      : 'bg-dark-bg text-content-tertiary'
                  }`}
                >
                  {feature}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// Step 3: Availability
const StepThree = ({ formData, updateFormData }) => {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="font-display text-xl font-bold mb-2">How often can you swim?</h3>
        <p className="text-sm text-content-secondary">Set realistic expectations for consistency</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Swims per week</label>
        <div className="grid grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map((freq) => (
            <button
              key={freq}
              onClick={() => updateFormData('frequency', freq)}
              className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                formData.frequency === freq
                  ? 'border-accent-blue bg-accent-blue/10 text-accent-blue'
                  : 'border-dark-border hover:border-dark-border/60'
              }`}
            >
              {freq}x
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Typical session length</label>
        <div className="grid grid-cols-4 gap-2">
          {[30, 45, 60, 90].map((length) => (
            <button
              key={length}
              onClick={() => updateFormData('sessionLength', length)}
              className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                formData.sessionLength === length
                  ? 'border-accent-blue bg-accent-blue/10 text-accent-blue'
                  : 'border-dark-border hover:border-dark-border/60'
              }`}
            >
              {length} min
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Pool length</label>
        <div className="grid grid-cols-2 gap-2">
          {[25, 50].map((length) => (
            <button
              key={length}
              onClick={() => updateFormData('poolLength', length)}
              className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                formData.poolLength === length
                  ? 'border-accent-blue bg-accent-blue/10 text-accent-blue'
                  : 'border-dark-border hover:border-dark-border/60'
              }`}
            >
              {length}m pool
            </button>
          ))}
        </div>
        <p className="text-xs text-content-tertiary mt-2">
          This ensures workout distances align with your pool's length
        </p>
      </div>

      <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium mb-1">Recommended: {formData.frequency}x per week, {formData.sessionLength} min</div>
            <div className="text-sm text-content-secondary">
              This gives you a balanced training schedule with adequate recovery time.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Step 4: Review & Confirm
const StepFour = ({ formData, getGoalDescription }) => {
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="font-display text-xl font-bold mb-2">Review your plan</h3>
        <p className="text-sm text-content-secondary">Make sure everything looks good before we create your personalized training plan</p>
      </div>

      <div className="bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border border-accent-blue/30 rounded-lg p-6">
        <h4 className="font-display text-2xl font-bold mb-4">{getGoalDescription()}</h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-content-secondary mb-1">Duration</div>
            <div className="font-semibold">{formData.timeline} weeks</div>
          </div>
          <div>
            <div className="text-sm text-content-secondary mb-1">Experience</div>
            <div className="font-semibold capitalize">{formData.userLevel}</div>
          </div>
          <div>
            <div className="text-sm text-content-secondary mb-1">Frequency</div>
            <div className="font-semibold">{formData.frequency}x per week</div>
          </div>
          <div>
            <div className="text-sm text-content-secondary mb-1">Session Length</div>
            <div className="font-semibold">{formData.sessionLength} minutes</div>
          </div>
        </div>
      </div>

      <div className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border">
        <h5 className="font-semibold mb-2">What happens next?</h5>
        <ul className="space-y-2 text-sm text-content-secondary">
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
            <span>AI will generate your {formData.timeline}-week training plan</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
            <span>Progressive workouts tailored to your level</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
            <span>Track progress and mark workouts complete</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
            <span>Adjust plan if you fall behind or race ahead</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};
