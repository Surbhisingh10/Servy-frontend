# Customer-Facing UI Documentation

## Overview

Complete customer-facing UI for the Restaurant SaaS platform built with Next.js App Router, Tailwind CSS, and Framer Motion.

## Features

✅ **Mobile-first responsive design**  
✅ **Sticky category navigation**  
✅ **Floating cart button**  
✅ **Smooth Framer Motion animations**  
✅ **Bottom-sheet modals**  
✅ **Global cart state with Zustand**  
✅ **Real API integration**  
✅ **Error handling & loading states**  
✅ **No page reloads**  

## Pages

### 1. Order Type Selection (`/order-type`)
- Choose between Dine-In and Takeaway
- Sets order type in cart store
- Redirects to menu page

### 2. Menu Page (`/menu?restaurantId=xxx`)
- Displays menu categories and items
- Sticky category navigation
- Item cards with images and details
- Bottom-sheet item detail modal
- Floating cart button

### 3. Cart Page (`/cart`)
- View all cart items
- Update quantities
- Remove items
- Order summary with tax calculation
- Proceed to checkout

### 4. Checkout Page (`/checkout`)
- Contact information form
- Phone number required
- Special instructions
- Order summary
- Submit order to backend

### 5. Order Confirmation (`/order-confirmation?orderNumber=xxx`)
- Success animation
- Order number display
- Estimated preparation time
- Navigation options

### 6. Booking Form (`/book?restaurantId=xxx`)
- Date and time selection
- Party size input
- Contact information
- Special requests
- Submit booking

## Components

### Customer Components

#### `BottomSheet`
Modal component that slides up from bottom with backdrop.

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `title?: string`
- `children: ReactNode`

#### `CartButton`
Floating cart button showing item count and total.

**Features:**
- Only shows when cart has items
- Fixed position bottom-right
- Framer Motion animations

#### `CategoryNav`
Sticky horizontal category navigation.

**Props:**
- `categories: Category[]`
- `activeCategory: string`
- `onCategoryChange: (categoryId: string) => void`

#### `MenuItemCard`
Card component for displaying menu items.

**Props:**
- `item: MenuItem`
- `onItemClick: (item: MenuItem) => void`

#### `ItemDetailModal`
Bottom-sheet modal for item details and add to cart.

**Features:**
- Quantity selector
- Special instructions input
- Add to cart functionality

## State Management

### Cart Store (`src/store/cart-store.ts`)

Zustand store with persistence for cart management.

**State:**
- `items: CartItem[]`
- `restaurantId: string | null`
- `orderType: 'DINE_IN' | 'TAKEAWAY' | null`
- `tableNumber?: string`

**Actions:**
- `addItem(item: CartItem)`
- `removeItem(menuItemId: string)`
- `updateQuantity(menuItemId: string, quantity: number)`
- `clearCart()`
- `setRestaurant(restaurantId: string)`
- `setOrderType(type, tableNumber?)`
- `getTotal(): number`
- `getItemCount(): number`

## API Integration

All API calls use the centralized `api` client (`src/lib/api.ts`).

### Menu Endpoints
```typescript
api.getCategories(restaurantId: string)
api.getMenuItems(restaurantId: string, categoryId?: string)
```

### Order Endpoints
```typescript
api.createOrder(restaurantId: string, orderData: any)
api.getOrder(id: string)
```

### Booking Endpoints
```typescript
api.createBooking(restaurantId: string, bookingData: any)
```

## Styling

### Tailwind Configuration
- Custom primary color palette
- Custom animations (fade-in, slide-up)
- Utility classes for buttons, inputs, cards

### Design System
- **Spacing**: Consistent 4px grid
- **Colors**: Primary red, gray scale
- **Typography**: System font stack
- **Shadows**: Subtle elevation system
- **Border Radius**: 8px (md), 12px (lg), 16px (xl)

## Animations

### Framer Motion Usage
- Page transitions
- Button hover/tap effects
- Modal enter/exit animations
- Category navigation transitions
- Cart button appearance

### Animation Principles
- Spring physics for natural feel
- Subtle scale transforms
- Smooth opacity transitions
- No jarring movements

## Error Handling

### Loading States
- Skeleton loaders for content
- Spinner for form submissions
- Disabled buttons during loading

### Error States
- Toast notifications (react-hot-toast)
- Error messages in forms
- Retry buttons for failed requests
- Fallback UI for empty states

## Performance Optimizations

1. **Server Components**: Used where possible
2. **Client Components**: Only when needed (interactivity, state)
3. **Image Optimization**: Next.js Image component
4. **Code Splitting**: Automatic with App Router
5. **State Persistence**: LocalStorage via Zustand persist

## Usage Flow

1. **Landing** → Select order type (Dine-In/Takeaway)
2. **Menu** → Browse categories, view items, add to cart
3. **Cart** → Review items, update quantities
4. **Checkout** → Enter contact info, place order
5. **Confirmation** → View order number, next steps

## Testing Checklist

- [ ] Menu loads correctly
- [ ] Categories filter items
- [ ] Add items to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Checkout form validation
- [ ] Order submission
- [ ] Booking form submission
- [ ] Error handling
- [ ] Loading states
- [ ] Mobile responsiveness
- [ ] Animations work smoothly

## Future Enhancements

- [ ] Real-time order status updates
- [ ] Push notifications
- [ ] Order history
- [ ] Favorite items
- [ ] Search functionality
- [ ] Filter by dietary preferences
- [ ] Image zoom
- [ ] Share menu items
