# Restaurant Dashboard Documentation

## Overview

Complete restaurant management dashboard built with Next.js App Router, Tailwind CSS, and Framer Motion. Features role-based access control, JWT authentication, and real-time API integration.

## Features

✅ **Sidebar Layout** - Responsive navigation with mobile menu  
✅ **Role-Based Access** - Owner/Admin/Staff permissions  
✅ **JWT Protected Routes** - Secure authentication  
✅ **API-Driven** - Real backend integration  
✅ **Pagination** - Customer list pagination  
✅ **Search** - Customer search functionality  
✅ **Optimistic UI** - Instant order status updates  
✅ **Tablet-Friendly** - Responsive design  
✅ **Premium Design** - Clean, minimal interface  

## Pages

### 1. Dashboard Overview (`/dashboard`)
**Metrics Displayed:**
- Orders Today
- Revenue Today
- Repeat Customer %
- Pending Bookings
- Sales Graph (Last 7 days)

**Components:**
- Stat cards with icons
- Interactive sales chart
- Real-time data updates

### 2. Orders Management (`/dashboard/orders`)
**Kanban Board:**
- New (PENDING)
- Confirmed (CONFIRMED)
- Preparing (PREPARING)
- Ready (READY)
- Completed (COMPLETED)

**Features:**
- Drag-and-drop style columns
- Optimistic UI updates
- Order details in cards
- Status progression buttons
- Real-time updates

### 3. Bookings Management (`/dashboard/bookings`)
**Features:**
- Date filter
- Booking cards with details
- Status management (Confirm, Seat, Cancel)
- Customer information display
- Special requests handling

### 4. Customer CRM (`/dashboard/customers`)
**Features:**
- Search functionality
- Pagination (20 per page)
- Customer metrics display
- Total revenue calculation
- Average order value
- Last visit tracking

### 5. Menu Management (`/dashboard/menu`)
**Features:**
- Category filtering
- Menu item grid
- Add category/item modals
- Edit/delete actions
- Availability toggle
- Image display

### 6. Staff Management (`/dashboard/staff`)
**Access:** Owner/Admin only

**Features:**
- Staff member list
- Role badges
- Status indicators
- Last login tracking
- Add/Edit/Delete staff

### 7. Settings (`/dashboard/settings`)
**Access:** Owner/Admin only

**Tabs:**
- General - Restaurant information
- Subscription - Plan details
- Notifications - Preference settings
- Security - Password & 2FA

## Components

### Layout Components

#### `Sidebar`
Responsive sidebar navigation with:
- Desktop fixed sidebar
- Mobile slide-out menu
- Role-based menu filtering
- Active route highlighting
- User profile display

#### `DashboardLayout`
Protected layout wrapper with:
- JWT authentication check
- Role-based access control
- Loading states
- Error handling

### Custom Hooks

#### `useOrders`
```typescript
const { orders, loading, error, updateOrderStatus } = useOrders(status?);
```

**Features:**
- Fetch orders by status
- Optimistic UI updates
- Error handling

#### `useCustomers`
```typescript
const { customers, loading, error, total, totalPages } = useCustomers(search, page, limit);
```

**Features:**
- Search functionality
- Pagination
- Client-side filtering

#### `useDashboardStats`
```typescript
const { stats, loading, error } = useDashboardStats();
```

**Returns:**
- Orders today
- Revenue today
- Repeat customer %
- Pending bookings
- Sales data (7 days)

## Role-Based Access

### Roles
- **OWNER** - Full access
- **ADMIN** - Full access
- **MANAGER** - Limited access
- **STAFF** - Basic access
- **WAITER** - Order management only

### Protected Routes
```typescript
<DashboardLayout requiredRole={['OWNER', 'ADMIN']}>
  {/* Content */}
</DashboardLayout>
```

## API Integration

All API calls use the centralized `api` client:

```typescript
// Orders
api.getOrders(status?)
api.updateOrder(id, data)

// Bookings
api.getBookings(date?)
api.updateBooking(id, data)

// Customers
api.getCustomers()

// Menu
api.getCategories(restaurantId)
api.getMenuItems(restaurantId)

// Staff
api.getUsers()
api.createUser(data)
api.updateUser(id, data)
```

## Optimistic UI Updates

Order status updates use optimistic UI:

1. **Immediate Update** - UI updates instantly
2. **API Call** - Request sent to backend
3. **Success** - Toast notification
4. **Error** - Revert to previous state + error toast

```typescript
const updateOrderStatus = async (orderId, newStatus) => {
  // Optimistic update
  setOrders(prev => prev.map(order => 
    order.id === orderId ? { ...order, status: newStatus } : order
  ));
  
  try {
    await api.updateOrder(orderId, { status: newStatus });
    toast.success('Order status updated');
  } catch (error) {
    // Revert on error
    setOrders(previousOrders);
    toast.error('Failed to update order');
  }
};
```

## Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Slide-out sidebar menu
- Stacked layouts
- Touch-friendly buttons
- Optimized tables

## Styling

### Design System
- **Colors**: Primary red, gray scale
- **Spacing**: 4px grid system
- **Typography**: System font stack
- **Shadows**: Subtle elevation
- **Borders**: 1px gray borders

### Components
- Rounded corners (xl: 12px)
- Consistent padding
- Hover states
- Focus states
- Loading states

## Performance

1. **Code Splitting** - Automatic with App Router
2. **Lazy Loading** - Components load on demand
3. **Optimistic Updates** - Instant UI feedback
4. **Client-Side Filtering** - Fast search/pagination
5. **Memoization** - Expensive calculations cached

## Security

1. **JWT Authentication** - Token-based auth
2. **Protected Routes** - Route-level guards
3. **Role Checks** - Component-level permissions
4. **API Validation** - Backend validation
5. **XSS Protection** - React default protection

## Usage Example

```typescript
// Protected page with role requirement
export default function StaffPage() {
  return (
    <DashboardLayout requiredRole={['OWNER', 'ADMIN']}>
      <StaffPageContent />
    </DashboardLayout>
  );
}

// Using hooks
const { orders, updateOrderStatus } = useOrders('PENDING');
const { customers, totalPages } = useCustomers(search, page);
const { stats } = useDashboardStats();
```

## Future Enhancements

- [ ] Real-time order updates (WebSockets)
- [ ] Advanced filtering
- [ ] Export functionality
- [ ] Bulk actions
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] Push notifications
