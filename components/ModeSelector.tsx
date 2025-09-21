import React from 'react';
import { Mode } from '../types';
import { AptitudeIcon, CodeIcon, DocumentIcon, ImageIcon, SearchIcon, AgentIcon } from './icons/Icons';

interface ModeSelectorProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
}

const modes = [
  { id: Mode.APTITUDE, label: 'Aptitude', icon: <AptitudeIcon className="w-5 h-5"/> },
  { id: Mode.CODING, label: 'Coding', icon: <CodeIcon className="w-5 h-5"/> },
  { id: Mode.DOCUMENT, label: 'Document', icon: <DocumentIcon className="w-5 h-5"/> },
  { id: Mode.IMAGE, label: 'Image', icon: <ImageIcon className="w-5 h-5"/> },
  { id: Mode.SEARCH, label: 'Search', icon: <SearchIcon className="w-5 h-5"/> },
  { id: Mode.AGENT, label: 'Agent', icon: <AgentIcon className="w-5 h-5"/> },
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="flex items-center justify-center p-1 bg-slate-200/70 dark:bg-slate-800/70 rounded-lg w-fit mx-auto flex-wrap">
      {modes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
            currentMode === mode.id
              ? 'bg-sky-500 text-white'
              : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
          }`}
        >
          {mode.icon}
          <span className="hidden md:inline">{mode.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;