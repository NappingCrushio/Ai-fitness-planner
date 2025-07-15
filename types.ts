export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface TrainingPlan {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface ExerciseSuggestion {
  exerciseName: string;
  suggestion: string;
}

export interface AISuggestions {
  overallFeedback: string;
  exerciseSuggestions: ExerciseSuggestion[];
}
