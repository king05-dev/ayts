// Clear AYTS cache script
// Run this in the browser console to clear all cached data

console.log('Clearing AYTS cache...');

// Clear localStorage
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('ayts-')) {
    console.log('Removing:', key);
    localStorage.removeItem(key);
  }
});

// Clear sessionStorage
Object.keys(sessionStorage).forEach(key => {
  if (key.startsWith('ayts-')) {
    console.log('Removing:', key);
    sessionStorage.removeItem(key);
  }
});

console.log('Cache cleared! Please refresh the page.');

// Optionally, you can also clear specific React Query cache
if (window.queryClient) {
  window.queryClient.clear();
  console.log('React Query cache cleared');
}
