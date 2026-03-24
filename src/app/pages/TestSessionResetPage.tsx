import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { useCheckIn } from '../contexts/CheckInContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export function TestSessionResetPage() {
  const navigate = useNavigate();
  const { 
    selectedTable, 
    selectedRegion, 
    deliveryAddress, 
    pickupTime, 
    cart,
    appliedPromotion,
    resetOrderSession 
  } = useApp();
  const { currentRequest, resetCheckIn } = useCheckIn();

  const [testResults, setTestResults] = useState<Array<{ test: string; passed: boolean; message: string }>>([]);

  useEffect(() => {
    checkSessionState();
  }, [selectedTable, selectedRegion, deliveryAddress, pickupTime, cart, appliedPromotion, currentRequest]);

  const checkSessionState = () => {
    const results = [];

    // Check localStorage
    const tableInStorage = localStorage.getItem('echefs_table');
    const regionInStorage = localStorage.getItem('echefs_region');

    results.push({
      test: 'Table in State',
      passed: selectedTable === null,
      message: selectedTable ? `❌ Table is set: ${selectedTable}` : '✅ Table is null'
    });

    results.push({
      test: 'Table in localStorage',
      passed: tableInStorage === null,
      message: tableInStorage ? `❌ Table in storage: ${tableInStorage}` : '✅ Storage is clean'
    });

    results.push({
      test: 'Region in State',
      passed: selectedRegion === null,
      message: selectedRegion ? `❌ Region is set: ${selectedRegion}` : '✅ Region is null'
    });

    results.push({
      test: 'Delivery Address',
      passed: deliveryAddress === null,
      message: deliveryAddress ? `❌ Address is set: ${deliveryAddress}` : '✅ Address is null'
    });

    results.push({
      test: 'Pickup Time',
      passed: pickupTime === null,
      message: pickupTime ? `❌ Time is set: ${pickupTime}` : '✅ Time is null'
    });

    results.push({
      test: 'Cart',
      passed: cart.length === 0,
      message: cart.length > 0 ? `❌ Cart has ${cart.length} items` : '✅ Cart is empty'
    });

    results.push({
      test: 'Promotion',
      passed: appliedPromotion === null,
      message: appliedPromotion ? `❌ Promotion applied: ${appliedPromotion.code}` : '✅ No promotion'
    });

    results.push({
      test: 'Check-in Request',
      passed: currentRequest === null,
      message: currentRequest ? `❌ Request active: ${currentRequest.status}` : '✅ No check-in request'
    });

    setTestResults(results);
  };

  const handleResetSession = () => {
    console.log('🧪 Testing resetOrderSession()...');
    resetOrderSession();
    console.log('🧪 Testing resetCheckIn()...');
    resetCheckIn();
    
    setTimeout(() => {
      checkSessionState();
    }, 100);
  };

  const allTestsPassed = testResults.every(r => r.passed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-gradient-to-r from-[#667c67] to-[#526250] text-white">
          <h1 className="text-3xl font-bold mb-2">🧪 Session Reset Test Page</h1>
          <p className="text-white/80">
            Test the resetOrderSession() and resetCheckIn() functions
          </p>
        </Card>

        {/* Overall Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Overall Status</h2>
              <p className="text-gray-600">
                {allTestsPassed 
                  ? '✅ All session data is clean - ready for new order!' 
                  : '⚠️ Some session data is still present'
                }
              </p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              allTestsPassed ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              {allTestsPassed ? (
                <CheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-yellow-600" />
              )}
            </div>
          </div>
        </Card>

        {/* Test Results */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.passed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {result.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-semibold">{result.test}</p>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  </div>
                  <Badge className={result.passed ? 'bg-green-600' : 'bg-red-600'}>
                    {result.passed ? 'PASS' : 'FAIL'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Current State Display */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Current State Values</h2>
          <div className="grid grid-cols-2 gap-4 font-mono text-sm">
            <div>
              <p className="text-gray-500">selectedTable:</p>
              <p className="font-bold">{selectedTable || 'null'}</p>
            </div>
            <div>
              <p className="text-gray-500">selectedRegion:</p>
              <p className="font-bold">{selectedRegion || 'null'}</p>
            </div>
            <div>
              <p className="text-gray-500">deliveryAddress:</p>
              <p className="font-bold">{deliveryAddress || 'null'}</p>
            </div>
            <div>
              <p className="text-gray-500">pickupTime:</p>
              <p className="font-bold">{pickupTime || 'null'}</p>
            </div>
            <div>
              <p className="text-gray-500">cart.length:</p>
              <p className="font-bold">{cart.length}</p>
            </div>
            <div>
              <p className="text-gray-500">appliedPromotion:</p>
              <p className="font-bold">{appliedPromotion?.code || 'null'}</p>
            </div>
            <div>
              <p className="text-gray-500">currentRequest:</p>
              <p className="font-bold">{currentRequest?.status || 'null'}</p>
            </div>
            <div>
              <p className="text-gray-500">localStorage.table:</p>
              <p className="font-bold">{localStorage.getItem('echefs_table') || 'null'}</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleResetSession}
            size="lg"
            className="bg-[#667c67] hover:bg-[#526250] h-16 text-lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Reset Session (Test Functions)
          </Button>
          
          <Button
            onClick={() => navigate('/branch-selection')}
            size="lg"
            variant="outline"
            className="h-16 text-lg"
          >
            Back to App
          </Button>
        </div>

        {/* Instructions */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold mb-2 text-blue-900">📋 How to Use This Test Page</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>First, go through the app and create a dine-in order with a table</li>
            <li>Complete the order</li>
            <li>Come back to this page (/test-session-reset)</li>
            <li>Check if any session data is still present (red boxes = data present)</li>
            <li>Click "Reset Session" to test the reset functions</li>
            <li>All boxes should turn green after reset</li>
            <li>Check browser console for: "✅ Order session reset - ready for new order"</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
