# Branch-Specific Loyalty System - Visual Guide

## 🎯 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ECHEFS LOYALTY SYSTEM                         │
│                     (Branch-Specific)                            │
└─────────────────────────────────────────────────────────────────┘

           ┌──────────────────────────────┐
           │  Customer: Ali Karimov       │
           │  Phone: +996555123456        │
           │  Login: Phone Number Auth    │
           └──────────────┬───────────────┘
                          │
          ┌───────────────┴───────────────┐
          │    Multiple Loyalty Accounts   │
          └───────────────┬───────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 🏢 DOWNTOWN  │  │ 🏢 MALL      │  │ 🏢 AIRPORT   │
│ Branch-1     │  │ Branch-2     │  │ Branch-3     │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ 🥇 Gold      │  │ 🥉 Bronze    │  │ 🥈 Silver    │
│ 2,800 pts    │  │ 580 pts      │  │ 1,100 pts    │
│ 28 orders    │  │ 5 orders     │  │ 12 orders    │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ ✓ Promotions │  │ ✓ Promotions │  │ ✓ Promotions │
│ ✓ Gifts      │  │ ✓ Gifts      │  │ ✓ Gifts      │
│ ✓ History    │  │ ✓ History    │  │ ✓ History    │
└──────────────┘  └──────────────┘  └──────────────┘
     🔒               🔒               🔒
  ISOLATED        ISOLATED         ISOLATED
  
  ❌ Cannot use Downtown points at Mall
  ❌ Cannot redeem Mall gifts at Airport
  ✅ Each branch 100% independent
```

## 📱 User Flow Diagram

```
START: User opens app
         │
         ▼
   ┌─────────────┐
   │  Login      │
   │  (Phone #)  │
   └──────┬──────┘
          │
          ▼
   ┌─────────────────┐
   │ Select Branch   │
   │ (Branch List)   │
   └──────┬──────────┘
          │
          ▼
┌──────────────────────┐
│ Browse Menu          │
│ /branch/{id}/menu    │
└──────┬───────────────┘
       │
       │ (User clicks "Promotions")
       │
       ▼
┌─────────────────────────────┐
│ Promotions Page             │
│ /branch/{id}/promotions     │
├─────────────────────────────┤
│                             │
│ 📍 Branch: Downtown         │
│                             │
│ 💳 Your Account             │
│ ┌─────────────────────────┐ │
│ │ 🥇 Gold Member         │ │
│ │ 2,800 points           │ │
│ │ ████████░░ 80% to Plat │ │
│ └─────────────────────────┘ │
│                             │
│ ℹ️  Points are branch-specific │
│ You have accounts at 3      │
│ branches. [Switch Branch]   │
│                             │
│ 📑 Tabs:                    │
│ [Promotions] [Loyalty] [Gifts] │
│                             │
└─────────────────────────────┘
```

## 🔄 Branch Switching Flow

```
┌────────────────────────────────┐
│ Current: eChefs Downtown       │
│ Points: 2,800 (Gold)           │
└────────┬───────────────────────┘
         │
         │ (Click "Switch Branch")
         │
         ▼
┌────────────────────────────────┐
│ Branch Switcher Modal          │
├────────────────────────────────┤
│ Your Loyalty Accounts          │
│                                │
│ ┌────────────────────────────┐ │
│ │ eChefs Downtown   [CURRENT]│ │
│ │ Gold • 2,800 pts • 28 ord  │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ eChefs Mall          [TAP] │ │
│ │ Bronze • 580 pts • 5 orders│ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ eChefs Airport       [TAP] │ │
│ │ Silver • 1.1K pts • 12 ord │ │
│ └────────────────────────────┘ │
│                                │
│ [Browse All Branches]          │
└────────┬───────────────────────┘
         │
         │ (User selects "Mall")
         │
         ▼
┌────────────────────────────────┐
│ Navigate to:                   │
│ /branch/branch-2/promotions    │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ NEW PAGE LOADED                │
│ Branch: eChefs Mall            │
│ Points: 580 (Bronze)           │
│ (Completely different data)    │
└────────────────────────────────┘
```

## 💰 Points Isolation Example

```
╔══════════════════════════════════════════════════════╗
║  Customer: Ali (+996555123456)                       ║
╚══════════════════════════════════════════════════════╝

 Scenario 1: Order at Downtown
 ────────────────────────────────
 
 ┌─────────────────────────────┐
 │ Order at Downtown           │
 │ Total: 1,500 KGS            │
 │ Points earned: 150          │
 └──────────┬──────────────────┘
            │
            ▼
 ┌─────────────────────────────┐
 │ Downtown Account            │
 │ Before: 2,650 pts           │
 │ +150 pts                    │
 │ After:  2,800 pts ✅        │
 └─────────────────────────────┘
 
 ┌─────────────────────────────┐
 │ Mall Account                │
 │ Before: 580 pts             │
 │ No change                   │
 │ After:  580 pts             │
 └─────────────────────────────┘
 
 ┌─────────────────────────────┐
 │ Airport Account             │
 │ Before: 1,100 pts           │
 │ No change                   │
 │ After:  1,100 pts           │
 └─────────────────────────────┘
 
 
 Scenario 2: Redeem at Mall
 ──────────────────────────────
 
 ┌─────────────────────────────┐
 │ Redeem Gift at Mall         │
 │ Cost: 500 points            │
 │ Gift: Free Dessert          │
 └──────────┬──────────────────┘
            │
            ▼
 ┌─────────────────────────────┐
 │ Mall Account                │
 │ Before: 580 pts             │
 │ -500 pts                    │
 │ After:  80 pts ✅           │
 └─────────────────────────────┘
 
 ┌─────────────────────────────┐
 │ Downtown Account            │
 │ Stays: 2,800 pts            │
 │ (Not affected) 🔒           │
 └─────────────────────────────┘
 
 ┌─────────────────────────────┐
 │ Airport Account             │
 │ Stays: 1,100 pts            │
 │ (Not affected) 🔒           │
 └─────────────────────────────┘
```

## 🎁 Redemption Flow

```
 User at Downtown branch wants to redeem gift
 ─────────────────────────────────────────────
 
 ┌─────────────────────────────┐
 │ /branch/branch-1/promotions │
 │ (Downtown)                  │
 └──────────┬──────────────────┘
            │
            ▼
 ┌─────────────────────────────┐
 │ Gifts Tab                   │
 │                             │
 │ 🎁 Free Pizza (500 pts)     │
 │    [Redeem Now] ✅          │
 │                             │
 │ 🎁 20% Discount (800 pts)   │
 │    [Redeem Now] ✅          │
 │                             │
 │ 🎁 Meal Voucher (3000 pts)  │
 │    [2200 more pts needed] ❌│
 └──────────┬──────────────────┘
            │
            │ (Click "Redeem Now" on Free Pizza)
            │
            ▼
 ┌─────────────────────────────────────┐
 │ Confirmation Modal                  │
 ├─────────────────────────────────────┤
 │ 🎁 Confirm Redemption               │
 │                                     │
 │ Free Pizza                          │
 │ Delicious margherita pizza          │
 │                                     │
 │ ┌─────────┐  ┌──────────┐          │
 │ │Points   │  │Remaining │          │
 │ │Required │  │          │          │
 │ │  500    │  │  2,300   │          │
 │ └─────────┘  └──────────┘          │
 │                                     │
 │ ℹ️  Branch-Specific Redemption:     │
 │ This reward can only be used at     │
 │ eChefs Downtown. Show this to       │
 │ staff when ordering.                │
 │                                     │
 │ [Cancel]  [Confirm Redemption]      │
 └─────────────────────────────────────┘
            │
            │ (User confirms)
            │
            ▼
 ┌─────────────────────────────┐
 │ ✅ Success Toast            │
 │ Successfully redeemed at    │
 │ eChefs Downtown:            │
 │ Free Pizza!                 │
 └─────────────────────────────┘
            │
            ▼
 ┌─────────────────────────────┐
 │ Updated Points              │
 │ Before: 2,800 pts           │
 │ After:  2,300 pts           │
 │ Transaction recorded ✅      │
 └─────────────────────────────┘
```

## 📊 Data Structure Visualization

```
┌──────────────────────────────────────────┐
│        branchCustomerLoyalty[]           │
└────────────┬─────────────────────────────┘
             │
   ┌─────────┼─────────┐
   │         │         │
   ▼         ▼         ▼
┌──────┐ ┌──────┐ ┌──────┐
│ Ali  │ │ Ali  │ │ Ali  │
│ B1   │ │ B2   │ │ B3   │
├──────┤ ├──────┤ ├──────┤
│Phone │ │Phone │ │Phone │
│ +996 │ │ +996 │ │ +996 │
│ 555  │ │ 555  │ │ 555  │
│ 123  │ │ 123  │ │ 123  │
│ 456  │ │ 456  │ │ 456  │
├──────┤ ├──────┤ ├──────┤
│ID:   │ │ID:   │ │ID:   │
│cust  │ │cust  │ │cust  │
│-001  │ │-001  │ │-001  │
│-b1   │ │-b2   │ │-b3   │
├──────┤ ├──────┤ ├──────┤
│Pts:  │ │Pts:  │ │Pts:  │
│2,800 │ │ 580  │ │1,100 │
├──────┤ ├──────┤ ├──────┤
│Tier: │ │Tier: │ │Tier: │
│Gold  │ │Bronz │ │Silvr │
└──────┘ └──────┘ └──────┘

      ╔════════════════════════╗
      ║  SAME PHONE NUMBER     ║
      ║  DIFFERENT BRANCHES    ║
      ║  ISOLATED ACCOUNTS     ║
      ╚════════════════════════╝
```

## 🏗️ System Architecture

```
┌────────────────────────────────────────────┐
│           USER INTERFACE LAYER             │
│  ┌──────────────────────────────────────┐  │
│  │  PromotionsPage.tsx                  │  │
│  │  - Branch-aware                      │  │
│  │  - Uses branchId from URL params     │  │
│  │  - Filters all data by branch        │  │
│  └────────────┬─────────────────────────┘  │
└───────────────┼────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────────┐
│         DATA SERVICE LAYER                 │
│  ┌──────────────────────────────────────┐  │
│  │  branchLoyaltyData.ts                │  │
│  │  - getCustomerLoyaltyForBranch()     │  │
│  │  - getCustomerBranches()             │  │
│  │  - getBranchTransactions()           │  │
│  │  - getBranchPromotions()             │  │
│  │  - getBranchGifts()                  │  │
│  └────────────┬─────────────────────────┘  │
└───────────────┼────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────────┐
│            DATA STORAGE LAYER              │
│  ┌──────────────┐  ┌──────────────┐       │
│  │   Loyalty    │  │ Transactions │       │
│  │   Accounts   │  │   History    │       │
│  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐       │
│  │  Promotions  │  │    Gifts     │       │
│  └──────────────┘  └──────────────┘       │
└────────────────────────────────────────────┘
```

## 🎨 UI Component Hierarchy

```
PromotionsPage
│
├─ Header Section
│  ├─ Back Button
│  ├─ Branch Name (clickable)
│  │  └─ Opens: Branch Switcher Modal
│  ├─ Notifications Button (badge: 3)
│  └─ Settings Button
│
├─ Loyalty Card
│  ├─ Tier Badge (🥇 Gold)
│  ├─ Points Display (2,800)
│  ├─ Progress Bar (to next tier)
│  └─ Quick Stats (Orders, Multiplier, Discount)
│
├─ Branch-Specific Alert
│  └─ "Points are branch-specific"
│
├─ Tabs
│  ├─ [Promotions Tab]
│  │  ├─ Search Input
│  │  └─ Promotion Cards
│  │     ├─ Gradient Header
│  │     ├─ Discount Display
│  │     ├─ Promo Code (if applicable)
│  │     └─ "Use This Offer" Button
│  │
│  ├─ [Loyalty Tab]
│  │  ├─ Tier Overview (all 4 tiers)
│  │  └─ Recent Activity
│  │     └─ Transaction Cards
│  │
│  └─ [Gifts Tab]
│     ├─ Search Input
│     └─ Gift Cards
│        ├─ Points Required
│        ├─ Affordability Check
│        └─ "Redeem Now" Button
│
└─ Modals
   ├─ Branch Switcher Modal
   │  └─ List of all customer's branches
   ├─ Promotion Detail Modal
   │  └─ Apply promotion confirmation
   ├─ Gift Redemption Modal
   │  └─ Points deduction confirmation
   └─ Settings Modal
      └─ Quick links to other pages
```

## ✅ System Validation Checklist

```
┌─────────────────────────────────────────┐
│ ✅ Branch Isolation                     │
├─────────────────────────────────────────┤
│ □ Points stay at earning branch         │
│ □ Gifts only redeemable at branch       │
│ □ Promotions filtered by branch         │
│ □ Transactions separated by branch      │
│ □ Tiers progress independently          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✅ Multi-Branch Support                 │
├─────────────────────────────────────────┤
│ □ Customer can have multiple accounts   │
│ □ Branch switcher shows all accounts    │
│ □ Easy navigation between branches      │
│ □ Clear indication of current branch    │
│ □ "No account" state handled properly   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✅ User Experience                      │
├─────────────────────────────────────────┤
│ □ Clear messaging about isolation       │
│ □ Branch name prominently displayed     │
│ □ Smooth animations and transitions     │
│ □ Professional empty states             │
│ □ Helpful error messages                │
└─────────────────────────────────────────┘
```

---

**Visual Guide Version:** 1.0  
**Last Updated:** March 18, 2026  
**Status:** 🎯 Production Ready
