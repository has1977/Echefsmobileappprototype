# Branch-Specific Loyalty - Developer Quick Reference

## 🚀 Quick Start

### Test the System Right Now

1. **Open the app**
2. **Navigate to:** `/branch/branch-1/promotions`
3. **See:** Ali's Downtown account (2,800 points, Gold tier)
4. **Click:** Branch name → See all 3 of Ali's accounts
5. **Switch to:** Mall → See completely different data (580 points, Bronze)

**Test Phone:** `+996555123456` (Ali Karimov)

---

## 📝 Common Code Snippets

### Get Customer's Branch-Specific Account

```typescript
import { getCustomerLoyaltyForBranch, branchCustomerLoyalty } from '../services/branchLoyaltyData';

const customerPhone = '+996555123456';
const branchId = 'branch-1';

const account = getCustomerLoyaltyForBranch(
  customerPhone,
  branchId,
  branchCustomerLoyalty
);

if (account) {
  console.log(`Points: ${account.available_points}`);
  console.log(`Tier: ${account.tier_name}`);
} else {
  console.log('No account at this branch');
}
```

### Get All Customer's Branches

```typescript
import { getCustomerBranches, branchCustomerLoyalty } from '../services/branchLoyaltyData';

const allAccounts = getCustomerBranches(
  '+996555123456',
  branchCustomerLoyalty
);

console.log(`Customer has ${allAccounts.length} branch accounts`);
allAccounts.forEach(acc => {
  console.log(`${acc.branch_name}: ${acc.available_points} pts`);
});
```

### Filter Promotions by Branch

```typescript
import { getBranchPromotions } from '../services/branchLoyaltyData';
import { promotions } from '../services/promotionsData';

const branchPromos = getBranchPromotions('branch-1', promotions);
console.log(`${branchPromos.length} promotions at this branch`);
```

### Filter Gifts by Branch

```typescript
import { getBranchGifts } from '../services/branchLoyaltyData';
import { gifts } from '../services/promotionsData';

const branchGifts = getBranchGifts('branch-1', gifts);
console.log(`${branchGifts.length} gifts available`);
```

### Get Branch Transactions

```typescript
import { getBranchTransactions, branchPointsTransactions } from '../services/branchLoyaltyData';

const transactions = getBranchTransactions(
  '+996555123456',
  'branch-1',
  branchPointsTransactions
);

console.log(`${transactions.length} transactions at this branch`);
```

---

## 🎯 Key Functions Reference

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `getCustomerLoyaltyForBranch()` | `phone, branchId, allRecords` | `BranchCustomerLoyalty \| null` | Get account for specific branch |
| `getCustomerBranches()` | `phone, allRecords` | `BranchCustomerLoyalty[]` | Get all branch accounts |
| `getBranchTransactions()` | `phone, branchId, allTxns` | `BranchPointsTransaction[]` | Get transactions for branch |
| `getBranchPromotions()` | `branchId, allPromos` | `Promotion[]` | Filter promotions by branch |
| `getBranchGifts()` | `branchId, allGifts` | `Gift[]` | Filter gifts by branch |

---

## 📦 Data Types Quick Ref

### BranchCustomerLoyalty

```typescript
interface BranchCustomerLoyalty {
  customer_id: string;           // e.g., 'cust-001-branch-1'
  customer_phone: string;         // e.g., '+996555123456'
  branch_id: string;              // e.g., 'branch-1'
  branch_name: string;            // e.g., 'eChefs Downtown'
  total_points: number;           // All-time points
  available_points: number;       // Current spendable points
  lifetime_points: number;        // Total ever earned
  current_tier: string;           // e.g., 'tier-gold'
  tier_name: string;              // e.g., 'Gold'
  next_tier?: string;             // e.g., 'tier-platinum'
  points_to_next_tier?: number;  // e.g., 1750
  total_orders: number;           // Orders at this branch
  total_spent: number;            // Money spent at this branch
  member_since: Date;             // When account was created
  last_activity: Date;            // Last transaction
  is_active: boolean;             // Account status
}
```

### BranchPointsTransaction

```typescript
interface BranchPointsTransaction {
  id: string;                     // e.g., 'txn-001'
  customer_id: string;            // e.g., 'cust-001-branch-1'
  customer_phone: string;         // e.g., '+996555123456'
  branch_id: string;              // e.g., 'branch-1'
  type: 'earn' | 'redeem' | 'expire' | 'adjustment';
  points: number;                 // Amount (positive or negative)
  balance_after: number;          // Points after this transaction
  reason: string;                 // e.g., 'Order #ORD-12345'
  reference_id?: string;          // Related order/gift ID
  reference_type?: 'order' | 'gift' | 'referral' | 'manual';
  created_at: Date;               // Transaction timestamp
  expires_at?: Date;              // When points expire (if applicable)
}
```

---

## 🗺️ URL Patterns

| URL | Description | Data Shown |
|-----|-------------|------------|
| `/branch/branch-1/promotions` | Downtown promotions | Only branch-1 data |
| `/branch/branch-2/promotions` | Mall promotions | Only branch-2 data |
| `/branch/branch-3/promotions` | Airport promotions | Only branch-3 data |
| `/branch-selection` | Choose branch | All branches list |
| `/loyalty-additions/branches` | All loyalty accounts | Summary of all accounts |

---

## 🧪 Test Data Reference

### Test Customers

| Phone | Name | Branches | Best Account |
|-------|------|----------|--------------|
| `+996555123456` | Ali Karimov | 3 (B1, B2, B3) | Downtown (2,800 pts) |
| `+996555789012` | Elena Petrova | 1 (B1) | Downtown (1,600 pts) |
| `+996555345678` | Aibek Moldoshev | 1 (B2) | Mall (320 pts) |

### Ali's Accounts Detail

```typescript
// Branch 1 - Downtown
{
  branch_id: 'branch-1',
  branch_name: 'eChefs Downtown',
  available_points: 2800,
  current_tier: 'tier-gold',
  total_orders: 28
}

// Branch 2 - Mall
{
  branch_id: 'branch-2',
  branch_name: 'eChefs Mall',
  available_points: 580,
  current_tier: 'tier-bronze',
  total_orders: 5
}

// Branch 3 - Airport
{
  branch_id: 'branch-3',
  branch_name: 'eChefs Airport',
  available_points: 1100,
  current_tier: 'tier-silver',
  total_orders: 12
}
```

---

## 🎨 Component Usage Examples

### In a React Component

```typescript
import { useParams } from 'react-router';
import { getCustomerLoyaltyForBranch } from '../services/branchLoyaltyData';

export function MyComponent() {
  const { branchId } = useParams<{ branchId: string }>();
  const customerPhone = '+996555123456'; // From auth context
  
  const account = getCustomerLoyaltyForBranch(
    customerPhone,
    branchId || '',
    branchCustomerLoyalty
  );
  
  if (!account) {
    return <div>No account at this branch</div>;
  }
  
  return (
    <div>
      <h2>{account.branch_name}</h2>
      <p>Points: {account.available_points}</p>
      <p>Tier: {account.tier_name}</p>
    </div>
  );
}
```

### Check if Customer Can Afford Gift

```typescript
function canAffordGift(gift: Gift, account: BranchCustomerLoyalty | null): boolean {
  if (!account) return false;
  return account.available_points >= gift.points_required;
}

// Usage
const gift = { points_required: 500, name: 'Free Pizza' };
const affordable = canAffordGift(gift, account);

if (affordable) {
  console.log('Can redeem!');
} else {
  const needed = gift.points_required - (account?.available_points || 0);
  console.log(`Need ${needed} more points`);
}
```

---

## 🔄 Common Workflows

### 1. Display Branch Promotions

```typescript
// In PromotionsPage or similar
const { branchId } = useParams();
const branchPromos = getBranchPromotions(branchId, promotions);

return (
  <div>
    {branchPromos.map(promo => (
      <PromotionCard key={promo.id} promotion={promo} />
    ))}
  </div>
);
```

### 2. Show All Customer's Accounts

```typescript
const allAccounts = getCustomerBranches(customerPhone, branchCustomerLoyalty);

return (
  <div>
    {allAccounts.map(account => (
      <BranchAccountCard
        key={account.branch_id}
        account={account}
        onClick={() => navigate(`/branch/${account.branch_id}/promotions`)}
      />
    ))}
  </div>
);
```

### 3. Process Gift Redemption

```typescript
function redeemGift(gift: Gift, account: BranchCustomerLoyalty) {
  if (!canAffordGift(gift, account)) {
    showError('Insufficient points');
    return;
  }
  
  // In real app, this would call API
  const newTransaction = {
    id: generateId(),
    customer_phone: account.customer_phone,
    branch_id: account.branch_id,
    type: 'redeem',
    points: -gift.points_required,
    balance_after: account.available_points - gift.points_required,
    reason: `Redeemed: ${gift.name}`,
    reference_id: gift.id,
    reference_type: 'gift',
    created_at: new Date(),
  };
  
  // Save transaction
  // Update account balance
  
  showSuccess(`Redeemed ${gift.name} at ${account.branch_name}!`);
}
```

---

## 🚨 Common Pitfalls

### ❌ Don't Do This

```typescript
// Using global loyalty (wrong!)
const loyalty = customersLoyalty[0];
console.log(loyalty.available_points); // Points from where???
```

### ✅ Do This Instead

```typescript
// Branch-specific loyalty (correct!)
const loyalty = getCustomerLoyaltyForBranch(phone, branchId, data);
if (loyalty) {
  console.log(`${loyalty.available_points} pts at ${loyalty.branch_name}`);
}
```

### ❌ Don't Do This

```typescript
// Showing all promotions (wrong!)
const allPromos = promotions.filter(p => p.status === 'active');
```

### ✅ Do This Instead

```typescript
// Branch-specific promotions (correct!)
const branchPromos = getBranchPromotions(branchId, promotions);
```

---

## 📊 Debugging Tips

### Check if Customer Has Account

```typescript
const account = getCustomerLoyaltyForBranch(phone, branchId, data);
console.log('Account exists:', !!account);
if (account) {
  console.log('Points:', account.available_points);
  console.log('Tier:', account.tier_name);
}
```

### Log All Customer's Accounts

```typescript
const accounts = getCustomerBranches(phone, data);
console.table(accounts.map(a => ({
  Branch: a.branch_name,
  Points: a.available_points,
  Tier: a.tier_name,
  Orders: a.total_orders,
})));
```

### Check Branch Promotions

```typescript
const promos = getBranchPromotions(branchId, promotions);
console.log(`Branch has ${promos.length} promotions`);
promos.forEach(p => {
  console.log(`- ${p.name} (${p.type})`);
});
```

---

## 🎯 Quick Checklist for New Features

When adding a new feature that uses loyalty data:

- [ ] Import from `branchLoyaltyData.ts` (not `promotionsData.ts`)
- [ ] Get `branchId` from URL params (`useParams`)
- [ ] Use `getCustomerLoyaltyForBranch()` to get account
- [ ] Handle "no account" case gracefully
- [ ] Filter promotions/gifts with `getBranch...()` functions
- [ ] Show branch name in UI
- [ ] Add branch-specific messaging
- [ ] Test with multiple branches

---

## 📁 File Locations

```
/src/app/
├── services/
│   ├── branchLoyaltyData.ts    ← ⭐ Branch-specific data
│   └── promotionsData.ts        ← Global promotion types
├── pages/
│   └── PromotionsPage.tsx       ← ⭐ Branch-aware page
└── routes.ts                    ← ⭐ Updated routes

/
├── BRANCH_LOYALTY_SYSTEM.md              ← Full documentation
├── BRANCH_LOYALTY_IMPLEMENTATION_SUMMARY.md ← What was done
├── BRANCH_LOYALTY_VISUAL_GUIDE.md        ← Visual diagrams
└── DEVELOPER_QUICK_REFERENCE.md          ← ⭐ This file
```

---

## 🆘 Getting Help

1. **Check documentation:** `/BRANCH_LOYALTY_SYSTEM.md`
2. **See examples:** `/src/app/pages/PromotionsPage.tsx`
3. **Review data structure:** `/src/app/services/branchLoyaltyData.ts`
4. **Test with mock data:** Phone `+996555123456`
5. **View visual guide:** `/BRANCH_LOYALTY_VISUAL_GUIDE.md`

---

## 🎉 Quick Wins

### Add Branch Selector to Another Page

```typescript
import { getCustomerBranches } from '../services/branchLoyaltyData';

const accounts = getCustomerBranches(customerPhone, branchCustomerLoyalty);

return (
  <select onChange={(e) => navigate(`/branch/${e.target.value}/...`)}>
    {accounts.map(acc => (
      <option key={acc.branch_id} value={acc.branch_id}>
        {acc.branch_name} ({acc.available_points} pts)
      </option>
    ))}
  </select>
);
```

### Show Points Badge

```typescript
const account = getCustomerLoyaltyForBranch(phone, branchId, data);

return account ? (
  <Badge>{account.available_points} pts</Badge>
) : (
  <Badge variant="outline">No Account</Badge>
);
```

### Branch-Specific Welcome Message

```typescript
const account = getCustomerLoyaltyForBranch(phone, branchId, data);
const branch = branches.find(b => b.id === branchId);

if (!account) {
  return `Welcome to ${branch?.name}! Order to earn points!`;
}

return `Welcome back, ${account.tier_name} member! ${account.available_points} pts at ${branch?.name}`;
```

---

**Quick Reference Version:** 1.0  
**Last Updated:** March 18, 2026  
**Status:** ✅ Ready to Use  
**Test Phone:** `+996555123456`
