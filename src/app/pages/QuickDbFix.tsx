import { useNavigate } from 'react-router';
import { db } from '../lib/database';
import { seedDatabase } from '../lib/seedData';
import { toast } from 'sonner';

/**
 * Quick Database Fix
 * One-click solution to fix database issues
 */
export function QuickDbFix() {
  const navigate = useNavigate();

  const handleQuickFix = () => {
    try {
      console.log('🔧 Starting Quick Fix...');
      
      // Step 1: Clear everything
      localStorage.clear();
      console.log('✅ Step 1: Cleared localStorage');
      
      // Step 2: Set version
      localStorage.setItem('echefs_db_version', '3.3');
      console.log('✅ Step 2: Set database version to 3.3');
      
      // Step 3: Seed database
      seedDatabase();
      console.log('✅ Step 3: Seeded database');
      
      // Step 4: Verify data
      const branches = db.getBranches();
      const categories = db.getCategories();
      const menuItems = db.getMenuItems();
      
      console.log('📊 Verification:');
      console.log(`  - Branches: ${branches.length}`);
      console.log(`  - Categories: ${categories.length}`);
      console.log(`  - Menu Items: ${menuItems.length}`);
      
      if (branches.length > 0 && categories.length > 0 && menuItems.length > 0) {
        toast.success('✅ Database fixed successfully! Reloading...');
        setTimeout(() => {
          // Reload the page to reinitialize AppContext with fresh data
          window.location.href = '/database-check';
        }, 1500);
      } else {
        toast.error('⚠️ Database seeded but data is missing');
      }
    } catch (error) {
      console.error('❌ Error during quick fix:', error);
      toast.error('Error: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Quick Database Fix</h1>
        <p className="text-gray-600 mb-8">
          Can't see the data? Click the button below to initialize the database with sample data.
        </p>
        
        <button
          onClick={handleQuickFix}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 mb-4"
        >
          🔧 Fix Database Now
        </button>
        
        <button
          onClick={() => navigate('/database-check')}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all"
        >
          View Database Status
        </button>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            This will:
          </p>
          <ul className="mt-3 text-sm text-gray-600 space-y-1">
            <li>✅ Clear old data</li>
            <li>✅ Initialize 3 branches</li>
            <li>✅ Add 15 categories</li>
            <li>✅ Add 20+ menu items</li>
            <li>✅ Create demo users</li>
          </ul>
        </div>
      </div>
    </div>
  );
}