/**
 * Database Integrity Verification Tool
 * Run this to verify all branches are using consistent IDs across the app
 */

import { db } from './database';

export function verifyDatabaseIntegrity() {
  console.log('\n🔍 DATABASE INTEGRITY CHECK\n');
  console.log('=' .repeat(50));
  
  // 1. Check branches in database
  const branches = db.getBranches();
  console.log('\n✅ Branches in Database:');
  branches.forEach(branch => {
    console.log(`  - ${branch.id}: ${branch.translations.en.name}`);
  });
  
  // 2. Verify expected IDs
  const expectedIds = ['branch-1', 'branch-2', 'branch-3'];
  const actualIds = branches.map(b => b.id);
  
  console.log('\n📋 Expected IDs:', expectedIds);
  console.log('📋 Actual IDs:', actualIds);
  
  const idsMatch = expectedIds.every(id => actualIds.includes(id));
  
  if (idsMatch) {
    console.log('\n✅ SUCCESS: All branch IDs match expected values!');
  } else {
    console.log('\n❌ ERROR: Branch ID mismatch!');
    console.log('Missing IDs:', expectedIds.filter(id => !actualIds.includes(id)));
    console.log('Extra IDs:', actualIds.filter(id => !expectedIds.includes(id)));
  }
  
  // 3. Check for duplicate IDs
  const duplicates = actualIds.filter((id, index) => actualIds.indexOf(id) !== index);
  if (duplicates.length > 0) {
    console.log('\n⚠️  WARNING: Duplicate branch IDs found:', duplicates);
  } else {
    console.log('\n✅ No duplicate branch IDs');
  }
  
  // 4. Check localStorage version
  const dbVersion = localStorage.getItem('echefs_db_version');
  console.log('\n📦 Database Version:', dbVersion || 'Not set');
  
  // 5. Summary
  console.log('\n' + '='.repeat(50));
  console.log('SUMMARY:');
  console.log(`- Total branches: ${branches.length}`);
  console.log(`- IDs match expected: ${idsMatch ? 'YES ✅' : 'NO ❌'}`);
  console.log(`- No duplicates: ${duplicates.length === 0 ? 'YES ✅' : 'NO ❌'}`);
  console.log(`- Database version: ${dbVersion || 'MISSING ⚠️'}`);
  console.log('='.repeat(50) + '\n');
  
  return {
    success: idsMatch && duplicates.length === 0,
    branches,
    issues: {
      missingIds: expectedIds.filter(id => !actualIds.includes(id)),
      extraIds: actualIds.filter(id => !expectedIds.includes(id)),
      duplicates,
    }
  };
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).verifyDatabase = verifyDatabaseIntegrity;
}

export default verifyDatabaseIntegrity;
