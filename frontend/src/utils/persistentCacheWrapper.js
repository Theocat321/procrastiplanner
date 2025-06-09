/**
 * Creates a persistent caching wrapper around an asynchronous function using localStorage.
 *
 * @param {Function} fetchFn - The asynchronous function to wrap.
 * @param {Object} options - Optional configuration.
 * @param {number} options.ttl - Time-to-live for cache entries in milliseconds (default: 60000ms).
 * @param {string} options.storageKey - Key under which to store the cache in localStorage.
 * @returns {Function} A new function that wraps the original fetch function with persistent caching.
 */
export function createPersistentCacheWrapper(fetchFn, { ttl = 60000, storageKey = 'persistentCache' } = {}) {
    // Load the cache from localStorage if it exists, otherwise initialize an empty object.
    let cache = {};
    try {
        const storedCache = localStorage.getItem(storageKey);
    if (storedCache) {
        cache = JSON.parse(storedCache);
    }
    } catch (error) {
        console.error("Error reading persistent cache:", error);
    }
    
    // Helper function to save the cache back to localStorage
    const saveCache = () => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(cache));
    } catch (error) {
        console.error("Error saving persistent cache:", error);
    }
    };

    return async function (...args) {
        const cacheKey = JSON.stringify(args);
        const now = Date.now();

        if (cache[cacheKey]) {
            const { timestamp, value } = cache[cacheKey];
            if (now - timestamp < ttl) {
                return value;
            }
        }

        const result = await fetchFn(...args);

        // Save the new result in the cache and persist it
        cache[cacheKey] = { timestamp: now, value: result };
        saveCache();

        return result;
    };
}
    