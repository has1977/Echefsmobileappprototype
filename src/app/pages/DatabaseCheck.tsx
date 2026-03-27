import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { db } from '../lib/database';
import { seedDatabase } from '../lib/seedData';
import { ArrowLeft, Database, AlertCircle, CheckCircle, RefreshCw, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

/**
 * Database Check Page
 * Helps diagnose database connection and data issues
 */
export function DatabaseCheck() {
  const navigate = useNavigate();
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rawLocalStorage, setRawLocalStorage] = useState<any>(null);

  const loadDatabaseInfo = () => {
    setLoading(true);
    try {
      console.log('🔍 Loading database info...');
      
      // Get all data from localStorage
      const rawData = localStorage.getItem('echefs_db');
      const parsedData = rawData ? JSON.parse(rawData) : null;
      
      console.log('📦 Raw localStorage data:', rawData ? 'EXISTS' : 'EMPTY');
      console.log('📊 Parsed data:', parsedData);
      
      // Save raw data for debugging
      setRawLocalStorage(parsedData);
      
      // Get database info
      const branches = db.getBranches();
      const categories = db.getCategories();
      const menuItems = db.getMenuItems();
      const orders = db.getOrders();
      const users = db.getUsers();
      const languages = db.getLanguages();
      const settings = db.getSettings();
      
      console.log('🏢 Branches:', branches);
      console.log('📋 Categories:', categories);
      console.log('🍽️ Menu Items:', menuItems);
      console.log('📦 Orders:', orders);
      console.log('👥 Users:', users);
      console.log('🌍 Languages:', languages);
      
      const info = {
        hasData: !!parsedData,
        dbVersion: localStorage.getItem('echefs_db_version'),
        branches: branches,
        categories: categories,
        menuItems: menuItems,
        orders: orders,
        users: users,
        languages: languages,
        settings: settings,
        localStorageSize: rawData ? (rawData.length / 1024).toFixed(2) : '0',
        totalKeys: Object.keys(localStorage).length,
      };
      
      console.log('✅ Database info loaded:', info);
      setDbInfo(info);
    } catch (error) {
      console.error('❌ Error loading database info:', error);
      toast.error('Error loading database info: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseInfo();
  }, []);

  const handleSeedDatabase = () => {
    try {
      setLoading(true);
      
      // Clear everything first
      localStorage.clear();
      console.log('🗑️ Cleared localStorage');
      
      // Set version
      localStorage.setItem('echefs_db_version', '3.3');
      
      // Seed database
      seedDatabase();
      console.log('✅ Database seeded successfully');
      
      // Reload info
      loadDatabaseInfo();
      
      toast.success('Database seeded successfully! 🎉');
    } catch (error) {
      console.error('❌ Error seeding database:', error);
      toast.error('Error seeding database: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearDatabase = () => {
    if (!confirm('⚠️ This will delete ALL data. Continue?')) {
      return;
    }
    
    try {
      localStorage.clear();
      toast.success('Database cleared!');
      loadDatabaseInfo();
    } catch (error) {
      toast.error('Error clearing database');
    }
  };

  if (loading && !dbInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#667c67] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading database info...</p>
        </div>
      </div>
    );
  }

  const hasAllData = dbInfo?.branches?.length > 0 && 
                     dbInfo?.categories?.length > 0 && 
                     dbInfo?.menuItems?.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#667c67] to-[#556856] p-5 pb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Database Check</h1>
            <p className="text-sm text-white/80 mt-1">Check database connection and data</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6 max-w-4xl mx-auto">
        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              hasAllData 
                ? 'bg-gradient-to-br from-green-600 to-green-800' 
                : 'bg-gradient-to-br from-red-600 to-red-800'
            }`}>
              {hasAllData ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <AlertCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {hasAllData ? 'Database Connected ✅' : 'Database Empty ⚠️'}
              </h2>
              <p className="text-sm text-gray-600">
                {hasAllData 
                  ? 'All data is loaded and available' 
                  : 'No data found - seed database to get started'
                }
              </p>
            </div>
          </div>

          {/* Database Version */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Database Version:</span>
              <span className="text-sm font-semibold text-gray-900">{dbInfo?.dbVersion || 'Not Set'}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Storage Size:</span>
              <span className="text-sm font-semibold text-gray-900">{dbInfo?.localStorageSize} KB</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Total Keys:</span>
              <span className="text-sm font-semibold text-gray-900">{dbInfo?.totalKeys}</span>
            </div>
          </div>
        </div>

        {/* Data Statistics */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-[#667c67]" />
            <h2 className="text-lg font-bold text-gray-900">Data Statistics</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
              <div className="text-3xl font-bold text-purple-700">{dbInfo?.branches?.length || 0}</div>
              <div className="text-sm text-purple-600 mt-1">Branches</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
              <div className="text-3xl font-bold text-blue-700">{dbInfo?.categories?.length || 0}</div>
              <div className="text-sm text-blue-600 mt-1">Categories</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
              <div className="text-3xl font-bold text-green-700">{dbInfo?.menuItems?.length || 0}</div>
              <div className="text-sm text-green-600 mt-1">Menu Items</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
              <div className="text-3xl font-bold text-orange-700">{dbInfo?.orders?.length || 0}</div>
              <div className="text-sm text-orange-600 mt-1">Orders</div>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border-2 border-pink-200">
              <div className="text-3xl font-bold text-pink-700">{dbInfo?.users?.length || 0}</div>
              <div className="text-sm text-pink-600 mt-1">Users</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border-2 border-indigo-200">
              <div className="text-3xl font-bold text-indigo-700">{dbInfo?.languages?.length || 0}</div>
              <div className="text-sm text-indigo-600 mt-1">Languages</div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        {dbInfo?.branches?.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-3">📍 Branches</h3>
            <div className="space-y-2">
              {dbInfo.branches.map((branch: any) => (
                <div key={branch.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900">{branch.translations.en.name}</div>
                      <div className="text-xs text-gray-600">{branch.translations.ar.name}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {branch.id}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      branch.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {branch.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
          
          <div className="space-y-3">
            <Button
              onClick={loadDatabaseInfo}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              size="lg"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>

            <Button
              onClick={handleSeedDatabase}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              size="lg"
            >
              <Database className="w-5 h-5 mr-2" />
              {hasAllData ? 'Re-seed Database (Reset)' : 'Seed Database (Initialize)'}
            </Button>

            <Button
              onClick={handleClearDatabase}
              disabled={loading}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-3">ℹ️ About the Database</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• This app uses <strong>localStorage</strong> as the database (no external database required)</p>
            <p>• All data is stored locally in your browser</p>
            <p>• Click "Seed Database" to initialize with sample data</p>
            <p>• The database includes: branches, menu items, categories, orders, users, and settings</p>
            <p>• You can clear data anytime and re-seed when needed</p>
          </div>
        </div>
      </div>
    </div>
  );
}