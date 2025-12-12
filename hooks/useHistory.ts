/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState, useCallback } from 'react';

export function useHistory<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [index, setIndex] = useState(0);

  const state = history[index];

  const set = useCallback((newState: T, overwrite: boolean = false) => {
    setHistory(prev => {
      const current = prev[index];
      // Basic deep equality check to avoid redundant states could be added here
      if (JSON.stringify(current) === JSON.stringify(newState)) return prev;

      const sliced = prev.slice(0, index + 1);
      if (overwrite) {
          sliced[sliced.length - 1] = newState;
          return sliced;
      } else {
          return [...sliced, newState];
      }
    });
    if (!overwrite) {
        setIndex(prev => prev + 1);
    }
  }, [index]);

  const undo = useCallback(() => {
    setIndex(prev => Math.max(0, prev - 1));
  }, []);

  const redo = useCallback(() => {
    setIndex(prev => Math.min(history.length - 1, prev + 1));
  }, [history.length]);

  return {
    state,
    set,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1
  };
}