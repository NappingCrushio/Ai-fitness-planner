
import React, { useState } from 'react';

interface AddExerciseFormProps {
    onAdd: (name: string) => void;
}

const AddExerciseForm: React.FC<AddExerciseFormProps> = ({ onAdd }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(name);
        setName('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 mt-6 border-t border-slate-700 pt-6">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Squats, Deadlifts..."
                className="flex-grow bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-shadow"
            />
            <button
                type="submit"
                className="bg-slate-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-500 transition-colors disabled:opacity-50"
                disabled={!name.trim()}
            >
                Add Exercise
            </button>
        </form>
    );
};

export default AddExerciseForm;
