// Database service with business logic
import type {
  Language,
  Branch,
  Category,
  MenuItem,
  Order,
  User,
  Promotion,
  LoyaltyCard,
  SystemSettings,
  MenuType,
} from './types';

// This would connect to Supabase or your backend
// For now, using localStorage with business logic

class DatabaseService {
  private storageKey = 'echefs_db';

  private getDB() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : this.getInitialData();
  }

  private saveDB(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  private getInitialData() {
    return {
      languages: [
        {
          code: 'en',
          name: 'English',
          nativeName: 'English',
          flag: '🇬🇧',
          direction: 'ltr' as const,
          enabled: true,
        },
        {
          code: 'ar',
          name: 'Arabic',
          nativeName: 'العربية',
          flag: '🇸🇦',
          direction: 'rtl' as const,
          enabled: true,
        },
        {
          code: 'ru',
          name: 'Russian',
          nativeName: 'Русский',
          flag: '🇷🇺',
          direction: 'ltr' as const,
          enabled: true,
        },
        {
          code: 'ky',
          name: 'Kyrgyz',
          nativeName: 'Кыргызча',
          flag: '🇰🇬',
          direction: 'ltr' as const,
          enabled: true,
        },
      ] as Language[],
      categories: [] as Category[],
      menuItems: [] as MenuItem[],
      branches: [] as Branch[],
      orders: [] as Order[],
      users: [] as User[],
      promotions: [] as Promotion[],
      loyaltyCards: [] as LoyaltyCard[],
      settings: {
        tax: {
          enabled: true,
          rate: 8,
        },
        currency: {
          code: 'USD',
          symbol: '$',
          position: 'before',
        },
        loyalty: {
          enabled: true,
          pointsPerDollar: 10,
          tiers: {
            bronze: {
              minPoints: 0,
              benefits: ['Earn points on purchases', 'Birthday reward'],
              multiplier: 1,
            },
            silver: {
              minPoints: 500,
              benefits: ['10% bonus points', 'Priority support', 'Early access to promotions'],
              multiplier: 1.1,
            },
            gold: {
              minPoints: 2000,
              benefits: ['20% bonus points', 'Free delivery', 'Exclusive events'],
              multiplier: 1.2,
            },
            platinum: {
              minPoints: 5000,
              benefits: ['30% bonus points', 'VIP support', 'Personal concierge'],
              multiplier: 1.3,
            },
          },
        },
        orderSettings: {
          requireTableSelection: false,
          allowTakeaway: true,
          allowDelivery: true,
          minOrderAmount: 0,
          maxOrderAmount: 10000,
          orderNumberPrefix: 'EC',
        },
        notificationSettings: {
          emailEnabled: true,
          smsEnabled: true,
          pushEnabled: true,
        },
      } as SystemSettings,
    };
  }

  // Languages
  getLanguages(): Language[] {
    return this.getDB().languages;
  }

  getEnabledLanguages(): Language[] {
    return this.getLanguages().filter(l => l.enabled);
  }

  addLanguage(language: Omit<Language, 'enabled'>): Language {
    const db = this.getDB();
    const newLang: Language = { ...language, enabled: true };
    db.languages.push(newLang);
    this.saveDB(db);
    return newLang;
  }

  updateLanguage(code: string, updates: Partial<Language>): Language | null {
    const db = this.getDB();
    const index = db.languages.findIndex((l: Language) => l.code === code);
    if (index === -1) return null;
    db.languages[index] = { ...db.languages[index], ...updates };
    this.saveDB(db);
    return db.languages[index];
  }

  deleteLanguage(code: string): boolean {
    const db = this.getDB();
    const index = db.languages.findIndex((l: Language) => l.code === code);
    if (index === -1) return false;
    db.languages.splice(index, 1);
    this.saveDB(db);
    return true;
  }

  // Categories
  getCategories(menuType?: MenuType): Category[] {
    const categories = this.getDB().categories;
    return menuType
      ? categories.filter((c: Category) => c.menuType === menuType)
      : categories;
  }

  addCategory(category: Omit<Category, 'id'>): Category {
    const db = this.getDB();
    const newCategory: Category = {
      ...category,
      id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    db.categories.push(newCategory);
    this.saveDB(db);
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const db = this.getDB();
    const index = db.categories.findIndex((c: Category) => c.id === id);
    if (index === -1) return null;
    db.categories[index] = { ...db.categories[index], ...updates };
    this.saveDB(db);
    return db.categories[index];
  }

  deleteCategory(id: string): boolean {
    const db = this.getDB();
    const index = db.categories.findIndex((c: Category) => c.id === id);
    if (index === -1) return false;
    // Check if any menu items use this category
    const hasItems = db.menuItems.some((item: MenuItem) => item.categoryId === id);
    if (hasItems) {
      throw new Error('Cannot delete category with existing menu items');
    }
    db.categories.splice(index, 1);
    this.saveDB(db);
    return true;
  }

  // Menu Items
  getMenuItems(filters?: {
    categoryId?: string;
    menuType?: MenuType;
    branchId?: string;
    enabled?: boolean;
  }): MenuItem[] {
    let items = this.getDB().menuItems;

    if (filters) {
      if (filters.categoryId) {
        items = items.filter((i: MenuItem) => i.categoryId === filters.categoryId);
      }
      if (filters.menuType) {
        items = items.filter((i: MenuItem) => i.menuType === filters.menuType);
      }
      if (filters.enabled !== undefined) {
        items = items.filter((i: MenuItem) => i.enabled === filters.enabled);
      }
    }

    return items.sort((a: MenuItem, b: MenuItem) => a.order - b.order);
  }

  getMenuItem(id: string): MenuItem | null {
    return this.getDB().menuItems.find((i: MenuItem) => i.id === id) || null;
  }

  addMenuItem(item: Omit<MenuItem, 'id' | 'rating' | 'reviewCount'>): MenuItem {
    const db = this.getDB();
    const newItem: MenuItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      rating: 0,
      reviewCount: 0,
    };
    db.menuItems.push(newItem);
    this.saveDB(db);
    return newItem;
  }

  updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const db = this.getDB();
    const index = db.menuItems.findIndex((i: MenuItem) => i.id === id);
    if (index === -1) return null;
    db.menuItems[index] = { ...db.menuItems[index], ...updates };
    this.saveDB(db);
    return db.menuItems[index];
  }

  deleteMenuItem(id: string): boolean {
    const db = this.getDB();
    const index = db.menuItems.findIndex((i: MenuItem) => i.id === id);
    if (index === -1) return false;
    db.menuItems.splice(index, 1);
    this.saveDB(db);
    return true;
  }

  bulkUpdateMenuItems(updates: { id: string; updates: Partial<MenuItem> }[]): boolean {
    const db = this.getDB();
    updates.forEach(({ id, updates: itemUpdates }) => {
      const index = db.menuItems.findIndex((i: MenuItem) => i.id === id);
      if (index !== -1) {
        db.menuItems[index] = { ...db.menuItems[index], ...itemUpdates };
      }
    });
    this.saveDB(db);
    return true;
  }

  // Branches
  getBranches(enabled?: boolean): Branch[] {
    const branches = this.getDB().branches;
    return enabled !== undefined
      ? branches.filter((b: Branch) => b.enabled === enabled)
      : branches;
  }

  getBranch(id: string): Branch | null {
    return this.getDB().branches.find((b: Branch) => b.id === id) || null;
  }

  addBranch(branch: Omit<Branch, 'id'>): Branch {
    const db = this.getDB();
    
    // Check if this is a seed branch and use predefined IDs
    const branchName = branch.translations.en.name;
    let branchId = `branch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Use fixed IDs for seed branches to match mockData
    if (branchName === 'eChefs Downtown') {
      branchId = 'branch-1';
    } else if (branchName === 'eChefs Riverside' || branchName === 'eChefs Mall Plaza') {
      branchId = 'branch-2';
    } else if (branchName === 'eChefs Garden' || branchName === 'eChefs Airport Terminal') {
      branchId = 'branch-3';
    }
    
    const newBranch: Branch = {
      ...branch,
      id: branchId,
    };
    db.branches.push(newBranch);
    this.saveDB(db);
    return newBranch;
  }

  updateBranch(id: string, updates: Partial<Branch>): Branch | null {
    const db = this.getDB();
    const index = db.branches.findIndex((b: Branch) => b.id === id);
    if (index === -1) return null;
    db.branches[index] = { ...db.branches[index], ...updates };
    this.saveDB(db);
    return db.branches[index];
  }

  deleteBranch(id: string): boolean {
    const db = this.getDB();
    const index = db.branches.findIndex((b: Branch) => b.id === id);
    if (index === -1) return false;
    db.branches.splice(index, 1);
    this.saveDB(db);
    return true;
  }

  // Orders
  getOrders(filters?: {
    branchId?: string;
    status?: Order['status'];
    customerId?: string;
    date?: string;
  }): Order[] {
    let orders = this.getDB().orders;

    if (filters) {
      if (filters.branchId) {
        orders = orders.filter((o: Order) => o.branchId === filters.branchId);
      }
      if (filters.status) {
        orders = orders.filter((o: Order) => o.status === filters.status);
      }
      if (filters.customerId) {
        orders = orders.filter((o: Order) => o.customerId === filters.customerId);
      }
      if (filters.date) {
        orders = orders.filter((o: Order) => o.createdAt.startsWith(filters.date));
      }
    }

    return orders.sort((a: Order, b: Order) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getOrder(id: string): Order | null {
    return this.getDB().orders.find((o: Order) => o.id === id) || null;
  }

  createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const db = this.getDB();
    const settings = db.settings;
    const orderCount = db.orders.filter((o: Order) => 
      o.createdAt.startsWith(new Date().toISOString().split('T')[0])
    ).length + 1;

    const newOrder: Order = {
      ...order,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: `${settings.orderSettings.orderNumberPrefix}${orderCount.toString().padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.orders.push(newOrder);
    this.saveDB(db);
    return newOrder;
  }

  updateOrder(id: string, updates: Partial<Order>): Order | null {
    const db = this.getDB();
    const index = db.orders.findIndex((o: Order) => o.id === id);
    if (index === -1) return null;
    db.orders[index] = {
      ...db.orders[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveDB(db);
    return db.orders[index];
  }

  // Settings
  getSettings(): SystemSettings {
    return this.getDB().settings;
  }

  updateSettings(updates: Partial<SystemSettings>): SystemSettings {
    const db = this.getDB();
    db.settings = { ...db.settings, ...updates };
    this.saveDB(db);
    return db.settings;
  }

  // Promotions
  getPromotions(active?: boolean): Promotion[] {
    const promotions = this.getDB().promotions;
    if (!active) return promotions;

    const now = new Date();
    return promotions.filter((p: Promotion) => {
      if (!p.enabled) return false;
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      return now >= start && now <= end;
    });
  }

  addPromotion(promotion: Omit<Promotion, 'id' | 'usageCount'>): Promotion {
    const db = this.getDB();
    const newPromotion: Promotion = {
      ...promotion,
      id: `promo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      usageCount: 0,
    };
    db.promotions.push(newPromotion);
    this.saveDB(db);
    return newPromotion;
  }

  updatePromotion(id: string, updates: Partial<Promotion>): Promotion | null {
    const db = this.getDB();
    const index = db.promotions.findIndex((p: Promotion) => p.id === id);
    if (index === -1) return null;
    db.promotions[index] = { ...db.promotions[index], ...updates };
    this.saveDB(db);
    return db.promotions[index];
  }

  deletePromotion(id: string): boolean {
    const db = this.getDB();
    const index = db.promotions.findIndex((p: Promotion) => p.id === id);
    if (index === -1) return false;
    db.promotions.splice(index, 1);
    this.saveDB(db);
    return true;
  }

  // Loyalty
  getLoyaltyCard(userId: string): LoyaltyCard | null {
    return this.getDB().loyaltyCards.find((lc: LoyaltyCard) => lc.userId === userId) || null;
  }

  createLoyaltyCard(userId: string): LoyaltyCard {
    const db = this.getDB();
    const newCard: LoyaltyCard = {
      id: `loyalty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      points: 0,
      tier: 'bronze',
      lifetimePoints: 0,
      transactions: [],
    };
    db.loyaltyCards.push(newCard);
    this.saveDB(db);
    return newCard;
  }

  addLoyaltyPoints(userId: string, points: number, description: string, orderId?: string): LoyaltyCard | null {
    const db = this.getDB();
    const card = db.loyaltyCards.find((lc: LoyaltyCard) => lc.userId === userId);
    if (!card) return null;

    card.points += points;
    card.lifetimePoints += points;
    card.transactions.push({
      id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'earn',
      points,
      orderId,
      description,
      timestamp: new Date(),
    });

    // Update tier based on lifetime points
    const settings = db.settings.loyalty;
    if (card.lifetimePoints >= 5000) card.tier = 'platinum';
    else if (card.lifetimePoints >= 2000) card.tier = 'gold';
    else if (card.lifetimePoints >= 500) card.tier = 'silver';
    else card.tier = 'bronze';

    this.saveDB(db);
    return card;
  }

  // Utility methods
  calculateOrderTotal(items: any[], applyTax = true): { subtotal: number; tax: number; total: number } {
    const subtotal = items.reduce((sum, item) => {
      let itemPrice = item.price;
      item.modifiers?.forEach((mod: any) => {
        itemPrice += mod.option?.price || 0;
      });
      return sum + (itemPrice * item.quantity);
    }, 0);

    const settings = this.getSettings();
    const tax = applyTax && settings.tax.enabled ? subtotal * (settings.tax.rate / 100) : 0;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  }

  // User Management
  getUsers(): User[] {
    const db = this.getDB();
    return db.users || [];
  }

  getUser(userId: string): User | null {
    const db = this.getDB();
    return db.users?.find((u: User) => u.id === userId) || null;
  }

  createUser(user: User): User {
    const db = this.getDB();
    if (!db.users) db.users = [];
    db.users.push(user);
    this.saveDB(db);
    return user;
  }

  updateUser(userId: string, updates: Partial<User>): User | null {
    const db = this.getDB();
    const userIndex = db.users?.findIndex((u: User) => u.id === userId);
    if (userIndex === -1 || userIndex === undefined) return null;

    db.users[userIndex] = { ...db.users[userIndex], ...updates };
    this.saveDB(db);
    return db.users[userIndex];
  }

  deleteUser(userId: string): boolean {
    const db = this.getDB();
    const initialLength = db.users?.length || 0;
    db.users = db.users?.filter((u: User) => u.id !== userId) || [];
    this.saveDB(db);
    return db.users.length < initialLength;
  }
}

export const db = new DatabaseService();