import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router';
import { CheckCircle2, XCircle, AlertCircle, ChevronLeft } from 'lucide-react';

export function AdminDataTest() {
  const { branches, currentLanguage } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin')}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold">Data Verification Test</h1>
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Database Summary</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{branches.length}</div>
                <div className="text-sm text-blue-800">Branches</div>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {branches.reduce((sum, b) => sum + b.regions.length, 0)}
                </div>
                <div className="text-sm text-green-800">Total Regions</div>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {branches.reduce((sum, b) => sum + b.regions.reduce((s, r) => s + r.tables.length, 0), 0)}
                </div>
                <div className="text-sm text-purple-800">Total Tables</div>
              </div>
              <div className="bg-orange-100 p-4 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">
                  {branches.reduce((sum, b) => sum + b.regions.reduce((s, r) => s + r.tables.reduce((t, tb) => t + tb.seats, 0), 0), 0)}
                </div>
                <div className="text-sm text-orange-800">Total Seats</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branch Details */}
        {branches.map((branch) => (
          <Card key={branch.id} className="border-2 border-[#667c67]/20">
            <CardHeader className="bg-gradient-to-r from-[#e4dbc4] to-[#f0eadc]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#667c67]">
                    {branch.translations[currentLanguage]?.name || branch.translations.en.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {branch.translations[currentLanguage]?.address || branch.translations.en.address}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-[#667c67] text-white px-2 py-1 rounded">
                      ID: {branch.id}
                    </span>
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                      {branch.phone}
                    </span>
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                      {branch.email}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => navigate(`/admin/table-management?branchId=${branch.id}`)}
                    variant="default"
                    size="sm"
                  >
                    Manage Tables
                  </Button>
                  <Button
                    onClick={() => navigate(`/admin/branches/${branch.id}/edit`)}
                    variant="outline"
                    size="sm"
                  >
                    Edit Branch
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Regions */}
              {branch.regions.map((region) => (
                <div key={region.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {region.translations[currentLanguage] || region.translations.en}
                      </h4>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          Type: {region.type}
                        </span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          ID: {region.id}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Capacity: {region.capacity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#667c67]">
                        {region.tables.length}
                      </div>
                      <div className="text-xs text-gray-600">Tables</div>
                    </div>
                  </div>

                  {/* Tables Grid */}
                  <div className="grid grid-cols-5 gap-2 mt-3">
                    {region.tables.map((table) => (
                      <div
                        key={table.id}
                        className={`p-3 rounded-lg text-center border-2 ${
                          table.status === 'available'
                            ? 'bg-green-50 border-green-500'
                            : table.status === 'occupied'
                            ? 'bg-red-50 border-red-500'
                            : 'bg-gray-50 border-gray-300'
                        }`}
                      >
                        <div className="font-bold text-lg">#{table.number}</div>
                        <div className="text-xs text-gray-600">{table.seats} seats</div>
                        <div className="text-xs mt-1">
                          {table.nfcId ? (
                            <span className="flex items-center justify-center gap-1 text-blue-600">
                              <CheckCircle2 className="w-3 h-3" />
                              NFC
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-1 text-gray-400">
                              <XCircle className="w-3 h-3" />
                              No NFC
                            </span>
                          )}
                        </div>
                        {table.qrCode && (
                          <div className="text-[10px] text-gray-500 mt-1 truncate">
                            {table.qrCode}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* QR Data Test */}
                  {region.tables.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                      <div className="font-semibold mb-2">Sample QR Data (First Table):</div>
                      <pre className="overflow-x-auto">
                        {JSON.stringify(
                          {
                            branchId: branch.id,
                            branchName: branch.translations.en.name,
                            regionId: region.id,
                            regionName: region.translations.en,
                            tableId: region.tables[0].id,
                            tableNumber: region.tables[0].number,
                            seats: region.tables[0].seats,
                            nfcId: region.tables[0].nfcId,
                            url: `${window.location.origin}/branch/${branch.id}/region-selection?tableId=${region.tables[0].id}&regionId=${region.id}&tableNumber=${region.tables[0].number}`,
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Data Validation */}
        <Card className="border-2 border-blue-500">
          <CardHeader className="bg-blue-50">
            <h2 className="text-xl font-bold text-blue-900">Data Validation</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <DataCheck
                label="Branches exist"
                passed={branches.length > 0}
                value={`${branches.length} branches`}
              />
              <DataCheck
                label="All branches have regions"
                passed={branches.every((b) => b.regions.length > 0)}
                value={`${branches.filter((b) => b.regions.length > 0).length}/${branches.length} valid`}
              />
              <DataCheck
                label="All regions have tables"
                passed={branches.every((b) => b.regions.every((r) => r.tables.length > 0))}
                value={`All regions have tables`}
              />
              <DataCheck
                label="All tables have QR codes"
                passed={branches.every((b) =>
                  b.regions.every((r) => r.tables.every((t) => t.qrCode))
                )}
                value="QR codes present"
              />
              <DataCheck
                label="All tables have valid seats"
                passed={branches.every((b) =>
                  b.regions.every((r) => r.tables.every((t) => t.seats > 0))
                )}
                value="All seats valid"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DataCheck({ label, passed, value }: { label: string; passed: boolean; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded border">
      <div className="flex items-center gap-3">
        {passed ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-sm text-gray-600">{value}</span>
    </div>
  );
}
