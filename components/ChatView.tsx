import React, { useRef, useEffect } from 'react';
import { type Chat, Mode, Sender, Model } from '../types';
import Message from './Message';
import MessageInput from './MessageInput';
import WelcomeScreen from './WelcomeScreen';
import ModeSelector from './ModeSelector';
import ModelSelector from './ModelSelector';

interface ChatViewProps {
  chat: Chat | null;
  onSendMessage: (message: string, files: File[]) => void;
  onModeChange: (mode: Mode) => void;
  onModelChange: (model: Model) => void;
  isLoading: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({ chat, onSendMessage, onModeChange, onModelChange, isLoading }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [chat?.messages, isLoading]);

    if (!chat) {
        return (
          <div className="flex flex-col h-full w-full">
            <WelcomeScreen />
            <footer className="w-full p-4 md:p-6 mx-auto max-w-4xl">
               <MessageInput onSendMessage={onSendMessage} mode={Mode.APTITUDE} model={Model.GEMINI} disabled={isLoading}/>
            </footer>
          </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-transparent">
            {chat.messages.length > 0 && (
              <header className="flex-shrink-0 p-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-4xl mx-auto">
                      <ModeSelector currentMode={chat.mode} onModeChange={onModeChange} />
                      <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                      <ModelSelector currentModel={chat.model} onModelChange={onModelChange} />
                  </div>
              </header>
            )}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {chat.messages.length === 0 && <WelcomeScreen />}
                {chat.messages.map((msg) => (
                    <Message key={msg.id} message={msg} />
                ))}
                {isLoading && <Message message={{id: 'loading', text: 'Thinking...', sender: Sender.BOT, timestamp: Date.now()}} isLoading={true} />}
                 <div ref={messagesEndRef} />
            </div>
            <footer className="w-full p-4 md:p-6 mx-auto max-w-4xl">
                <MessageInput onSendMessage={onSendMessage} mode={chat.mode} model={chat.model} disabled={isLoading}/>
            </footer>
        </div>
    );
};

export default ChatView;