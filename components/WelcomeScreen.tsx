import React from 'react';

interface WelcomeScreenProps {
  // No props needed for now
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 flex-1">
      <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-cyan-400">
        VarshGpt
      </h1>
      <h2 className="text-2xl md:text-3xl font-medium text-slate-800 dark:text-slate-200 mb-8">
        Hello, I'm Varsh 2.0. How can I help you today?
      </h2>
      <p className="text-md text-slate-500 dark:text-slate-400">
        Ready to assist—from quick answers to generating images. Let's get started.
      </p>
    </div>
  );
};

export default WelcomeScreen;