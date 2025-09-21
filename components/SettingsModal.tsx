import React, { useState, useEffect } from 'react';
import { type AppSettings } from '../types';
import { CloseIcon } from './icons/Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
  currentSettings: AppSettings;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentSettings }) => {
  const [settings, setSettings] = useState<AppSettings>(currentSettings);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 relative text-slate-900 dark:text-slate-100" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
          <CloseIcon />
        </button>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 text-sm">
           <div>
            <label htmlFor="user_profile" className="block font-medium mb-1 text-slate-700 dark:text-slate-300">User Profile & Preferences</label>
            <textarea
              id="user_profile"
              value={settings.userProfile || ''}
              onChange={(e) => setSettings({ ...settings, userProfile: e.target.value })}
              className="w-full h-24 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="e.g., I am a senior software developer specializing in Python. Explain concepts at an expert level."
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This information will be used to personalize the AI's responses.</p>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>
          <h3 className="text-lg font-semibold">API Keys</h3>

          <div>
            <label htmlFor="openai_key" className="block font-medium mb-1 text-slate-700 dark:text-slate-300">OpenAI API Key</label>
            <input
              type="password"
              id="openai_key"
              value={settings.openai}
              onChange={(e) => setSettings({ ...settings, openai: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="sk-..."
            />
          </div>
           <div>
            <label htmlFor="openai_endpoint" className="block font-medium mb-1 text-slate-700 dark:text-slate-300">OpenAI API Endpoint (Optional)</label>
            <input
              type="text"
              id="openai_endpoint"
              value={settings.openaiEndpoint || ''}
              onChange={(e) => setSettings({ ...settings, openaiEndpoint: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="https://api.openai.com/v1"
            />
             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use a proxy to avoid browser CORS issues.</p>
          </div>
          <div>
            <label htmlFor="deepseek_key" className="block font-medium mb-1 text-slate-700 dark:text-slate-300">DeepSeek API Key</label>
            <input
              type="password"
              id="deepseek_key"
              value={settings.deepseek}
              onChange={(e) => setSettings({ ...settings, deepseek: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="sk-..."
            />
          </div>
           <div>
            <label htmlFor="deepseek_endpoint" className="block font-medium mb-1 text-slate-700 dark:text-slate-300">DeepSeek API Endpoint (Optional)</label>
            <input
              type="text"
              id="deepseek_endpoint"
              value={settings.deepseekEndpoint || ''}
              onChange={(e) => setSettings({ ...settings, deepseekEndpoint: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="https://api.deepseek.com"
            />
             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use a proxy to avoid browser CORS issues.</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-100/80 dark:bg-yellow-900/30 border border-yellow-300/80 dark:border-yellow-700/50 rounded-lg text-yellow-800 dark:text-yellow-300 text-xs">
          <strong>Security Warning:</strong> Your profile and keys are stored in your browser's local/session storage. They are not sent to any server besides the respective AI providers. Do not enter sensitive info on a shared or untrusted computer.
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;