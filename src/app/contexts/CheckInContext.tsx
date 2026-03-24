import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CheckInStatus = 'idle' | 'requesting' | 'pending' | 'approved' | 'denied' | 'expired' | 'error';

export interface CheckInRequest {
  id: string;
  tableId: string;
  tableName: string;
  branchId: string;
  branchName: string;
  deviceId: string;
  status: CheckInStatus;
  requestedAt: number;
  expiresAt: number;
  approvedBy?: string;
  approvedAt?: number;
  deniedBy?: string;
  deniedAt?: number;
  token?: string;
  customerName?: string;
  seats?: number;
}

interface CheckInContextValue {
  currentRequest: CheckInRequest | null;
  activeRequests: CheckInRequest[];
  requestCheckIn: (tableId: string, tableName: string, branchId: string, branchName: string, method: 'qr' | 'nfc') => Promise<CheckInRequest>;
  cancelRequest: () => void;
  approveRequest: (requestId: string, staffId: string, staffName: string) => void;
  denyRequest: (requestId: string, staffId: string, staffName: string, reason?: string) => void;
  retryRequest: () => void;
  resetCheckIn: () => void;
  getDeviceId: () => string;
  tokenTTL: number;
  setTokenTTL: (ttl: number) => void;
}

const CheckInContext = createContext<CheckInContextValue | null>(null);

// Generate device fingerprint
function generateDeviceId(): string {
  const stored = localStorage.getItem('echefs_device_id');
  if (stored) return stored;
  
  const deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('echefs_device_id', deviceId);
  return deviceId;
}

// Generate random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate secure token
function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}

export function CheckInProvider({ children }: { children: ReactNode }) {
  const [currentRequest, setCurrentRequest] = useState<CheckInRequest | null>(null);
  const [activeRequests, setActiveRequests] = useState<CheckInRequest[]>([]);
  const [tokenTTL, setTokenTTL] = useState(45); // 45 seconds default
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const deviceId = generateDeviceId();

  // Polling for request status
  useEffect(() => {
    if (currentRequest && currentRequest.status === 'pending') {
      const interval = setInterval(() => {
        // Check if expired
        if (Date.now() > currentRequest.expiresAt) {
          setCurrentRequest({ ...currentRequest, status: 'expired' });
          clearInterval(interval);
          return;
        }

        // In production, poll server for status
        // For demo, check activeRequests state
        const updated = activeRequests.find(r => r.id === currentRequest.id);
        if (updated && updated.status !== 'pending') {
          setCurrentRequest(updated);
          clearInterval(interval);
        }
      }, 1000);

      setPollingInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [currentRequest?.id, currentRequest?.status, activeRequests]);

  const requestCheckIn = async (
    tableId: string,
    tableName: string,
    branchId: string,
    branchName: string,
    method: 'qr' | 'nfc'
  ): Promise<CheckInRequest> => {
    const request: CheckInRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tableId,
      tableName,
      branchId,
      branchName,
      deviceId,
      status: 'pending',
      requestedAt: Date.now(),
      expiresAt: Date.now() + tokenTTL * 1000,
    };

    // In production: POST to /api/checkin/request
    setCurrentRequest(request);
    setActiveRequests(prev => [request, ...prev]);

    return request;
  };

  const cancelRequest = () => {
    if (pollingInterval) clearInterval(pollingInterval);
    setCurrentRequest(null);
  };

  const approveRequest = (requestId: string, staffId: string, staffName: string) => {
    const token = generateToken();
    
    setActiveRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'approved' as CheckInStatus,
              approvedBy: staffName,
              approvedAt: Date.now(),
              token,
            }
          : req
      )
    );

    // Update current request if it's the active one
    if (currentRequest?.id === requestId) {
      setCurrentRequest(prev => prev ? {
        ...prev,
        status: 'approved',
        approvedBy: staffName,
        approvedAt: Date.now(),
        token,
      } : null);
    }

    // In production: POST /api/checkin/approve
    console.log(`Request ${requestId} approved by ${staffName} with token ${token}`);
  };

  const denyRequest = (requestId: string, staffId: string, staffName: string, reason?: string) => {
    setActiveRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'denied' as CheckInStatus,
              deniedBy: staffName,
              deniedAt: Date.now(),
            }
          : req
      )
    );

    // Update current request if it's the active one
    if (currentRequest?.id === requestId) {
      setCurrentRequest(prev => prev ? {
        ...prev,
        status: 'denied',
        deniedBy: staffName,
        deniedAt: Date.now(),
      } : null);
    }

    // In production: POST /api/checkin/deny
    console.log(`Request ${requestId} denied by ${staffName}. Reason: ${reason || 'N/A'}`);
  };

  const retryRequest = () => {
    if (currentRequest) {
      requestCheckIn(
        currentRequest.tableId,
        currentRequest.tableName,
        currentRequest.branchId,
        currentRequest.branchName,
        'qr'
      );
    }
  };

  const resetCheckIn = () => {
    if (pollingInterval) clearInterval(pollingInterval);
    setCurrentRequest(null);
    setActiveRequests([]);
  };

  const getDeviceId = () => deviceId;

  return (
    <CheckInContext.Provider
      value={{
        currentRequest,
        activeRequests,
        requestCheckIn,
        cancelRequest,
        approveRequest,
        denyRequest,
        retryRequest,
        resetCheckIn,
        getDeviceId,
        tokenTTL,
        setTokenTTL,
      }}
    >
      {children}
    </CheckInContext.Provider>
  );
}

export function useCheckIn() {
  const context = useContext(CheckInContext);
  if (!context) {
    throw new Error('useCheckIn must be used within CheckInProvider');
  }
  return context;
}