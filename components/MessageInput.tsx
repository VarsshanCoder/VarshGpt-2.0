import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SendIcon, MicrophoneIcon, PaperclipIcon, FileIcon, CloseIcon } from './icons/Icons';
import { Mode, Model } from '../types';

interface MessageInputProps {
  onSendMessage: (message: string, files: File[]) => void;
  mode: Mode;
  model: Model;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, mode, model, disabled }) => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setText(prevText => prevText + finalTranscript);
      };

       recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, []);
  
  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };


  const handleSend = useCallback(() => {
    if (disabled || (!text.trim() && files.length === 0)) return;
    onSendMessage(text, files);
    setText('');
    setFiles([]);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
     if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [disabled, text, files, onSendMessage]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 192)}px`; // max-h-48
    }
  };
  
  useEffect(handleInput, [text]);

  const isFileAttachmentEnabled = model === Model.GEMINI && [Mode.DOCUMENT, Mode.CODING, Mode.APTITUDE].includes(mode);

  const getAttachmentTitle = () => {
    if (!isFileAttachmentEnabled) {
      if (model !== Model.GEMINI) return "File attachments are only available for the Gemini model.";
      return "File attachments are not supported in this mode.";
    }
    return "Attach files";
  };
  
  const getPlaceholder = () => {
    if (files.length > 0) return `Attached ${files.length} file(s). Add a message...`;
    if (isListening) return "Listening...";
    switch(mode) {
      case Mode.IMAGE: return "Describe an image to generate...";
      case Mode.SEARCH: return "Ask me anything to search the web...";
      case Mode.AGENT: return "Describe a complex task for the AI agent...";
      default: return "Ask me anything, or attach files...";
    }
  };


  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 shadow-lg">
      {files.length > 0 && (
        <div className="px-2 pt-1 pb-2 flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 mb-2">
            {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 rounded-full px-3 py-1 text-sm">
                    <FileIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="truncate max-w-xs">{file.name}</span>
                    <button onClick={() => removeFile(index)} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                        <CloseIcon className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          className={`p-2 text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors rounded-full disabled:opacity-50 ${isListening ? 'text-sky-500 dark:text-sky-400' : ''}`}
          disabled={disabled || !recognitionRef.current}
          title={recognitionRef.current ? "Voice input" : "Voice input not supported"}
          onClick={handleToggleListening}
        >
          <MicrophoneIcon className="w-6 h-6" />
        </button>
         <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors rounded-full disabled:opacity-50"
            disabled={disabled || !isFileAttachmentEnabled}
            title={getAttachmentTitle()}
          >
            <PaperclipIcon className="w-6 h-6" />
            <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".py,.js,.ts,.java,.cpp,.html,.css,.pdf,.docx,.txt,.md,.rtf,.odt,.csv,.xlsx,.json,.xml,.sql,.png,.jpg,.jpeg,.svg,.gif,.pptx,.odp"
                className="hidden"
            />
        </button>
        
        <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={getPlaceholder()}
            className="flex-1 bg-transparent resize-none outline-none placeholder-slate-400 dark:placeholder-slate-500 max-h-48 text-slate-800 dark:text-slate-100"
            rows={1}
            disabled={disabled}
        />
        <button
            onClick={handleSend}
            disabled={disabled || (!text.trim() && files.length === 0)}
            className="p-3 rounded-full bg-sky-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-sky-600"
        >
            <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;