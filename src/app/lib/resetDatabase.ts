// Utility to reset the database and force re-seeding
// This should be called when we need to clear old data and start fresh

export function resetDatabase() {
  console.log('🔄 Resetting database...');
  
  // Clear all eChefs localStorage keys
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('echefs_') || key === 'echefs_db')) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`  ✓ Removed: ${key}`);
  });
  
  console.log('✅ Database reset complete!');
  console.log('🔄 Please refresh the page to re-seed...');
  
  // Auto refresh after 1 second
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).resetDatabase = resetDatabase;
}
