/**
 * eChefs Routing Configuration
 * React Router v7 Data Mode
 * Last updated: March 25, 2026 16:30 UTC - Fixed import cache issues
 * Build version: 3.3.5
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
import { RewardsGuidePage } from './pages/RewardsGuidePage';
import { MyOrdersPage } from './pages/MyOrdersPage';

// Unified Control Panel (replaces all dashboards)
import { UnifiedControlPanel } from './pages/UnifiedControlPanel';

// Developer Tools
import { DevTools } from './pages/DevTools';
import { TestSessionResetPage } from './pages/TestSessionResetPage';
import { OrderManagementPage } from './pages/OrderManagementPage';
import { ResetDataPage } from './pages/ResetDataPage';
import { NotFoundPage } from './pages/NotFoundPage';

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
import { AdminMenuManagementNew } from './pages/admin/AdminMenuManagementNew';
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
import { AdminLoyaltySettings } from './pages/admin/AdminLoyaltySettings';
import { StyleGuidePage } from './pages/admin/StyleGuidePage';
import { AdminCurrency } from './pages/admin/AdminCurrency';
import { AdminRatings } from './pages/admin/AdminRatings';
import { AdminSupport } from './pages/admin/AdminSupport';

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

// Table Check-In System
import { TableCheckInPage } from './pages/TableCheckInPage';
import { StaffCheckInDashboard } from './pages/StaffCheckInDashboard';

// Department & Waiter Management
import { AdminDepartments } from './pages/admin/AdminDepartments';
import { AdminWaiters } from './pages/admin/AdminWaiters';
import { DepartmentDashboard } from './pages/DepartmentDashboard';
import { WaiterDashboard } from './pages/WaiterDashboard';
import { WaiterOrderTaking } from './pages/WaiterOrderTaking';
import { WaiterOrderDetails } from './pages/WaiterOrderDetails';
import { WaiterScanTable } from './pages/WaiterScanTable';
import { RateWaiterPage } from './pages/RateWaiterPage';
import { KitchenDisplayPage } from './pages/KitchenDisplayPage';

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
        path: 'control-panel/ratings',
        Component: AdminRatings,
      },
      {
        path: 'control-panel/support-messages',
        Component: AdminSupport,
      },
      {
        path: 'dev-tools',
        Component: DevTools,
      },
      {
        path: 'test-session-reset',
        Component: TestSessionResetPage,
      },
      {
        path: 'reset-data',
        Component: ResetDataPage,
      },
      // Removed duplicate OrderManagementPage - now only in MobileLayout
      {
        path: 'admin',
        children: [
          { index: true, Component: AdminDashboard },
          { path: 'settings', Component: AdminSettings },
          { path: 'languages', Component: AdminLanguages },
          { path: 'currency', Component: AdminCurrency },
          { path: 'menu', Component: AdminMenuManagementNew },
          { path: 'branches', Component: AdminBranches },
          { path: 'branches/:branchId', Component: AdminBranchEditor },
          { path: 'table-management', Component: AdminTableManagement },
          { path: 'users', Component: AdminUsers },
          { path: 'analytics', Component: AdminAnalytics },
          { path: 'promotions', Component: AdminPromotionsNew },
          { path: 'loyalty', Component: AdminLoyaltyNew },
          { path: 'loyalty/settings', Component: AdminLoyaltySettings },
          { path: 'orders', Component: AdminOrders },
          { path: 'customers', Component: AdminCustomers },
          { path: 'gifts', Component: AdminGifts },
          { path: 'notifications', Component: AdminNotifications },
          { path: 'brand-guide', Component: BrandStyleGuide },
          { path: 'style-guide', Component: StyleGuidePage },
          { path: 'data-test', Component: AdminDataTest },
          { path: 'ratings', Component: AdminRatings },
          { path: 'support', Component: AdminSupport },
          // Department & Waiter Management
          { path: 'departments', Component: AdminDepartments },
          { path: 'waiters', Component: AdminWaiters },
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
      
      // Department Routes (direct children, bypass MobileLayout)
      {
        path: 'department/:departmentId',
        Component: DepartmentDashboard,
      },
      
      // Kitchen Display System
      {
        path: 'kitchen',
        Component: KitchenDisplayPage,
      },
      {
        path: 'kitchen/:branchId',
        Component: KitchenDisplayPage,
      },
      
      // Waiter Routes (direct children, bypass MobileLayout)
      {
        path: 'waiter/dashboard',
        Component: WaiterDashboard,
      },
      {
        path: 'waiter/order-details/:id',
        Component: WaiterOrderDetails,
      },
      {
        path: 'waiter/new-order',
        Component: WaiterOrderTaking,
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
          {
            path: 'rewards-guide',
            Component: RewardsGuidePage,
          },
          {
            path: 'my-orders',
            Component: MyOrdersPage,
          },
          
          // Order Management (accessible from anywhere)
          {
            path: 'order-management',
            Component: OrderManagementPage,
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
          
          // Table Check-In System
          {
            path: 'table-check-in',
            Component: TableCheckInPage,
          },
          {
            path: 'staff-check-in-dashboard',
            Component: StaffCheckInDashboard,
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