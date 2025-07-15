
import React from 'react';
import { Exercise } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface ExerciseCardProps {
    exercise: Exercise;
    onUpdate: (exercise: Exercise) => void;
    onDelete: (id: string) => void;
}

const InputField: React.FC<{label: string, value: number, onChange: (value: number) => void}> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
            className="w-20 bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-center text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        />
    </div>
);


const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onUpdate, onDelete }) => {
    const handleUpdate = <K extends keyof Exercise,>(key: K, value: Exercise[K]) => {
        onUpdate({ ...exercise, [key]: value });
    };

    return (
        <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-between transition-all hover:bg-slate-700/50 border border-transparent hover:border-slate-600">
            <div className="flex-grow">
                <p className="text-lg font-bold text-white">{exercise.name}</p>
            </div>
            <div className="flex items-center gap-4">
                <InputField
                    label="Sets"
                    value={exercise.sets}
                    onChange={(val) => handleUpdate('sets', val)}
                />
                <InputField
                    label="Reps"
                    value={exercise.reps}
                    onChange={(val) => handleUpdate('reps', val)}
                />
                <InputField
                    label="Weight (kg)"
                    value={exercise.weight}
                    onChange={(val) => handleUpdate('weight', val)}
                />
                <button
                    onClick={() => onDelete(exercise.id)}
                    className="ml-4 text-slate-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-700"
                    aria-label="Delete exercise"
                >
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};

export default ExerciseCard;
