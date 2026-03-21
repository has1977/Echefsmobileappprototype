# Loyalty & Promotions — Additions
## Routing Map & Screen Flow

### 📋 Component Naming Convention
All new screens use the prefix "LP —" in their file names for easy identification.

---

## 🗺️ Screen-to-Screen Navigation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ENTRY POINTS                                │
├─────────────────────────────────────────────────────────────────────┤
│ • Home / Menu / Profile → Branch List (Discover)                    │
│ • Navigation "Loyalty" Link → Branch List                           │
│ • Direct URL: /loyalty-additions/branches                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      PRIMARY NAVIGATION                             │
└─────────────────────────────────────────────────────────────────────┘

1️⃣  BRANCH LIST (Discover)
    Route: /loyalty-additions/branches
    Component: BranchListPage
    
    Navigation Options:
    ├─→ Tap Branch Card → Branch Loyalty Detail (/loyalty-additions/branch/:branchId)
    ├─→ "View Global Wallet" Button → Global Wallet (/loyalty-additions/global-wallet)
    └─→ Filter: All / Nearby / Favorites

    ↓ ↓ ↓

2️⃣  BRANCH LOYALTY DETAIL
    Route: /loyalty-additions/branch/:branchId
    Component: BranchLoyaltyDetailPage
    
    Features:
    • Full loyalty balance display
    • Points ledger (transaction history)
    • Accrual rules summary
    • Active promotions list
    
    Navigation Options:
    ├─→ "Check-in" Button → Check-in Flow (/loyalty-additions/check-in/:branchId)
    ├─→ "Redeem" Button → Redemption Flow (/loyalty-additions/redeem/:branchId)
    ├─→ Tap Promotion → Promotion Detail (/loyalty-additions/promotion/:promotionId)
    ├─→ "View All" → Notifications (/loyalty-additions/notifications)
    └─→ Back Button → Branch List

    ↓ ↓ ↓

3️⃣  PROMOTION DETAIL & CLAIM FLOW
    Route: /loyalty-additions/promotion/:promotionId
    Component: PromotionDetailPage
    
    Features:
    • Promotion card with details
    • Terms & conditions
    • Validity and remaining quantity
    • Claim button
    
    Flow:
    ├─→ "Claim Promotion" → Success Modal (in-page)
    │   Modal contains:
    │   • Success icon
    │   • Single-use code (copyable)
    │   • QR code placeholder
    │   • Expiration date
    │   • "Use Now" → Branch Loyalty Detail
    │   • "I'll Use Later" → Close modal
    └─→ Back Button → Previous page

    ↓ ↓ ↓

4️⃣  REDEMPTION FLOW (Multi-Step)
    Route: /loyalty-additions/redeem/:branchId
    Component: RedemptionFlowPage
    
    Step 1: SELECT REWARD
    • Display available rewards with points cost
    • Show user balance
    • Disable rewards with insufficient points
    ↓
    Step 2: CONFIRM REDEMPTION
    • Show selected reward
    • Points breakdown (cost, current, remaining)
    • "Confirm Redemption" button
    ↓
    Step 3: REDEMPTION SUCCESS
    • Success animation
    • QR code placeholder
    • Single-use redemption code (copyable)
    • Pickup instructions
    • "Back to Loyalty Program" → Branch Loyalty Detail
    • "Redeem Another" → Step 1
    
    Edge Case: INSUFFICIENT POINTS
    • Error icon
    • Points needed calculation
    • "Earn More Points" → Check-in Flow
    • "Choose Another Reward" → Step 1

    ↓ ↓ ↓

5️⃣  CHECK-IN / EARN FLOW
    Route: /loyalty-additions/check-in/:branchId
    Component: CheckInPage
    
    Step 1: SELECT METHOD
    • "Scan QR Code" option (recommended)
    • "Enter Code" option
    ↓
    Step 2a: QR SCANNER
    • Camera viewfinder with scanning animation
    • Corner markers
    • "Simulate Scan" demo button
    ↓
    Step 2b: MANUAL CODE ENTRY
    • 6-digit code input field
    • Number pad interface
    • "Submit Code" button
    ↓
    Step 3: CHECK-IN SUCCESS
    • Success animation
    • Points earned display (+30 pts)
    • Next check-in timer
    • "View Loyalty Balance" → Branch Loyalty Detail
    • "Browse Menu" → Menu page

    ↓ ↓ ↓

6️⃣  GLOBAL WALLET (Aggregate)
    Route: /loyalty-additions/global-wallet
    Component: GlobalWalletPage
    
    Features:
    • Total points summary across all branches
    • Enrolled branches count
    • List of branches with expandable rows:
      - Branch name, logo, distance
      - Points balance
      - Recent activity
      - "View Details" → Branch Loyalty Detail
      - "Redeem" → Redemption Flow
    • Filters: All / Nearby / Favorites
    
    Navigation Options:
    ├─→ Tap Branch Row → Expand/collapse
    ├─→ "View Details" → Branch Loyalty Detail
    ├─→ "Redeem" → Redemption Flow
    └─→ Back Button → Branch List

    ↓ ↓ ↓

7️⃣  NOTIFICATIONS / OFFERS INBOX
    Route: /loyalty-additions/notifications
    Component: NotificationsPage
    
    Features:
    • List of active/pending promotions and offers
    • Unread indicator
    • Filter by: All / [Branch Names]
    • Notification types:
      - Promotions
      - Points earned
      - Rewards available
    
    Navigation Options:
    ├─→ Tap Notification → Deep link to:
    │   • Promotion type → Promotion Detail
    │   • Points/Reward type → Branch Loyalty Detail
    ├─→ "Mark All as Read" Button
    └─→ Back Button → Previous page

    ↓ ↓ ↓

8️⃣  EMPTY & EDGE STATES
    Route: /loyalty-additions/empty-states
    Component: EmptyStatesPage
    
    Contains examples of:
    • Empty Wallet State
      - No enrolled branches
      - "Discover Branches" CTA
    
    • No Promotions State
      - No active promotions
      - "Get Notified" CTA
    
    • Offline Pending Redemption
      - Offline indicator
      - Pending redemption details
      - "Retry Connection" button
    
    • Insufficient Points State
      - Points breakdown
      - Points needed calculation
      - "Check-in to Earn Points" CTA
      - "Browse Menu" CTA

```

---

## 🔄 Transition Animations

| Transition Type | Animation | Duration |
|----------------|-----------|----------|
| Forward (screen → screen) | Slide Left | 300ms |
| Back (screen → previous) | Slide Right | 300ms |
| Modal Open | Bottom Sheet Up | 250ms |
| Modal Close | Bottom Sheet Down | 250ms |
| Success States | Scale + Fade | 400ms |
| List Items | Stagger Fade Up | 50ms offset |

---

## 🎨 Component Reuse

### Existing Components Used:
- ✅ `GlassCard` (variant: elevated, default)
- ✅ `GradientButton` (sizes: sm, lg, xl)
- ✅ `Logo` (sizes: sm, md, lg, xl)
- ✅ `motion` from design-system
- ✅ `AnimatePresence` for transitions

### New Components Created:
None - all screens use existing design system components

---

## 📱 Mobile-First Design

All screens are designed for mobile viewport:
- Max width: 428px (iPhone 14 Pro Max)
- Safe area margins: 24px (6 in Tailwind)
- Bottom navigation clearance: 80px (pb-20)
- Sticky headers with backdrop blur
- Touch-friendly tap targets (min 44px)

---

## 🔑 Key Features

### Single-Use Codes & QR
All redemption/claim screens include:
- QR code placeholder (visual representation)
- Copyable alphanumeric code
- Expiration date/time
- Copy-to-clipboard functionality with success feedback

### Real-Time Updates
- Unread notification count
- Points balance updates
- Promotion quantity remaining
- Status indicators (active/expiring/closed)

### Filtering & Organization
- Branch filters: All / Nearby / Favorites
- Notification filters: All / By Branch
- Distance-based sorting
- Favorite toggles

---

## 🎯 Acceptance Criteria

✅ All screens match existing eChefs design system  
✅ Brand colors #667c67 and #e4dbc4 used consistently  
✅ Glass morphism and spring animations implemented  
✅ All routing works with React Router  
✅ Navigation flows match specification  
✅ Single-use codes have copy functionality  
✅ QR placeholders included where specified  
✅ Empty states handle edge cases  
✅ Mobile-responsive with safe areas  
✅ No modifications to existing pages/components  

---

## 🚀 Quick Start

To access the new screens:

1. Navigate to `/loyalty-additions/branches` to see the Branch List
2. Or add a link from existing pages to the entry point
3. All internal navigation is handled automatically

Example integration:
```tsx
import { useNavigate } from 'react-router';

// In any component
const navigate = useNavigate();

// Link to loyalty additions
<button onClick={() => navigate('/loyalty-additions/branches')}>
  Explore Loyalty Programs
</button>
```

---

## 📊 Screen Inventory

| # | Screen Name | Route | Status |
|---|------------|-------|--------|
| 1 | Branch List (Discover) | `/loyalty-additions/branches` | ✅ Ready |
| 2 | Branch Loyalty Detail | `/loyalty-additions/branch/:branchId` | ✅ Ready |
| 3 | Global Wallet | `/loyalty-additions/global-wallet` | ✅ Ready |
| 4 | Promotion Detail | `/loyalty-additions/promotion/:promotionId` | ✅ Ready |
| 5 | Redemption Flow | `/loyalty-additions/redeem/:branchId` | ✅ Ready |
| 6 | Check-in / Earn Flow | `/loyalty-additions/check-in/:branchId` | ✅ Ready |
| 7 | Notifications Inbox | `/loyalty-additions/notifications` | ✅ Ready |
| 8 | Empty States Demo | `/loyalty-additions/empty-states` | ✅ Ready |

---

**Last Updated:** March 17, 2026  
**Developer Handoff:** Ready for implementation  
**Design System:** eChefs Professional Design System v2.0
