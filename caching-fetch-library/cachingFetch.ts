// You may edit this file, add new files to support this file,
// and/or add new dependencies to the project as you see fit.
// However, you must not change the surface API presented from this file,
// and you should not need to change any other files in the project to complete the challenge

import React, { useEffect, useState } from "react";

type UseCachingFetch = (url: string) => {
  isLoading: boolean;
  data: unknown;
  error: Error | null;
};

type CacheEntry = {
  data: unknown;
  error: Error | null;
};

// Cache uses the URL as the key here.
const cache: { [key: string]: CacheEntry } = {};

/**
 * 1. Implement a caching fetch hook. The hook should return an object with the following properties:
 * - isLoading: a boolean that is true when the fetch is in progress and false otherwise
 * - data: the data returned from the fetch, or null if the fetch has not completed
 * - error: an error object if the fetch fails, or null if the fetch is successful
 *
 * This hook is called three times on the client:
 *  - 1 in App.tsx
 *  - 2 in Person.tsx
 *  - 3 in Name.tsx
 *
 * Acceptance Criteria:
 * 1. The application at /appWithoutSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should only see 1 network request in the browser's network tab when visiting the /appWithoutSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const useCachingFetch: UseCachingFetch = (url: string) => {
  const cached = cache[url];

  const [isLoading, setIsLoading] = useState<boolean>(!cached);
  const [data, setData] = useState<unknown | null>(cached ? cached.data : null);
  const [error, setError] = useState<Error | null>(cached ? cached.error : null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const fetchedData = await response.json();
      setData(fetchedData);
      cache[url] = { data: fetchedData, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Unknown error');
      setError(errorMessage);
      cache[url] = { data: null, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!cached) {
      fetchData();
    } else {
      setData(cached.data);
      setError(cached.error);
      setIsLoading(false);
    }
  }, [url]);

  return {
    isLoading,
    data,
    error,
  };
};

/**
 * 2. Implement a preloading caching fetch function. The function should fetch the data.
 *
 * This function will be called once on the server before any rendering occurs.
 *
 * Any subsequent call to useCachingFetch should result in the returned data being available immediately.
 * Meaning that the page should be completely serverside rendered on /appWithSSRData
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript disabled, you should see a list of people.
 * 2. You have not changed any code outside of this file to achieve this.
 * 3. This file passes a type-check.
 *
 */
export const preloadCachingFetch = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  
  cache[url] = { data, error: null };
};

/**
 * 3.1 Implement a serializeCache function that serializes the cache to a string.
 * 3.2 Implement an initializeCache function that initializes the cache from a serialized cache string.
 *
 * Together, these two functions will help the framework transfer your cache to the browser.
 *
 * The framework will call `serializeCache` on the server to serialize the cache to a string and inject it into the dom.
 * The framework will then call `initializeCache` on the browser with the serialized cache string to initialize the cache.
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should not see any network calls to the people API when visiting the /appWithSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const serializeCache = (): string => {
  return JSON.stringify(cache);
};

export const initializeCache = (serializedCache: string): void => {
  if (serializedCache) {
    const parsedCache = JSON.parse(serializedCache);
    Object.assign(cache, parsedCache);
  }
};

export const wipeCache = (): void => {
  for (const key in cache) {
    delete cache[key];
  }
};
