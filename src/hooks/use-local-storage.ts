
"use client";

import { useState, useEffect, useCallback } from 'react';

// Define a function that checks if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test_local_storage__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// A default storage object to use when localStorage is not available
const memoryStorage = new Map<string, string>();
const mockStorage = {
  getItem: (key: string) => memoryStorage.get(key) || null,
  setItem: (key: string, value: string) => memoryStorage.set(key, value),
  removeItem: (key: string) => memoryStorage.delete(key),
};


export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getStorage = useCallback(() => {
    return isClient && isLocalStorageAvailable() ? window.localStorage : mockStorage;
  }, [isClient]);

  const readValue = useCallback((): T => {
    const storage = getStorage();
    try {
      const item = storage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key, getStorage]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = (value: T | ((val: T) => T)) => {
    const storage = getStorage();
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };
  
  useEffect(() => {
      setStoredValue(readValue());
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);


  return [storedValue, setValue];
}
