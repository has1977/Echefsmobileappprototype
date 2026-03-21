/**
 * eChefs Routing Configuration
 * React Router v7 Data Mode
 * Last updated: March 19, 2026 14:30 UTC - Provider fix applied
 * Build version: 3.3.1
 */
import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { MobileLayout } from './layouts/MobileLayout';
import { WelcomePage } from './pages/WelcomePage';
import { BranchSelectionPage } from './pages/BranchSelectionPage';
import { RegionSelectionPage } from './pages/RegionSelectionPage';
import { MenuPage } from './pages/MenuPage';
import { MenuItemDetailPage } from './pages/MenuItemDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { LoyaltyPage } from './pages/LoyaltyPage';
import { PromotionsPage } from './pages/PromotionsPage';
import { PromotionsRedirect } from './pages/PromotionsRedirect';
import { OffersRedirect } from './pages/OffersRedirect';
import { ReviewsPage } from './pages/ReviewsPage';
import { ComprehensiveDashboard } from './pages/ComprehensiveDashboard';

// Auth Pages
import { SignInPage } from './pages/auth/SignInPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { ProfilePage } from './pages/ProfilePage';
import { EnhancedProfilePage } from './pages/EnhancedProfilePage';
import { ProfileSecurityPage } from './pages/ProfileSecurityPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { HelpPage } from './pages/HelpPage';
import { FavoritesPage } from './pages/FavoritesPage';

// Unified Control Panel (replaces all dashboards)
import { UnifiedControlPanel } from './pages/UnifiedControlPanel';

// Manager Pages (still accessible from control panel)
import { ManagerMenuManagement } from './pages/manager/ManagerMenuManagement';
import { ManagerPromotions } from './pages/manager/ManagerPromotions';
import { ManagerReports } from './pages/manager/ManagerReports';
import { ManagerLoyaltyPromotions } from './pages/manager/ManagerLoyaltyPromotions';

// Inventory Pages
import { InventoryDashboard } from './pages/inventory/InventoryDashboard';
import { IngredientList } from './pages/inventory/IngredientList';
import { IngredientDetail } from './pages/inventory/IngredientDetail';

// Admin Routes (accessible from control panel)
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminBranches } from './pages/admin/AdminBranches';
import { AdminBranchEditor } from './pages/admin/AdminBranchEditor';
import { AdminTableManagement } from './pages/admin/AdminTableManagement';
import { AdminDataTest } from './pages/admin/AdminDataTest';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminLanguages } from './pages/admin/AdminLanguages';
import { AdminMenuManagement } from './pages/admin/AdminMenuManagement';
import { BrandStyleGuide } from './pages/admin/BrandStyleGuide';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminPromotions } from './pages/admin/AdminPromotions';
import { AdminPromotionsNew } from './pages/admin/AdminPromotionsNew';
import { AdminGifts } from './pages/admin/AdminGifts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminLoyalty } from './pages/admin/AdminLoyalty';
import { AdminLoyaltyNew } from './pages/admin/AdminLoyaltyNew';
import { StyleGuidePage } from './pages/admin/StyleGuidePage';

// Loyalty & Promotions Additions
import {
  BranchListPage,
  BranchLoyaltyDetailPage,
  GlobalWalletPage,
  PromotionDetailPage,
  RedemptionFlowPage,
  CheckInPage,
  NotificationsPage,
  EmptyStatesPage,
} from './pages/loyalty-additions';

// 404 Page
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      // Admin and Control Panel routes (direct children, bypass MobileLayout)
      {
        path: 'control-panel',
        Component: UnifiedControlPanel,
      },
      {
        path: 'admin',
        children: [
          { index: true, Component: AdminDashboard },
          { path: 'settings', Component: AdminSettings },
          { path: 'languages', Component: AdminLanguages },
          { path: 'menu', Component: AdminMenuManagement },
          { path: 'branches', Component: AdminBranches },
          { path: 'branches/:branchId', Component: AdminBranchEditor },
          { path: 'table-management', Component: AdminTableManagement },
          { path: 'users', Component: AdminUsers },
          { path: 'analytics', Component: AdminAnalytics },
          { path: 'promotions', Component: AdminPromotionsNew },
          { path: 'loyalty', Component: AdminLoyaltyNew },
          { path: 'orders', Component: AdminOrders },
          { path: 'customers', Component: AdminCustomers },
          { path: 'gifts', Component: AdminGifts },
          { path: 'notifications', Component: AdminNotifications },
          { path: 'brand-guide', Component: BrandStyleGuide },
          { path: 'style-guide', Component: StyleGuidePage },
          { path: 'data-test', Component: AdminDataTest },
          // Inventory Management Routes
          { path: 'inventory', Component: InventoryDashboard },
          { path: 'inventory/ingredients', Component: IngredientList },
          { path: 'inventory/ingredients/:ingredientId', Component: IngredientDetail },
        ],
      },
      // Manager Routes (direct children, bypass MobileLayout)
      {
        path: 'manager/menu',
        Component: ManagerMenuManagement,
      },
      {
        path: 'manager/promotions',
        Component: ManagerPromotions,
      },
      {
        path: 'manager/reports',
        Component: ManagerReports,
      },
      {
        path: 'manager/loyalty-promotions',
        Component: ManagerLoyaltyPromotions,
      },
      // Customer Routes (wrapped in MobileLayout)
      {
        path: '/',
        Component: MobileLayout,
        children: [
          {
            index: true,
            Component: WelcomePage,
          },
          {
            path: 'branch-selection',
            Component: BranchSelectionPage,
          },
          {
            path: 'branch/:branchId/region-selection',
            Component: RegionSelectionPage,
          },
          {
            path: 'branch/:branchId/menu',
            Component: MenuPage,
          },
          {
            path: 'branch/:branchId/menu/:itemId',
            Component: MenuItemDetailPage,
          },
          {
            path: 'cart',
            Component: CartPage,
          },
          {
            path: 'checkout',
            Component: CheckoutPage,
          },
          {
            path: 'order/:orderId/tracking',
            Component: OrderTrackingPage,
          },
          {
            path: 'loyalty',
            Component: LoyaltyPage,
          },
          {
            path: 'promotions',
            Component: PromotionsRedirect,
          },
          {
            path: 'branch/:branchId/promotions',
            Component: PromotionsPage,
          },
          {
            path: 'offers',
            Component: PromotionsRedirect,
          },
          {
            path: 'branch/:branchId/offers',
            Component: OffersRedirect,
          },
          {
            path: 'reviews/:itemId',
            Component: ReviewsPage,
          },
          {
            path: 'dashboard',
            Component: ComprehensiveDashboard,
          },
          
          // Auth Routes
          {
            path: 'sign-in',
            Component: SignInPage,
          },
          {
            path: 'sign-up',
            Component: SignUpPage,
          },
          {
            path: 'profile',
            Component: EnhancedProfilePage,
          },
          {
            path: 'profile/security',
            Component: ProfileSecurityPage,
          },
          {
            path: 'profile/settings',
            Component: ProfileSettingsPage,
          },
          {
            path: 'help',
            Component: HelpPage,
          },
          {
            path: 'favorites',
            Component: FavoritesPage,
          },
          
          // Loyalty & Promotions Additions
          {
            path: 'loyalty-additions',
            children: [
              { path: 'branches', Component: BranchListPage },
              { path: 'branch/:branchId', Component: BranchLoyaltyDetailPage },
              { path: 'global-wallet', Component: GlobalWalletPage },
              { path: 'promotion/:promotionId', Component: PromotionDetailPage },
              { path: 'redeem/:branchId', Component: RedemptionFlowPage },
              { path: 'check-in/:branchId', Component: CheckInPage },
              { path: 'notifications', Component: NotificationsPage },
              { path: 'empty-states', Component: EmptyStatesPage },
            ],
          },
          
          // 404
          {
            path: '*',
            Component: NotFoundPage,
          },
        ],
      },
    ],
  },
]);