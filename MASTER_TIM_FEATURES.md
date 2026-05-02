# Master Tim (Team Manager) - Feature Documentation

## Overview
Master Tim is a comprehensive team member management feature that allows users to create, view, edit, and delete team members (anggota tim) across different departments in a project monitoring dashboard.

## Features Implemented

### 1. **Team Member Display**
- Grid-based layout showing all team members as cards
- Each card displays:
  - Member initials in a colored avatar
  - Full name and job title/role
  - Email and phone number
  - Department and status badges
  - Skills tags (up to 3 with overflow indicator)
  - Edit and delete action buttons

### 2. **Search & Filter**
- Real-time search by:
  - Name
  - Email
  - Phone number
- Filter by department:
  - Engineering
  - Design
  - Business
  - QA
  - PMO
  - Other (Lainnya)

### 3. **Create Team Member**
- Modal form with fields:
  - Department (dropdown)
  - Status (Active, Inactive, Pending)
  - Full Name (required)
  - Job Title/Role (required)
  - Email (required, auto-disabled in edit mode)
  - Phone Number
  - Skills (multi-add with Enter or + button)
- Form validation
- Success/error handling

### 4. **Edit Team Member**
- Click card or edit button to open edit modal
- Pre-populated form with existing data
- Email field is disabled (cannot edit email)
- Can update all other fields
- Real-time status change
- Skills can be added/removed

### 5. **Delete Team Member**
- Confirmation modal before deletion
- Prevents accidental deletion
- Success/error handling
- Automatic list refresh after deletion

## File Structure

```
src/
├── presentation/
│   ├── components/
│   │   ├── TeamCard.tsx          # Individual team member card component
│   │   ├── TeamModal.tsx         # Add/Edit form modal
│   │   ├── DeleteConfirmationModal.tsx  # Delete confirmation
│   │   └── index.ts              # Exports
│   ├── features/
│   │   └── TeamManager.tsx       # Main feature component with search/filter
│   └── layouts/
│       └── index.ts
├── use-cases/
│   └── hooks/
│       ├── useUser.ts            # React Query hooks for user operations
│       └── index.ts
├── infrastructure/
│   └── repositories/
│       ├── user.repo.ts          # API calls for user management
│       └── index.ts
├── core/
│   └── entities/
│       └── User.ts               # TypeScript interfaces
└── app/
    ├── (dashboard)/
    │   └── master-tim/
    │       └── page.tsx          # Master Tim page
    └── team.css                  # Styling
```

## Components Detail

### TeamManager.tsx
Main component that orchestrates the feature:
- Manages state for modal open/close
- Handles search and filter logic
- Renders team cards grid
- Opens modals for add/edit/delete operations

### TeamCard.tsx
Individual card component:
- Displays member information
- Shows avatar with initials
- Lists contact info
- Shows skills
- Has edit/delete action buttons
- Clickable header to open edit modal

### TeamModal.tsx
Form modal for adding/editing members:
- Two modes: "Add" and "Edit"
- Form validation
- Handles skill addition/removal
- Disables email field in edit mode
- Uses React Query mutations for API calls

### DeleteConfirmationModal.tsx
Confirmation dialog for deletion:
- Shows warning message
- Requires confirmation before deletion
- Handles loading state during deletion
- Calls delete mutation and refreshes list

## API Integration

### Endpoints Used
- **GET** `/api/users/get-all` - Fetch all users
- **GET** `/api/users/getby/:id` - Fetch specific user
- **POST** `/api/users/post` - Create new user
- **PUT** `/api/users/put/:id` - Update user
- **DELETE** `/api/users/delete/:id` - Delete user

### React Query Hooks
```typescript
// Fetch all users
useSemuaUser()

// Get single user
useUserDetail(id: string)

// Create user
useCreateUser()

// Update user
useUpdateUser()

// Delete user
useDeleteUser()
```

## Styling

### CSS Classes

#### Team Manager Container
- `.team-manager` - Main wrapper
- `.tm-header` - Header section
- `.tm-title` - Page title
- `.tm-subtitle` - Page subtitle
- `.tm-filters-container` - Search and filter area
- `.tm-search` - Search input wrapper
- `.tm-select-dept` - Department dropdown
- `.tm-content` - Content area
- `.team-grid` - Cards grid layout

#### Team Card
- `.team-card` - Card container
- `.tc-header` - Card header with avatar
- `.tc-avatar` - Avatar element
- `.tc-info` - Name and role
- `.tc-name` - Member name
- `.tc-role` - Job title
- `.tc-contact` - Contact information
- `.tc-contact-item` - Email/phone item
- `.tc-badges-row` - Department and status badges
- `.dept-badge` - Department badge
- `.status-badge` - Status badge
- `.tc-skills` - Skills container
- `.skill-pill` - Individual skill tag
- `.tc-actions` - Action buttons
- `.tc-action-btn` - Action button
- `.tc-action-edit` - Edit button
- `.tc-action-delete` - Delete button

#### Modal
- `.modal-overlay` - Modal backdrop
- `.modal-content` - Modal content box
- `.modal-header` - Modal header
- `.modal-title` - Modal title
- `.modal-body` - Modal body (form)
- `.modal-footer` - Modal footer (buttons)
- `.modal-confirm` - Confirmation modal style
- `.modal-delete-icon` - Delete icon
- `.modal-message` - Message text

### Avatar Colors
Auto-generated based on member name hash:
- `.bg-red`
- `.bg-blue`
- `.bg-green`
- `.bg-yellow`
- `.bg-purple`
- `.bg-pink`
- `.bg-indigo`
- `.bg-teal`

## User Flow

### Adding a Team Member
1. User clicks "+ Tambah Anggota" button
2. Modal opens in "Add" mode with empty form
3. User fills in required fields:
   - Department
   - Full Name
   - Job Title/Role
   - Email
4. Optional fields:
   - Phone
   - Skills (can add multiple)
   - Status
5. User clicks "Simpan"
6. Form validates and sends POST request
7. List refreshes automatically (React Query)
8. Modal closes on success

### Editing a Team Member
1. User clicks on card or edit button (✎)
2. Modal opens in "Edit" mode with pre-filled data
3. User modifies desired fields
4. Email field is disabled/read-only
5. User can add/remove skills
6. User clicks "Simpan"
7. Form sends PUT request with changes
8. List refreshes
9. Modal closes

### Deleting a Team Member
1. User clicks delete button (🗑️)
2. Delete confirmation modal appears
3. Shows warning message
4. User must click "Hapus" to confirm
5. API sends DELETE request
6. List refreshes automatically
7. Modal closes

### Searching & Filtering
1. Type in search box to filter by:
   - Name
   - Email
   - Phone
2. Select department from dropdown
3. Cards update in real-time
4. Multiple filters work together

## Error Handling

- API errors are caught and displayed as alerts
- Invalid form data prevents submission
- Missing required fields are highlighted
- Network errors are handled gracefully
- Loading states prevent multiple submissions

## Performance Optimization

- React Query caching for API responses
- Automatic invalidation after mutations
- Lazy loading with proper key management
- Efficient re-renders using proper dependency arrays
- Memoization for color/class calculations

## Browser Support

- Modern browsers with ES2020+ support
- React 18+
- TypeScript 5+
- Next.js 16+

## Dependencies

- React 18+
- @tanstack/react-query
- TypeScript
- Next.js 16+

## Future Enhancements

- Bulk operations (select multiple, delete)
- CSV import/export
- Advanced filtering (multiple departments, status)
- Team member activity history
- Role-based permissions
- Email notifications on team changes
- Pagination for large teams
- Team member avatars (file upload)
- Department management UI

## Testing Considerations

- Unit tests for hooks (useSemuaUser, useCreateUser, etc.)
- Component tests for TeamCard, TeamModal, DeleteConfirmationModal
- Integration tests for full workflow
- API mock tests
- E2E tests with real scenarios

---

**Version:** 1.0.0  
**Last Updated:** 2026-04-27  
**Status:** Fully Implemented ✓
