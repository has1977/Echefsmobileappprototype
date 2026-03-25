import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { RefreshCw, Trash2, Database } from 'lucide-react';
import { toast } from 'sonner';

export function ResetDataPage() {
  const navigate = useNavigate();

  const handleClearData = () => {
    localStorage.clear();
    toast.success('All data cleared! Reloading...');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleClearMenuOnly = () => {
    const data = localStorage.getItem('echefs_db');
    if (data) {
      const db = JSON.parse(data);
      delete db.menuItems;
      delete db.categories;
      localStorage.setItem('echefs_db', JSON.stringify(db));
      toast.success('Menu data cleared! Reloading...');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const handleViewData = () => {
    const data = localStorage.getItem('echefs_db');
    if (data) {
      const db = JSON.parse(data);
      console.log('📊 Current Database:', db);
      console.log('📋 Menu Items:', db.menuItems);
      console.log('🔢 Total Items:', db.menuItems?.length || 0);
      
      // Check for items with new features
      const itemsWithDiscount = db.menuItems?.filter((item: any) => item.originalPrice) || [];
      const itemsWithCalories = db.menuItems?.filter((item: any) => item.calories) || [];
      const itemsWithPrepTime = db.menuItems?.filter((item: any) => item.prepTime) || [];
      const itemsWithDietary = db.menuItems?.filter((item: any) => item.dietaryTags?.length > 0) || [];
      const itemsWithFeatured = db.menuItems?.filter((item: any) => item.badges?.includes('featured')) || [];
      
      console.log('💰 Items with discount:', itemsWithDiscount.length, itemsWithDiscount);
      console.log('🔥 Items with calories:', itemsWithCalories.length);
      console.log('⏱️ Items with prep time:', itemsWithPrepTime.length);
      console.log('🌱 Items with dietary tags:', itemsWithDietary.length);
      console.log('⭐ Items with featured badge:', itemsWithFeatured.length);
      
      toast.success('Data logged to console! Check browser console (F12)');
    } else {
      toast.error('No data found!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Database Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and reset application data</p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Database className="w-5 h-5" />
                View Current Data
              </h2>
              <p className="text-sm text-blue-700 mb-3">
                Check the browser console to see all database content and statistics
              </p>
              <Button
                onClick={handleViewData}
                className="w-full"
                variant="outline"
              >
                <Database className="w-4 h-4 mr-2" />
                View Data in Console
              </Button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h2 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Reset Menu Data Only
              </h2>
              <p className="text-sm text-amber-700 mb-3">
                Clear only menu items and categories. This will reload fresh menu data with all new features.
              </p>
              <Button
                onClick={handleClearMenuOnly}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Menu Data
              </Button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Clear All Data
              </h2>
              <p className="text-sm text-red-700 mb-3">
                This will clear ALL application data including settings, orders, and menu items. The app will reload with fresh data.
              </p>
              <Button
                onClick={handleClearData}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
