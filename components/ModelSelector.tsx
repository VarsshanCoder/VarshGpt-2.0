
import React from 'react';
import { Model } from '../types';
import { GeminiIcon, OpenAIIcon, DeepSeekIcon } from './icons/Icons';

interface ModelSelectorProps {
  currentModel: Model;
  onModelChange: (model: Model) => void;
}

const models = [
  { id: Model.GEMINI, label: 'Gemini', icon: <GeminiIcon className="w-5 h-5"/> },
  { id: Model.OPENAI, label: 'OpenAI', icon: <OpenAIIcon className="w-5 h-5"/> },
  { id: Model.DEEPSEEK, label: 'DeepSeek', icon: <DeepSeekIcon className="w-5 h-5"/> },
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ currentModel, onModelChange }) => {
  return (
    <div className="flex items-center justify-center p-1 bg-slate-200/70 dark:bg-slate-800/70 rounded-lg w-fit mx-auto">
      {models.map(model => (
        <button
          key={model.id}
          onClick={() => onModelChange(model.id)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            currentModel === model.id
              ? 'bg-sky-500 text-white'
              : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
          }`}
        >
          {model.icon}
          <span className="hidden md:inline">{model.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ModelSelector;