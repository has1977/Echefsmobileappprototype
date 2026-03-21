import { useState } from 'react';
import { useNavigate } from 'react-router';
import { db } from '../../lib/database';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { ChevronLeft, Plus, UtensilsCrossed, FolderTree, Coffee, Cake, Users } from 'lucide-react';
import type { MenuType } from '../../lib/types';

export function AdminMenuManagement() {
  const navigate = useNavigate();
  const { refreshData } = useApp();
  const [activeTab, setActiveTab] = useState<MenuType>('main');
  const [categories] = useState(db.getCategories());
  const [menuItems] = useState(db.getMenuItems({ enabled: true }));

  const menuTypes: { type: MenuType; label: string; icon: any }[] = [
    { type: 'main', label: 'Main Menu', icon: UtensilsCrossed },
    { type: 'business', label: 'Business Menu', icon: FolderTree },
    { type: 'kids', label: 'Kids Menu', icon: Users },
    { type: 'drinks', label: 'Drinks', icon: Coffee },
    { type: 'desserts', label: 'Desserts', icon: Cake },
  ];

  const getCategoriesForType = (type: MenuType) => {
    return categories.filter(c => c.menuType === type && c.enabled);
  };

  const getItemsForCategory = (categoryId: string) => {
    return menuItems.filter(i => i.categoryId === categoryId && i.enabled);
  };

  const getTotalItemsForType = (type: MenuType) => {
    return menuItems.filter(i => i.menuType === type && i.enabled).length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[#667c67] text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/admin')}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Menu Management</h1>
              <p className="text-sm text-white/80">Manage categories and menu items</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {menuTypes.map(({ type, label, icon: Icon }) => (
            <Card key={type}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#667c67]/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#667c67]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{getTotalItemsForType(type)}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Menu Type Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as MenuType)}>
          <TabsList className="grid w-full grid-cols-5">
            {menuTypes.map(({ type, label, icon: Icon }) => (
              <TabsTrigger key={type} value={type} className="gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {menuTypes.map(({ type }) => (
            <TabsContent key={type} value={type} className="space-y-4 mt-6">
              {/* Categories */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>
                      {getCategoriesForType(type).length} categories in {type} menu
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => navigate(`/admin/menu/categories/add?type=${type}`)}
                    className="bg-[#667c67] hover:bg-[#526250]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getCategoriesForType(type).length === 0 ? (
                      <div className="col-span-full text-center py-12 text-muted-foreground">
                        No categories yet. Add your first category to get started.
                      </div>
                    ) : (
                      getCategoriesForType(type).map((category) => (
                        <Card
                          key={category.id}
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => navigate(`/admin/menu/categories/${category.id}`)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-lg">
                                {category.translations.en || category.id}
                              </h3>
                              <Badge variant="secondary">
                                {getItemsForCategory(category.id).length} items
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div>Order: {category.order}</div>
                              <div className="flex items-center gap-2">
                                <span>Status:</span>
                                <Badge
                                  variant={category.enabled ? 'default' : 'secondary'}
                                  className={category.enabled ? 'bg-success' : ''}
                                >
                                  {category.enabled ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Menu Items */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Menu Items</CardTitle>
                    <CardDescription>
                      {getTotalItemsForType(type)} items in {type} menu
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => navigate(`/admin/menu/items/add?type=${type}`)}
                    className="bg-[#667c67] hover:bg-[#526250]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {menuItems.filter(i => i.menuType === type).length === 0 ? (
                      <div className="col-span-full text-center py-12 text-muted-foreground">
                        No menu items yet. Add your first item to get started.
                      </div>
                    ) : (
                      menuItems
                        .filter(i => i.menuType === type)
                        .map((item) => (
                          <Card
                            key={item.id}
                            className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                            onClick={() => navigate(`/admin/menu/items/${item.id}`)}
                          >
                            <div className="aspect-[4/3] bg-muted relative">
                              <img
                                src={item.imageUrl}
                                alt={item.translations.en?.name || ''}
                                className="w-full h-full object-cover"
                              />
                              {!item.available && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <Badge variant="destructive">Out of Stock</Badge>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-3">
                              <h3 className="font-semibold line-clamp-1 mb-1">
                                {item.translations.en?.name || item.id}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {item.translations.en?.description || ''}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-[#667c67]">
                                  ${item.price.toFixed(2)}
                                </span>
                                <div className="flex gap-1">
                                  {item.badges.slice(0, 2).map(badge => (
                                    <Badge key={badge} variant="secondary" className="text-xs">
                                      {badge}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Actions */}
        <Card className="bg-[#e4dbc4]/20 border-[#667c67]/20">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Plus className="w-5 h-5" />
                <span className="text-sm">Bulk Import</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <span className="text-xl">📥</span>
                <span className="text-sm">Export Menu</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <span className="text-xl">🎨</span>
                <span className="text-sm">Reorder Items</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <span className="text-xl">⚙️</span>
                <span className="text-sm">Menu Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
