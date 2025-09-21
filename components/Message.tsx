import React from 'react';
import { type Message as MessageType, Sender } from '../types';
import { UserIcon, BotIcon, ErrorIcon, LinkIcon } from './icons/Icons';
import CodeBlock from './CodeBlock';

interface MessageProps {
  message: MessageType;
  isLoading?: boolean;
}

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5 py-1">
        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    </div>
);

const MessageContent: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null; // Don't render if text is empty
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <>
      {parts.filter(part => part).map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const codeContent = part.slice(3, -3);
          const langMatch = codeContent.match(/^[a-z]+\n/);
          const language = langMatch ? langMatch[0].trim() : '';
          const code = langMatch ? codeContent.substring(langMatch[0].length) : codeContent;
          return <CodeBlock key={index} language={language} code={code} />;
        }
        return (
          <p key={index} className="whitespace-pre-wrap">
            {part}
          </p>
        );
      })}
    </>
  );
};


const Message: React.FC<MessageProps> = ({ message, isLoading = false }) => {
  const isUser = message.sender === Sender.USER;
  const isError = message.isError;

  const getHelpfulLinks = (text: string) => {
    const links: { name: string; url: string }[] = [];
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('openai') && (lowerText.includes('quota') || lowerText.includes('billing'))) {
        links.push({ name: 'Check OpenAI Billing', url: 'https://platform.openai.com/account/billing/overview' });
    }
    if (lowerText.includes('deepseek') && (lowerText.includes('balance') || lowerText.includes('insufficient'))) {
        links.push({ name: 'Check DeepSeek Account', url: 'https://platform.deepseek.com/usage' });
    }
    if (lowerText.includes('api key')) {
         links.push({ name: 'Verify API Keys in Settings', url: '#' });
    }
    return links;
  };

  if (isError) {
    const links = getHelpfulLinks(message.text);
    return (
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
          <ErrorIcon />
        </div>
        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl rounded-lg px-4 py-3 bg-red-100/50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30">
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:text-red-700 dark:prose-p:text-red-300">
            <p className="font-bold">An Error Occurred</p>
            <p className="whitespace-pre-wrap">{message.text}</p>
             {links.length > 0 && (
              <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-500/30">
                <p className="text-xs font-semibold">Possible Actions:</p>
                <ul className="text-xs list-disc pl-4 mt-1">
                  {links.map(link => (
                    <li key={link.name}>
                      {link.url === '#' ? (
                         <span>{link.name} (Click the settings icon)</span>
                      ) : (
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline">
                          {link.name}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white">
          <BotIcon />
        </div>
      )}
      <div className={`max-w-xl md:max-w-2xl lg:max-w-3xl rounded-lg ${
          isUser
            ? 'bg-gradient-to-br from-sky-500 to-cyan-400 text-white rounded-br-none'
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-sm'
        } ${message.imageUrl ? 'p-1' : 'px-4 py-3'}`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {isLoading ? <LoadingIndicator /> : <MessageContent text={message.text} />}
        </div>
         {message.imageUrl && (
            <div className="mt-2">
                <img src={message.imageUrl} alt="Generated image" className="rounded-md w-full h-auto"/>
            </div>
        )}
        {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/80">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Sources:</h4>
                <div className="space-y-2">
                    {message.sources.map((source, index) => (
                        <a href={source.uri} key={index} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-400 hover:underline">
                            <LinkIcon className="w-4 h-4 flex-shrink-0"/>
                            <span className="truncate">{source.title}</span>
                        </a>
                    ))}
                </div>
            </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

export default Message;