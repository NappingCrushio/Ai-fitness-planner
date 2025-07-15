import React, { useState, useCallback, useMemo } from 'react';
import { Exercise, AISuggestions, TrainingPlan } from './types';
import { getWorkoutSuggestions } from './services/geminiService';
import Header from './components/Header';
import ExerciseCard from './components/ExerciseCard';
import AddExerciseForm from './components/AddExerciseForm';
import AiSuggestionModal from './components/AiSuggestionModal';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { LoaderIcon } from './components/icons/LoaderIcon';
import { PlusIcon } from './components/icons/PlusIcon';
import { TrashIcon } from './components/icons/TrashIcon';

const initialPlans: TrainingPlan[] = [
    {
        id: 'plan-1',
        name: 'Upper Body Focus',
        exercises: [
            { id: 'ex-1', name: 'Bench Press', sets: 3, reps: 8, weight: 60 },
            { id: 'ex-2', name: 'Overhead Press', sets: 3, reps: 10, weight: 30 },
            { id: 'ex-3', name: 'Tricep Dips', sets: 3, reps: 12, weight: 10 },
        ]
    },
    {
        id: 'plan-2',
        name: 'Leg Day',
        exercises: [
            { id: 'ex-4', name: 'Squats', sets: 4, reps: 8, weight: 100 },
            { id: 'ex-5', name: 'Leg Press', sets: 3, reps: 12, weight: 150 },
        ]
    }
];


const App: React.FC = () => {
    const [plans, setPlans] = useState<TrainingPlan[]>(initialPlans);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(initialPlans[0]?.id ?? null);
    const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const selectedPlan = useMemo(() => plans.find(p => p.id === selectedPlanId), [plans, selectedPlanId]);

    const updatePlanExercises = (planId: string, newExercises: Exercise[]) => {
        setPlans(prevPlans => prevPlans.map(p =>
            p.id === planId ? { ...p, exercises: newExercises } : p
        ));
    };

    const handleAddExercise = (name: string) => {
        if (!selectedPlanId || !name.trim()) return;
        const newExercise: Exercise = {
            id: `ex-${Date.now()}`,
            name,
            sets: 3,
            reps: 10,
            weight: 0,
        };
        const currentExercises = selectedPlan?.exercises ?? [];
        updatePlanExercises(selectedPlanId, [...currentExercises, newExercise]);
    };

    const handleUpdateExercise = (updatedExercise: Exercise) => {
        if (!selectedPlanId) return;
        const currentExercises = selectedPlan?.exercises ?? [];
        const newExercises = currentExercises.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex);
        updatePlanExercises(selectedPlanId, newExercises);
    };

    const handleDeleteExercise = (id: string) => {
        if (!selectedPlanId) return;
        const currentExercises = selectedPlan?.exercises ?? [];
        const newExercises = currentExercises.filter(ex => ex.id !== id);
        updatePlanExercises(selectedPlanId, newExercises);
    };

    const handleAddPlan = () => {
        const newPlan: TrainingPlan = {
            id: `plan-${Date.now()}`,
            name: `New Plan ${plans.length + 1}`,
            exercises: [],
        };
        setPlans([...plans, newPlan]);
        setSelectedPlanId(newPlan.id);
    };
    
    const handleRenamePlan = (planId: string, newName: string) => {
        setPlans(prevPlans => prevPlans.map(p => 
            p.id === planId ? { ...p, name: newName } : p
        ));
    };

    const handleDeletePlan = (planId: string) => {
        const newPlans = plans.filter(p => p.id !== planId);
        setPlans(newPlans);
        if (selectedPlanId === planId) {
            setSelectedPlanId(newPlans[0]?.id ?? null);
        }
    };

    const handleGetSuggestions = useCallback(async () => {
        if (!selectedPlan || selectedPlan.exercises.length === 0) {
            setError("Please select a plan and add at least one exercise to get suggestions.");
            setIsModalOpen(true);
            return;
        }
        setIsLoading(true);
        setError(null);
        setAiSuggestions(null);
        try {
            const suggestions = await getWorkoutSuggestions(selectedPlan.name, selectedPlan.exercises);
            setAiSuggestions(suggestions);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
            setIsModalOpen(true);
        }
    }, [selectedPlan]);
    
    return (
        <div className="min-h-screen bg-slate-900 text-white selection:bg-emerald-500/30">
            <Header />
            <main className="max-w-4xl mx-auto p-4 md:p-8">
                <div className="bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700 p-6 backdrop-blur-sm">
                    
                    <div className="mb-6 pb-6 border-b border-slate-700">
                        <label className="block text-sm font-medium text-slate-400 mb-3">
                            Your Training Plans
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                            {plans.map(plan => (
                                <button
                                    key={plan.id}
                                    onClick={() => setSelectedPlanId(plan.id)}
                                    className={`px-4 py-2 font-semibold rounded-full text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                                        selectedPlanId === plan.id 
                                        ? 'bg-emerald-500 text-slate-900 shadow-lg' 
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                                    }`}
                                >
                                    {plan.name}
                                </button>
                            ))}
                            <button
                                onClick={handleAddPlan}
                                className="flex items-center justify-center h-9 w-9 bg-slate-600 text-white font-semibold rounded-full hover:bg-slate-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-emerald-500"
                                aria-label="Add new plan"
                            >
                                <PlusIcon />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                         <div className="flex-grow">
                            {selectedPlan ? (
                                <input
                                    type="text"
                                    value={selectedPlan.name}
                                    onChange={(e) => handleRenamePlan(selectedPlan.id, e.target.value)}
                                    className="text-3xl font-bold text-white bg-transparent outline-none focus:bg-slate-700/50 rounded-lg px-2 -mx-2 w-full md:w-auto"
                                    aria-label="Plan name"
                                />
                            ) : (
                                <h1 className="text-3xl font-bold text-white">Select a Plan</h1>
                            )}
                            <p className="text-slate-400 mt-1">
                                {selectedPlan ? 'Log your exercises and get AI-powered feedback.' : 'Select or create a plan to get started.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                            {selectedPlan && plans.length > 1 && (
                                <button
                                    onClick={() => handleDeletePlan(selectedPlan.id)}
                                    className="p-3 bg-red-900/50 text-red-400 hover:bg-red-900 rounded-full transition-colors"
                                    aria-label="Delete current plan"
                                    >
                                    <TrashIcon />
                                </button>
                            )}
                            <button
                                onClick={handleGetSuggestions}
                                disabled={isLoading || !selectedPlan || selectedPlan.exercises.length === 0}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-black font-bold rounded-full hover:bg-emerald-400 transition-colors duration-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transform hover:scale-105"
                            >
                                {isLoading ? <LoaderIcon /> : <SparklesIcon />}
                                <span>{isLoading ? 'Analyzing...' : 'Get AI Suggestions'}</span>
                            </button>
                        </div>
                    </div>

                    {selectedPlan ? (
                        <>
                            <div className="space-y-4 mb-8">
                                {selectedPlan.exercises.length > 0 ? (
                                    selectedPlan.exercises.map(exercise => (
                                        <ExerciseCard
                                            key={exercise.id}
                                            exercise={exercise}
                                            onUpdate={handleUpdateExercise}
                                            onDelete={handleDeleteExercise}
                                        />
                                    ))
                                ) : (
                                   <div className="text-center py-12 px-6 bg-slate-800 rounded-lg border-2 border-dashed border-slate-700">
                                        <h3 className="text-xl font-semibold text-slate-300">Your plan is empty!</h3>
                                        <p className="text-slate-400 mt-2">Start by adding your first exercise below.</p>
                                    </div>
                                )}
                            </div>
                            <AddExerciseForm onAdd={handleAddExercise} />
                        </>
                    ) : (
                        <div className="text-center py-12 px-6 bg-slate-800 rounded-lg border-2 border-dashed border-slate-700">
                            <h3 className="text-xl font-semibold text-slate-300">No Training Plan Selected</h3>
                            <p className="text-slate-400 mt-2">Please create or select a plan to begin your workout.</p>
                        </div>
                    )}
                </div>
            </main>

            <AiSuggestionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                suggestions={aiSuggestions}
                error={error}
                isLoading={isLoading}
            />
        </div>
    );
};

export default App;