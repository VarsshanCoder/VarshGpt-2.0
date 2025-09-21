import React, { useState, useEffect, useRef } from 'react';
import { CopyIcon, CheckIcon } from './icons/Icons';

declare var hljs: any;

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current && typeof hljs !== 'undefined') {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = () => {
    if (copied) return;
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2 bg-slate-50 dark:bg-slate-900/70 rounded-md overflow-hidden relative border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center px-4 py-1 bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors disabled:opacity-50"
          disabled={copied}
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code ref={codeRef} className={`language-${language}`}>
          {code.trim()}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;