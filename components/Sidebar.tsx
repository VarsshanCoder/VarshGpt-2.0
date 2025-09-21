import React from 'react';
import { type Chat, type Theme } from '../types';
import { PlusIcon, SunIcon, MoonIcon, TrashIcon, SettingsIcon, ClearHistoryIcon, SpeakerOnIcon, SpeakerOffIcon, SidebarToggleIcon } from './icons/Icons';

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onClearAllChats: () => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  theme: Theme;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isTtsEnabled: boolean;
  onToggleTts: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onClearAllChats,
  onToggleTheme,
  onOpenSettings,
  theme,
  isOpen,
  setIsOpen,
  isTtsEnabled,
  onToggleTts,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <aside className={`fixed inset-y-0 left-0 flex flex-col h-full w-64 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm border-r border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 p-4 transition-transform transform z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full' // Mobile
        } ${isCollapsed ? 'md:-translate-x-full' : 'md:translate-x-0'}` // Desktop
        }>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-cyan-400">
            VarshGpt 2.0
          </h1>
          <button onClick={onToggleCollapse} className="hidden md:block p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
             <SidebarToggleIcon className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-4 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors"
        >
          <PlusIcon />
          New Chat
        </button>

        <div className="flex-1 overflow-y-auto pr-1 -mr-2 space-y-2">
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`group flex items-center justify-between w-full p-3 rounded-lg cursor-pointer transition-colors ${
                currentChatId === chat.id
                  ? 'bg-slate-100 dark:bg-slate-800/60'
                  : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <p className={`truncate text-sm ${
                currentChatId === chat.id
                  ? 'font-semibold text-sky-500 dark:text-sky-400'
                  : 'font-medium text-slate-700 dark:text-slate-300'
              }`}>{chat.title === 'New Conversation' ? `Chat from ${new Date(chat.createdAt).toLocaleDateString()}` : chat.title}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-slate-600 dark:text-slate-400">
           <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <SettingsIcon />
            <span>API Keys</span>
          </button>
          <button
            onClick={onToggleTts}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            {isTtsEnabled ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
            <span>Voice Output</span>
          </button>
           <button
            onClick={onClearAllChats}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
          >
            <ClearHistoryIcon />
            <span>Clear History</span>
          </button>
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
