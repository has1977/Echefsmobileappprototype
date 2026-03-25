/**
 * Cache Manager Utility
 * Handles cache clearing and version management
 * Build: 3.3.5
 */

const CACHE_VERSION_KEY = 'echefs_cache_version';
const CURRENT_VERSION = '3.3.5';

/**
 * Clear all browser caches
 */
export async function clearAllCaches(): Promise<void> {
  try {
    // Clear Service Worker caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('✅ Service Worker caches cleared');
    }

    // Clear localStorage cache version
    localStorage.removeItem(CACHE_VERSION_KEY);
    
    console.log('✅ All caches cleared');
  } catch (error) {
    console.error('❌ Error clearing caches:', error);
  }
}

/**
 * Check if cache needs to be cleared based on version
 */
export function checkCacheVersion(): boolean {
  const storedVersion = localStorage.getItem(CACHE_VERSION_KEY);
  
  if (storedVersion !== CURRENT_VERSION) {
    console.log(`🔄 Cache version mismatch: ${storedVersion} → ${CURRENT_VERSION}`);
    localStorage.setItem(CACHE_VERSION_KEY, CURRENT_VERSION);
    return true; // Cache needs clearing
  }
  
  return false; // Cache is up to date
}

/**
 * Initialize cache management
 * Call this on app startup
 */
export async function initializeCacheManagement(): Promise<void> {
  const needsCacheClearing = checkCacheVersion();
  
  if (needsCacheClearing) {
    console.log('🧹 Clearing outdated caches...');
    await clearAllCaches();
    console.log('✅ Cache management initialized with version:', CURRENT_VERSION);
  } else {
    console.log('✅ Cache is up to date:', CURRENT_VERSION);
  }
}

/**
 * Force reload with cache bypass
 */
export function forceReload(): void {
  // Add timestamp to bypass cache
  const url = new URL(window.location.href);
  url.searchParams.set('v', CURRENT_VERSION);
  url.searchParams.set('t', Date.now().toString());
  window.location.href = url.toString();
}
