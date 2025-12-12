/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {useCallback, useEffect, useState} from 'react';

export const useApiKey = () => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  // Initialize from storage or env
  useEffect(() => {
    const stored = localStorage.getItem('gemini_api_key');
    if (stored) {
      setApiKeyState(stored);
    } else if (process.env.API_KEY) {
      // If env var exists, we can use it, but we might still want to allow overriding
      // For now, if no stored key, we assume env key is the fallback
      setApiKeyState('');
    } else {
      // No key anywhere, show dialog
      setShowApiKeyDialog(true);
    }
  }, []);

  const setApiKey = useCallback((key: string) => {
    if (key) {
      localStorage.setItem('gemini_api_key', key);
      setApiKeyState(key);
      setShowApiKeyDialog(false);
    }
  }, []);

  const removeApiKey = useCallback(() => {
    localStorage.removeItem('gemini_api_key');
    setApiKeyState('');
  }, []);

  const hasKey = !!(apiKey || process.env.API_KEY);

  return {
    apiKey: apiKey || process.env.API_KEY || '', // Return effective key
    hasKey,
    showApiKeyDialog,
    setShowApiKeyDialog,
    setApiKey,
    removeApiKey
  };
};