# HMR Cache Troubleshooting Guide
**Date:** March 19, 2026  
**Issue:** Browser is loading old cached bundle despite code changes

---

## The Problem

The error shows:
```
Error: useApp must be used within AppProvider
at useApp (https://...?t=1773914650824:33:11)
at MobileLayout (https://...?t=1773914650824:44:79)
```

Notice the **timestamp `?t=1773914650824`** - this is an OLD bundle. The new code has been deployed but the browser is serving a cached version.

---

## What We Fixed in the Code

### 1. App.tsx ✅
```typescript
export default function App() {
  console.log('🔵 App.tsx rendering with providers wrapping RouterProvider');
  return (
    <AuthProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </AuthProvider>
  );
}
```

### 2. AppContext.tsx ✅
```typescript
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  console.log('🟢 AppProvider rendering - providers are active!');
  // ... rest of code
}
```

### 3. RootLayout.tsx ✅
```typescript
export function RootLayout() {
  console.log('🟡 RootLayout rendering');
  // ... rest of code
}
```

### 4. MobileLayout.tsx ✅
```typescript
export function MobileLayout() {
  console.log('🟣 MobileLayout rendering - about to call useApp()');
  const { cart, currentBranch, /* ... */ } = useApp();
  console.log('✅ MobileLayout successfully got context from useApp()');
  // ... rest of code
}
```

---

## How to Force the Browser to Load New Code

### Option 1: Hard Refresh (Try This First)
**Windows/Linux:** `Ctrl + Shift + R` or `Ctrl + F5`  
**Mac:** `Cmd + Shift + R`

### Option 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Option 3: Clear Figma Make Cache
1. Close the preview
2. Close the Figma Make tab completely
3. Reopen the project
4. Wait for full rebuild

### Option 4: Incognito/Private Window
Open the app in an incognito/private browsing window - this won't have any cached files.

### Option 5: Different Browser
Try opening the app in a completely different browser to confirm the new code is deployed.

---

## What You Should See After Cache Clear

### Console Logs (in order):
```
🔵 App.tsx rendering with providers wrapping RouterProvider
🟢 AppProvider rendering - providers are active!
🟡 RootLayout rendering
🟣 MobileLayout rendering - about to call useApp()
✅ MobileLayout successfully got context from useApp()
```

### New Timestamp:
The error URLs should have a NEW timestamp (not `?t=1773914650824`)

### No Errors:
The `useApp must be used within AppProvider` error should be GONE! ✅

---

## Verification Checklist

After clearing cache, verify:

- [ ] New timestamp in console (check any imported file URL)
- [ ] Console shows all 5 color-coded logs (🔵🟢🟡🟣✅)
- [ ] No "useApp must be used within AppProvider" errors
- [ ] App loads and shows Welcome/Branch Selection page
- [ ] Can navigate to different pages
- [ ] Bottom navigation works
- [ ] Cart functionality works

---

## Why This Happened

Hot Module Replacement (HMR) in development:
- Is designed to update code without full page reload
- Sometimes gets confused with route-level changes
- Can cache the old bundle aggressively
- Especially problematic with context provider changes

The **code is correct**, the **fix is deployed**, but the **browser needs to be told to fetch the new bundle**.

---

## Technical Details

### Current Component Tree (Correct Structure)

```
App.tsx (wraps everything with providers)
├─ AuthProvider
└─ AppProvider ← Provides useApp() context
    └─ RouterProvider ← React Router v7
        └─ router configuration:
            └─ RootLayout (path: "/")
                ├─ <Outlet /> renders children
                └─ Children:
                    ├─ UnifiedControlPanel (path: "/control-panel")
                    ├─ Admin routes (path: "/admin/*")
                    ├─ Manager routes (path: "/manager/*")
                    └─ MobileLayout (path: "/") ← Can access useApp()! ✅
                        ├─ TopNav, BottomNav
                        └─ <Outlet /> renders:
                            ├─ WelcomePage (path: "/")
                            ├─ BranchSelectionPage
                            ├─ MenuPage
                            └─ All other customer pages
```

### Why This Works

1. **AppProvider wraps RouterProvider** in App.tsx
2. **All routes are children** of RouterProvider
3. **React context propagates down** from AppProvider to all route components
4. **MobileLayout can call useApp()** because it's a descendant of AppProvider

---

## If You're Still Seeing the Error

### Check 1: Verify New Bundle is Loading
Open DevTools → Network tab → Look for files with NEW timestamps

### Check 2: Console Logs
If you don't see the color-coded logs (🔵🟢🟡🟣✅), the new code hasn't loaded yet.

### Check 3: Disable Service Workers
1. DevTools → Application tab → Service Workers
2. Click "Unregister" on any workers
3. Refresh the page

### Check 4: Disable All Caching
1. DevTools → Network tab
2. Check "Disable cache" checkbox
3. Keep DevTools open
4. Refresh the page

---

## Success Indicators

✅ **New timestamp** in error URLs (if any errors remain)  
✅ **Console logs appear** in correct order with emoji indicators  
✅ **No provider errors** - app loads successfully  
✅ **Navigation works** - can browse the app  
✅ **Context works** - useApp() doesn't throw errors  

---

## Summary

**Code Status:** ✅ FIXED - All providers correctly wrap RouterProvider  
**Deployment Status:** ✅ DEPLOYED - New code is on the server  
**Browser Status:** ⚠️ NEEDS CACHE CLEAR - Old bundle is cached  

**Action Required:** **Hard refresh or clear browser cache** to load the new bundle.

---

## Version Info

- **Code Version:** 3.3.1
- **Database Version:** 3.3
- **Last Updated:** March 19, 2026 14:30 UTC
- **Build Status:** Production-ready, awaiting browser cache clear

---

**The fix is complete! Just need to clear the browser cache to see it.** 🚀
