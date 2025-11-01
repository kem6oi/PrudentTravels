# Account Suspension Feature

## Overview
The account suspension feature allows administrators to suspend user accounts (both travellers and support staff) when necessary. Suspended users cannot log in to the platform, and travellers receive email notifications when their accounts are suspended.

## Features

### For Administrators
- **Suspend Accounts**: Suspend traveller and support staff accounts with a reason
- **Unsuspend Accounts**: Restore access to previously suspended accounts
- **View Status**: See suspension status in the user management dashboard
- **Cannot Suspend Admins**: Admin accounts cannot be suspended for security reasons

### For Users
- **Login Prevention**: Suspended users cannot log in to their accounts
- **Email Notifications**: Travellers receive an email notification when their account is suspended
- **Suspension Page**: Suspended users are redirected to a dedicated page explaining the suspension
- **Support Contact**: Easy access to contact support for appeals

## How to Use

### Suspending a User Account

1. Log in as an administrator
2. Navigate to **Admin Dashboard** → **Manage Users**
3. Find the user you want to suspend
4. Click the **Suspend** button (🚫 icon) next to their name
5. In the modal that appears:
   - Enter a clear reason for the suspension
   - Click **Suspend Account**
6. The user will be immediately suspended
   - If they're a traveller, they'll receive an email notification
   - If they try to log in, they'll be redirected to the suspension page

### Unsuspending a User Account

1. Log in as an administrator
2. Navigate to **Admin Dashboard** → **Manage Users**
3. Find the suspended user (marked with a red "Suspended" badge)
4. Click the **Unsuspend** button (✓ icon) next to their name
5. Confirm the action
6. The user will immediately regain access to their account

## Technical Implementation

### Backend

#### Database Fields
Three new fields were added to the `Users` table:
- `isSuspended` (BOOLEAN): Indicates if the account is suspended
- `suspendedAt` (DATE): Timestamp of when the account was suspended
- `suspensionReason` (TEXT): Admin-provided reason for suspension

#### API Endpoints

**Suspend User**
```
PUT /api/v1/admin/users/:id/suspend
Body: { reason: "Violation of terms of service" }
```

**Unsuspend User**
```
PUT /api/v1/admin/users/:id/unsuspend
```

#### Login Logic
When a user attempts to log in:
1. Credentials are verified
2. Account active status is checked
3. **Suspension status is checked** (new)
4. If suspended, return 403 with suspension details
5. Otherwise, proceed with login

### Frontend

#### Routes
- `/suspended` - Dedicated page for suspended users

#### Components
- **UserManager**: Enhanced with suspend/unsuspend actions
- **Suspended Page**: Displays suspension information and contact options
- **Login Flow**: Handles suspension response and redirects appropriately

#### User Experience
When a suspended user tries to log in:
1. Login request is sent to the backend
2. Backend returns 403 with `suspended: true`
3. Frontend stores suspension info in localStorage
4. User is redirected to `/suspended` page
5. Page displays suspension reason and contact options

## Email Notification

Travellers receive a professional email when their account is suspended, which includes:
- Clear notification of suspension
- Date of suspension
- Reason for suspension (if provided)
- List of restrictions while suspended
- Instructions on how to contact support
- Appeal process information

**Note**: Support staff do not receive email notifications for suspension, as their access is managed internally.

## Migration

To add the suspension fields to your database, run the migration:

```bash
# Using Sequelize CLI
npx sequelize-cli db:migrate

# Or manually apply the migration
node backend/src/migrations/add-suspension-fields.js
```

## Security Considerations

1. **Admin Protection**: Admin accounts cannot be suspended to prevent lockout
2. **Authorization**: Only administrators can suspend/unsuspend accounts
3. **Audit Trail**: Suspension timestamps and reasons are stored for accountability
4. **Immediate Effect**: Suspension takes effect immediately to prevent unauthorized access

## Best Practices

### When to Suspend an Account
- Violation of terms of service
- Suspicious or fraudulent activity
- Multiple failed bookings or payments
- Customer complaints or disputes
- Pending investigation

### Suspension Reasons
Always provide a clear, professional reason:
- ✅ "Multiple failed payment attempts"
- ✅ "Violation of community guidelines"
- ✅ "Under investigation for fraudulent bookings"
- ❌ "Bad user"
- ❌ "Just because"

### Communication
- Be professional and concise in suspension reasons
- These reasons are visible to users via email
- Provide a clear path for users to appeal or contact support

## Troubleshooting

### User can't log in after unsuspension
- Clear browser cache and cookies
- Ensure `isSuspended` field is set to `false` in database
- Check for any other account restrictions (isActive, emailVerified)

### Email notification not sent
- Verify email service configuration
- Check email server logs
- Ensure user has a valid email address
- Note: Only travellers receive email notifications

### Suspension modal not working
- Check browser console for errors
- Ensure API endpoints are correctly configured
- Verify admin permissions

## Future Enhancements

Potential improvements for the suspension feature:
- Temporary suspensions with auto-expiry dates
- Suspension categories with predefined reasons
- Appeal system within the platform
- Suspension history and audit logs
- Bulk suspension actions
- Notification emails for support staff suspensions
