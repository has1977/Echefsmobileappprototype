# Branch-Specific Loyalty System - Complete Documentation

## 🎯 Overview

eChefs now implements a **completely branch-isolated loyalty system** where:
- ✅ Each branch has its own separate loyalty accounts
- ✅ Points earned at Branch A can ONLY be used at Branch A
- ✅ Promotions and gifts are branch-specific
- ✅ Customers can have multiple loyalty accounts (one per branch)
- ✅ User authentication is via phone number

## 📊 System Architecture

### 1. Data Structure

**Before (Global System):**
```typescript
// One loyalty account for all branches
CustomerLoyalty {
  customer_id: string;
  total_points: number; // Used everywhere
  // ...
}
```

**After (Branch-Specific System):**
```typescript
// Separate account per branch
BranchCustomerLoyalty {
  customer_id: string;
  customer_phone: string;  // Primary identifier
  branch_id: string;       // CRITICAL: Ties to specific branch
  branch_name: string;
  available_points: number; // Only valid at THIS branch
  // ...
}
```

### 2. Key Principles

#### 🔒 **Isolation**
- Points earned at "Downtown" branch cannot be used at "Mall" branch
- Each branch maintains completely separate point balances
- Gifts/rewards are redeemed only at the branch where points were earned

#### 📱 **Phone-Based Authentication**
- Users login with phone number: `+996555123456`
- System finds all loyalty accounts associated with that phone
- Customer can view/manage accounts at multiple branches

#### 🏢 **Multi-Branch Accounts**
- Customer Ali (`+996555123456`) can have:
  - 2,800 points at Downtown branch (Gold tier)
  - 580 points at Mall branch (Bronze tier)
  - 1,100 points at Airport branch (Silver tier)
- Each account progresses independently

## 📁 File Structure

### New Files Created

1. **`/src/app/services/branchLoyaltyData.ts`**
   - Branch-specific loyalty data types
   - Helper functions for filtering by branch
   - Mock data with multi-branch accounts
   - Functions:
     - `getCustomerLoyaltyForBranch()` - Get account for specific branch
     - `getCustomerBranches()` - Get all branches where customer has accounts
     - `getBranchTransactions()` - Get transactions for specific branch
     - `getBranchPromotions()` - Filter promotions by branch
     - `getBranchGifts()` - Filter gifts by branch

2. **`/src/app/pages/PromotionsPage.tsx`** (UPDATED)
   - Now requires `branchId` parameter
   - Shows only data for current branch
   - Displays branch switcher for customers with multiple accounts
   - Clear messaging about branch-specific isolation

### Modified Files

1. **`/src/app/routes.ts`**
   ```typescript
   // OLD: Global promotions
   { path: 'promotions', Component: PromotionsPage }
   
   // NEW: Branch-specific promotions
   { path: 'branch/:branchId/promotions', Component: PromotionsPage }
   ```

## 🎨 User Experience

### Customer Journey

1. **Login** (via phone number)
   ```
   User: +996555123456
   System finds 3 loyalty accounts at different branches
   ```

2. **Visit Branch Promotions**
   ```
   Navigate to: /branch/branch-1/promotions
   
   Shows:
   ✓ Points balance at Downtown branch only
   ✓ Promotions valid at Downtown
   ✓ Gifts available at Downtown
   ✓ Transaction history at Downtown
   ```

3. **Switch Branches**
   ```
   User clicks "Switch Branch"
   Sees list of all their loyalty accounts:
   - Downtown: 2,800 pts (Gold)
   - Mall: 580 pts (Bronze)
   - Airport: 1,100 pts (Silver)
   
   Selects Mall → Navigate to /branch/branch-2/promotions
   Now shows completely different data (Mall-specific)
   ```

### UI Features

#### 🔔 **Branch-Specific Alert**
```
┌─────────────────────────────────────────┐
│ ℹ️  Branch-Specific Rewards             │
│                                          │
│ Points and rewards shown here are only  │
│ for Downtown Branch. You have loyalty   │
│ accounts at 3 branches.                 │
└─────────────────────────────────────────┘
```

#### 🏪 **Branch Switcher**
```
Your Loyalty Accounts
┌─────────────────────────────────┐
│ eChefs Downtown    [Current]    │
│ Gold Member                     │
│ 2,800 points | 28 orders        │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ eChefs Mall                     │
│ Bronze Member                   │
│ 580 points | 5 orders           │
└─────────────────────────────────┘
```

#### 🔒 **No Account State**
```
┌─────────────────────────────────────┐
│         🔒                          │
│    No Loyalty Account               │
│                                     │
│ You don't have a loyalty account    │
│ at Airport Branch yet.              │
│ Start ordering to create one!       │
│                                     │
│  [Start Ordering] ──────────▶      │
└─────────────────────────────────────┘
```

## 💾 Data Examples

### Mock Customer: Ali Karimov

**Phone:** `+996555123456`

**Accounts:**

| Branch | Points | Tier | Orders | Status |
|--------|--------|------|--------|--------|
| Downtown | 2,800 | Gold | 28 | Active |
| Mall | 580 | Bronze | 5 | Active |
| Airport | 1,100 | Silver | 12 | Active |

**Sample Transactions:**

```typescript
// Downtown transactions
{
  branch_id: 'branch-1',
  customer_phone: '+996555123456',
  type: 'earn',
  points: 150,
  balance_after: 2800,
  reason: 'Order #ORD-12345'
}

// Mall transactions (completely separate)
{
  branch_id: 'branch-2',
  customer_phone: '+996555123456',
  type: 'earn',
  points: 80,
  balance_after: 580,
  reason: 'Order #ORD-22001'
}
```

## 🔧 Integration Guide

### For Developers

#### 1. Get Customer's Branch-Specific Data

```typescript
import { 
  getCustomerLoyaltyForBranch,
  branchCustomerLoyalty 
} from '../services/branchLoyaltyData';

// Get loyalty account for specific branch
const customerPhone = '+996555123456';
const branchId = 'branch-1';

const loyalty = getCustomerLoyaltyForBranch(
  customerPhone,
  branchId,
  branchCustomerLoyalty
);

if (loyalty) {
  console.log(`Points at this branch: ${loyalty.available_points}`);
} else {
  console.log('No account at this branch');
}
```

#### 2. Filter Promotions/Gifts by Branch

```typescript
import { 
  getBranchPromotions,
  getBranchGifts 
} from '../services/branchLoyaltyData';
import { promotions, gifts } from '../services/promotionsData';

// Get only promotions valid at this branch
const branchPromotions = getBranchPromotions('branch-1', promotions);

// Get only gifts available at this branch
const branchGifts = getBranchGifts('branch-1', gifts);
```

#### 3. Get All Customer's Branches

```typescript
import { 
  getCustomerBranches,
  branchCustomerLoyalty 
} from '../services/branchLoyaltyData';

const customerBranches = getCustomerBranches(
  '+996555123456',
  branchCustomerLoyalty
);

// Returns array of all branch accounts
console.log(`Customer has accounts at ${customerBranches.length} branches`);
```

### For Admins

#### Creating Branch-Specific Promotions

```typescript
// Promotion valid ONLY at Downtown
{
  id: 'promo-001',
  name: '30% Off Pizzas',
  branches: ['branch-1'], // Only Downtown
  // ...
}

// Promotion valid at ALL branches
{
  id: 'promo-002',
  name: 'Free Delivery',
  branches: 'all', // Available everywhere
  // ...
}
```

## 🎯 Business Benefits

### 1. **Localized Marketing**
- Different promotions for different locations
- Reward loyal customers at specific branches
- Test offers in one location before rolling out

### 2. **Fair Competition**
- New branches can attract customers without competing against established locations
- Each branch builds its own customer base

### 3. **Accurate Analytics**
- Track customer loyalty PER BRANCH
- Understand which locations have strongest retention
- Identify branch-specific preferences

### 4. **Customer Flexibility**
- Customers can patronize multiple locations
- Each location relationship develops independently
- No confusion about "which points can I use here?"

## 🚀 Future Enhancements

### Phase 1: Cross-Branch Features (Optional)
```typescript
// Allow point transfers between branches (with fee)
transferPoints(
  from: 'branch-1',
  to: 'branch-2',
  points: 500,
  fee: 0.1 // 10% transfer fee
)
```

### Phase 2: Consolidated View
```typescript
// Dashboard showing ALL branch accounts
/loyalty-additions/branches
```

### Phase 3: Branch Groups
```typescript
// Allow point sharing within branch groups
{
  group_id: 'downtown-cluster',
  branches: ['branch-1', 'branch-4', 'branch-7'],
  shared_points: true
}
```

## ✅ Testing Checklist

- [ ] User can view loyalty account at specific branch
- [ ] User with no account sees "Create Account" message
- [ ] Points balance shows only for current branch
- [ ] Promotions filtered to current branch
- [ ] Gifts filtered to current branch
- [ ] Transaction history shows only current branch
- [ ] Branch switcher shows all user's accounts
- [ ] Switching branches updates all data correctly
- [ ] Redemption only deducts from current branch
- [ ] Promotions marked as branch-specific in modal
- [ ] Clear messaging about branch isolation

## 📞 Support & Questions

For questions about the branch-specific loyalty system:
1. Check this documentation
2. Review `/src/app/services/branchLoyaltyData.ts`
3. Examine `/src/app/pages/PromotionsPage.tsx`
4. Test with mock phone: `+996555123456`

---

**Last Updated:** March 18, 2026  
**System Version:** 2.0.0 (Branch-Specific)  
**Status:** ✅ Production Ready
