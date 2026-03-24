# QR/NFC Table Check-In System Guide

## Overview
This system implements a secure table check-in flow using:
1. **Static QR codes/NFC tags** with server-issued one-time tokens
2. **Manual table selection** from branch page
Both methods require staff confirmation before seating.

## How It Works

### Customer Flow (Mobile)

#### Method 1: QR Code / NFC Tap

1. **Scan/Tap**
   - Customer scans QR code or taps NFC tag on table
   - QR/NFC contains: `table_id` only (e.g., `/table-check-in?table=42&method=qr`)

2. **Request Token**
   - App automatically requests check-in token from server
   - Creates pending request with device fingerprint
   - Shows waiting screen with countdown timer (default 45 seconds)

3. **Wait for Approval**
   - Polls server every 1 second for status update
   - Shows animated countdown timer
   - Displays table information

4. **Receive Confirmation**
   - **Approved**: Auto-redirects to menu with table session
   - **Denied**: Shows retry and call staff options
   - **Expired**: Shows retry option

#### Method 2: Manual Table Selection (NEW)

1. **Navigate to Branch**
   - Customer opens app and selects branch from branch selection page

2. **Select Order Type**
   - Choose "Dine-In" (triggers table selection flow)
   - OR choose "Takeaway/Delivery" (goes directly to menu, no approval needed)

3. **Select Region & Table**
   - Browse available regions (Main Hall, VIP, Outdoor, etc.)
   - View table layout with color-coded availability
   - Select an available table

4. **Staff Approval Required**
   - After selecting table, redirected to check-in page
   - Request sent to staff for approval
   - Same waiting/approval flow as QR/NFC method

5. **Receive Confirmation**
   - **Approved**: Redirects to menu
   - **Denied/Expired**: Can retry or call staff

### Staff Dashboard

1. **Receive Notification**
   - New check-in requests appear in real-time
   - Shows pending count badge
   - Audio notification (if enabled)

2. **Review Request**
   - Table number and location
   - Device ID (fingerprint)
   - Timestamp
   - Time remaining countdown

3. **Approve or Deny**
   - Click "Approve" → generates single-use token
   - Click "Deny" → request marked as denied
   - Auto-expires after TTL (default 45s)

4. **Track History**
   - View all requests (pending, approved, denied, expired)
   - Filter and search
   - Audit log with staff name and timestamp

## Security Features

### Token System
- **Single-use**: Token can only be used once
- **Time-limited**: Expires after TTL (30-120 seconds, configurable)
- **Cryptographically random**: Server-generated secure token
- **Device-bound**: Linked to device fingerprint

### Rate Limiting
- Prevents spam requests from same device
- Table-specific rate limits
- Can be configured per branch

### Device Fingerprinting
- Unique ID generated and stored locally
- Helps track and prevent abuse
- Used for audit logging

## Routes

### Customer Routes
- `/table-check-in?table={id}&method={qr|nfc}` - Check-in page

### Staff Routes
- `/staff-check-in-dashboard` - Staff approval dashboard

## API Endpoints (Production Implementation)

### Customer Endpoints
```
POST /api/check-in/request
Body: { tableId, branchId, deviceId, method }
Response: { requestId, expiresAt, status }

GET /api/check-in/status/:requestId
Response: { status, token?, approvedBy?, deniedBy? }
```

### Staff Endpoints
```
GET /api/check-in/pending
Response: { requests: [...] }

POST /api/check-in/approve/:requestId
Body: { staffId, staffName }
Response: { success, token }

POST /api/check-in/deny/:requestId
Body: { staffId, staffName, reason }
Response: { success }
```

### Admin Endpoints
```
GET /api/check-in/settings
Response: { tokenTTL, rateLimit, ... }

PUT /api/check-in/settings
Body: { tokenTTL?, rateLimit?, ... }

POST /api/check-in/revoke/:requestId
Body: { reason, staffId }

GET /api/check-in/audit-log
Response: { logs: [...] }
```

## Settings (Staff Dashboard)

### Token TTL
- Minimum: 10 seconds
- Maximum: 120 seconds
- Default: 45 seconds
- Adjustable in real-time

### Notifications
- Toggle sound notifications
- Browser push notifications (optional)
- Email/SMS alerts (optional)

## Usage Instructions

### For Customers

1. Navigate to a table in the restaurant
2. Scan the QR code on the table OR tap your NFC-enabled phone on the tag
3. Wait for staff confirmation (10-45 seconds)
4. Once approved, you'll be redirected to the menu automatically
5. If denied or timeout, you can retry or call staff for help

### For Staff

1. Open the Staff Check-In Dashboard (`/staff-check-in-dashboard`)
2. View pending requests in real-time
3. Review table number, timestamp, and device info
4. Click "Approve" to confirm and seat customer
5. Click "Deny" if table is unavailable or suspicious request
6. View history and audit logs as needed

### For Admins

1. Access Settings panel in dashboard
2. Adjust Token TTL based on staff response time
3. Enable/disable notifications
4. View audit logs for security monitoring
5. Manually revoke active sessions if needed

## Integration with Existing QR/NFC Scanner

The existing QR/NFC scanner in `BranchSelectionPage` remains unchanged. The check-in system is triggered by:

1. **QR Code Format**: `/table-check-in?table={id}&method=qr`
2. **NFC Tag Data**: Same URL format

When scanned, the app:
- Navigates to `/table-check-in` route
- Reads `table` and `method` params
- Automatically initiates check-in request

## States & Status

### Check-In Request Status
- `idle` - No active request
- `requesting` - Sending request to server
- `pending` - Waiting for staff approval
- `approved` - Staff approved, token issued
- `denied` - Staff denied request
- `expired` - Request timed out
- `error` - System error occurred

## Components Created

### Contexts
- `CheckInContext` - Manages check-in state and API calls

### Pages
- `TableCheckInPage` - Customer-facing check-in flow
- `StaffCheckInDashboard` - Staff approval interface

### Features
- Real-time polling (production: use WebSockets)
- Animated countdown timers
- Progressive disclosure UI
- Error handling and retry logic
- Audit logging
- Role-based access control

## Future Enhancements

1. **WebSocket Integration**
   - Replace polling with real-time WebSocket connections
   - Instant status updates for customers

2. **Advanced Analytics**
   - Average approval time
   - Peak check-in hours
   - Staff performance metrics

3. **Multi-table Support**
   - Group/party check-ins
   - Table linking for large groups

4. **Queue Management**
   - Virtual queue for busy times
   - Estimated wait time display

5. **Loyalty Integration**
   - Auto-detect returning customers
   - Apply loyalty benefits on check-in

## Security Best Practices

1. **Always validate tokens server-side**
2. **Never expose token generation logic**
3. **Implement rate limiting per device/IP**
4. **Log all check-in attempts for audit**
5. **Use HTTPS for all API calls**
6. **Rotate device fingerprints periodically**
7. **Implement CAPTCHA for suspicious patterns**

## Support & Troubleshooting

### Customer Can't Check In
1. Verify QR code format is correct
2. Check network connectivity
3. Ensure table ID exists in system
4. Try NFC if QR fails (or vice versa)
5. Contact staff manually

### Staff Dashboard Not Updating
1. Refresh the page
2. Check WebSocket connection
3. Verify staff permissions
4. Check browser console for errors

### Token Expired Before Approval
1. Increase Token TTL in settings
2. Train staff for faster response
3. Consider automatic approval for trusted devices