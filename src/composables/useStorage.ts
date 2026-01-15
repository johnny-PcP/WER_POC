import type { TextLine, StoredState } from '@/types'

const STORAGE_KEY = 'wer-marking-state'

export function useStorage() {
  function save(lines: TextLine[], inputText: string) {
    const state: StoredState = {
      lines,
      inputText,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      console.warn('Failed to save to localStorage')
    }
  }

  function load(): StoredState | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as StoredState
      }
    } catch {
      console.warn('Failed to load from localStorage')
    }
    return null
  }

  function clear() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      console.warn('Failed to clear localStorage')
    }
  }

  function hasSavedState(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null
  }

  return {
    save,
    load,
    clear,
    hasSavedState,
  }
}
