
import React from 'react';
import { AISuggestions } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { LoaderIcon } from './icons/LoaderIcon';
import { WarningIcon } from './icons/WarningIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';

interface AiSuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    suggestions: AISuggestions | null;
    error: string | null;
    isLoading: boolean;
}

const AiSuggestionModal: React.FC<AiSuggestionModalProps> = ({ isOpen, onClose, suggestions, error, isLoading }) => {
    if (!isOpen) return null;

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-8">
                    <LoaderIcon />
                    <h3 className="text-xl font-semibold mt-4 text-white">Generating Feedback...</h3>
                    <p className="text-slate-400 mt-2">Our AI coach is analyzing your workout. Please wait a moment.</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center p-8">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <WarningIcon />
                    </div>
                    <h3 className="text-xl font-semibold mt-4 text-red-400">An Error Occurred</h3>
                    <p className="text-slate-400 mt-2">{error}</p>
                </div>
            );
        }

        if (suggestions) {
            return (
                <div>
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-900 sm:mx-0 sm:h-10 sm:w-10">
                                <SparklesIcon className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div className="mt-0 text-left">
                                <h3 className="text-xl font-bold leading-6 text-white" id="modal-title">
                                    AI Workout Analysis
                                </h3>
                                <p className="text-sm text-slate-400 mt-1">Here are some suggestions to optimize your session.</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-6">
                            <div>
                                <h4 className="flex items-center gap-2 text-lg font-semibold text-emerald-400">
                                    <CheckCircleIcon />
                                    Overall Feedback
                                </h4>
                                <p className="mt-2 text-slate-300 bg-slate-700/50 p-4 rounded-lg">
                                    {suggestions.overallFeedback}
                                </p>
                            </div>

                            <div>
                                <h4 className="flex items-center gap-2 text-lg font-semibold text-emerald-400">
                                    <LightBulbIcon />
                                    Exercise Tips
                                </h4>
                                <ul className="mt-2 space-y-3">
                                    {suggestions.exerciseSuggestions.map((item, index) => (
                                        <li key={index} className="bg-slate-700/50 p-4 rounded-lg">
                                            <p className="font-bold text-white">{item.exerciseName}</p>
                                            <p className="text-slate-300 mt-1">{item.suggestion}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                        {renderContent()}
                        <div className="bg-slate-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-slate-700">
                            <button type="button" className="inline-flex w-full justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 sm:ml-3 sm:w-auto" onClick={onClose}>
                                Got it, thanks!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiSuggestionModal;

