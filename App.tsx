import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import { type Theme, type Chat, Mode, Sender, type Message, Model, type AppSettings } from './types';
import { generateResponse } from './services/aiService';
import { MenuIcon, CloseIcon, SidebarToggleIcon } from './components/icons/Icons';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem('varshgpt-theme');
      return (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : 'dark';
    } catch {
      return 'dark';
    }
  });
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [appSettings, setAppSettings] = useState<AppSettings>({ openai: '', deepseek: '', openaiEndpoint: '', deepseekEndpoint: '', userProfile: '' });
  const [isTtsEnabled, setIsTtsEnabled] = useState<boolean>(() => localStorage.getItem('varshgpt-tts-enabled') === 'true');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load system voices for TTS
  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Initial load
  }, []);

  // Load settings from storage
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('varshgpt-settings');
      if (storedSettings) {
        setAppSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Could not load app settings from local storage", error);
    }
  }, []);

  // Load chats from local storage (memory)
  useEffect(() => {
    try {
      const storedChats = localStorage.getItem('varshgpt-chats');
      if (storedChats) {
        const parsedChats = JSON.parse(storedChats);
        if (Array.isArray(parsedChats) && parsedChats.length > 0) {
           setChats(parsedChats);
           // Try to keep the last selected chat active
           const lastChatId = localStorage.getItem('varshgpt-last-chat-id');
           if (lastChatId && parsedChats.some(c => c.id === lastChatId)) {
             setCurrentChatId(lastChatId);
           } else {
             setCurrentChatId(parsedChats[0].id);
           }
        }
      }
    } catch (error) {
      console.error("Could not load chats from local storage", error);
      localStorage.removeItem('varshgpt-chats');
    }
  }, []);

  // Save chats and last active chat to local storage
  useEffect(() => {
    try {
      if (chats.length > 0) {
        localStorage.setItem('varshgpt-chats', JSON.stringify(chats));
        if (currentChatId) {
          localStorage.setItem('varshgpt-last-chat-id', currentChatId);
        }
      } else {
        localStorage.removeItem('varshgpt-chats');
        localStorage.removeItem('varshgpt-last-chat-id');
      }
    } catch (error) {
      console.error("Could not save chats to local storage", error);
    }
  }, [chats, currentChatId]);


  useEffect(() => {
    const root = window.document.documentElement;
    const lightThemeLink = document.getElementById('hljs-light-theme') as HTMLLinkElement | null;
    const darkThemeLink = document.getElementById('hljs-dark-theme') as HTMLLinkElement | null;
    
    // Manage theme class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Manage syntax highlighting theme
    if (lightThemeLink) lightThemeLink.disabled = theme === 'dark';
    if (darkThemeLink) darkThemeLink.disabled = theme === 'light';
    
    // Save theme preference
    try {
      localStorage.setItem('varshgpt-theme', theme);
    } catch (error) {
      console.error("Could not save theme to local storage", error);
    }
  }, [theme]);
  
  const handleToggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const handleToggleTts = useCallback(() => {
    const newState = !isTtsEnabled;
    setIsTtsEnabled(newState);
    localStorage.setItem('varshgpt-tts-enabled', String(newState));
    if (!newState) {
      window.speechSynthesis.cancel();
    }
  }, [isTtsEnabled]);

  const handleNewChat = useCallback(() => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      mode: Mode.APTITUDE,
      model: Model.GEMINI, // Default model
      createdAt: Date.now(),
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setSidebarOpen(false);
  }, []);
  
  const handleSelectChat = useCallback((id: string) => {
    setCurrentChatId(id);
    setSidebarOpen(false);
  }, []);

  const handleDeleteChat = useCallback((id: string) => {
    setChats(prev => prev.filter(chat => chat.id !== id));
    if (currentChatId === id) {
        const remainingChats = chats.filter(c => c.id !== id);
        setCurrentChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
    }
  }, [currentChatId, chats]);

  const handleClearAllChats = useCallback(() => {
    if (window.confirm("Are you sure you want to delete all chat history? This action cannot be undone.")) {
      setChats([]);
      setCurrentChatId(null);
    }
  }, []);
  
  const speakResponse = (text: string) => {
    if (!text || voices.length === 0) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Find a male voice with fallbacks
    let maleVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male'));
    if (!maleVoice) {
        maleVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('David') || v.name.includes('Google US English')));
    }
    if (!maleVoice) {
        maleVoice = voices.find(v => v.lang.startsWith('en-US')); // Fallback to any US English voice
    }

    utterance.voice = maleVoice || voices[0]; // Final fallback
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };


  const handleSendMessage = async (messageText: string, files: File[]) => {
    if (isLoading) return;
    window.speechSynthesis.cancel(); // Stop any previous speech

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: messageText,
      sender: Sender.USER,
      timestamp: Date.now(),
    };

    let chatToUpdateId = currentChatId;
    let historyForAPI: Message[];
    let modeForAPI: Mode;
    let modelForAPI: Model;

    const generateTitle = (text: string) => text.substring(0, 30) + (text.length > 30 ? '...' : '');

    // Case 1: No active chat, create a new one.
    if (!chatToUpdateId) {
      const newChatId = `chat-${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        title: generateTitle(messageText || `Analysis of ${files.length} file(s)`),
        messages: [userMessage],
        mode: Mode.DOCUMENT, // Default to document mode if starting with a file
        model: Model.GEMINI,
        createdAt: Date.now(),
      };
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChatId);
      chatToUpdateId = newChatId;
      historyForAPI = [userMessage];
      modeForAPI = newChat.mode;
      modelForAPI = newChat.model;
    } else {
      // Case 2: Update an existing chat.
      const existingChat = chats.find(c => c.id === chatToUpdateId);
      if (!existingChat) {
          console.error("Could not find chat to update");
          return;
      }
      historyForAPI = [...existingChat.messages, userMessage];
      modeForAPI = existingChat.mode;
      modelForAPI = existingChat.model;

      setChats(prevChats =>
        prevChats.map(chat => {
          if (chat.id === chatToUpdateId) {
            const isFirstMessage = chat.messages.length === 0;
            return {
              ...chat,
              title: isFirstMessage ? generateTitle(messageText || `Analysis of ${files.length} file(s)`) : chat.title,
              messages: [...chat.messages, userMessage],
            };
          }
          return chat;
        })
      );
    }

    setIsLoading(true);

    try {
      const botResponse = await generateResponse(modelForAPI, modeForAPI, historyForAPI, files, appSettings);
      
      const botMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        text: botResponse.text,
        sender: Sender.BOT,
        timestamp: Date.now(),
        imageUrl: botResponse.imageUrl,
        sources: botResponse.sources,
      };
      
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === chatToUpdateId
            ? { ...chat, messages: [...chat.messages, botMessage] }
            : chat
        )
      );

      if (isTtsEnabled) {
        speakResponse(botResponse.text);
      }

    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessageText = error instanceof Error ? error.message : "An unknown error occurred while generating the response.";
      const errorMessage: Message = {
        id: `msg-error-${Date.now()}`,
        text: errorMessageText,
        sender: Sender.BOT,
        timestamp: Date.now(),
        isError: true,
      };
       setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === chatToUpdateId
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleModeChange = (mode: Mode) => {
    if (!currentChatId) return;
    setChats(prevChats => prevChats.map(chat => 
      chat.id === currentChatId ? { ...chat, mode } : chat
    ));
  };

  const handleModelChange = (model: Model) => {
    if (!currentChatId) return;
    setChats(prevChats => prevChats.map(chat => 
      chat.id === currentChatId ? { ...chat, model } : chat
    ));
  };

  const handleSaveSettings = (settings: AppSettings) => {
    setAppSettings(settings);
    try {
      localStorage.setItem('varshgpt-settings', JSON.stringify(settings));
    } catch (error) {
      console.error("Could not save app settings to local storage", error);
    }
  };
  
  const currentChat = chats.find(c => c.id === currentChatId) || null;

  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-transparent overflow-hidden">
      {isSidebarCollapsed && (
        <button
          onClick={() => setIsSidebarCollapsed(false)}
          className="hidden md:block fixed top-4 left-4 z-50 p-2 rounded-full bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          aria-label="Show sidebar"
        >
          <SidebarToggleIcon className="w-5 h-5 rotate-180" />
        </button>
      )}
      <Sidebar 
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onClearAllChats={handleClearAllChats}
        onToggleTheme={handleToggleTheme}
        theme={theme}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        onOpenSettings={() => setSettingsOpen(true)}
        isTtsEnabled={isTtsEnabled}
        onToggleTts={handleToggleTts}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(p => !p)}
      />
      <main className={`flex-1 flex flex-col h-full relative transition-[margin] duration-300 ease-in-out ${isSidebarCollapsed ? 'md:ml-0' : 'md:ml-64'}`}>
         <div className="absolute top-2 left-2 z-20 md:hidden">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md bg-white/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
        </div>
        <ChatView 
          key={currentChatId}
          chat={currentChat}
          onSendMessage={handleSendMessage}
          onModeChange={handleModeChange}
          onModelChange={handleModelChange}
          isLoading={isLoading}
        />
      </main>
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveSettings}
        currentSettings={appSettings}
      />
    </div>
  );
};

export default App;