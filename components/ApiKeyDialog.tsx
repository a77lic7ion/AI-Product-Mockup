/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { KeyRound, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from './Button';

interface ApiKeyDialogProps {
  onSave: (key: string) => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ onSave }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim().length < 10) {
      setError('Please enter a valid API Key');
      return;
    }
    onSave(inputKey.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200] p-4 animate-fade-in backdrop-blur-sm">
      <div className="glass-panel bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl max-w-lg w-full p-8 flex flex-col items-center">
        <div className="bg-zinc-900 p-4 rounded-full mb-6 border border-zinc-800">
          <KeyRound className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">AI Product-Mockup</h2>
        <p className="text-zinc-400 mb-8 text-center text-sm leading-relaxed">
          To start generating AI mockups, please enter your Gemini API key.
          <br />
          Your key is stored locally in your browser.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider font-mono">Gemini API Key</label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                setError('');
              }}
              placeholder="AIzaSy..."
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-white outline-none transition-all placeholder:text-zinc-800 font-mono text-sm"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full py-3 text-base"
            icon={<ArrowRight size={18} />}
          >
            Start Creating
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-900 w-full text-center">
          <p className="text-xs text-zinc-500 mb-2">Don't have a key?</p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-white hover:text-zinc-300 text-sm font-medium hover:underline"
          >
            Get a free key from Google AI Studio <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyDialog;