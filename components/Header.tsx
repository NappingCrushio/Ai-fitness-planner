
import React from 'react';
import { DumbbellIcon } from './icons/DumbbellIcon';

const Header: React.FC = () => {
    return (
        <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <DumbbellIcon />
                        <span className="text-xl font-bold tracking-tight text-white">
                            AI Fitness Planner
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
