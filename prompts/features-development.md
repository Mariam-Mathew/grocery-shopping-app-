# Feature Development Prompts

## Shopping Cart Implementation
```
Create a comprehensive shopping cart system with:
- Cart context provider with add, remove, update quantity functions
- Cart item interface with product details and quantity
- Cart persistence using AsyncStorage
- Cart total calculation with tax and shipping options
- Cart filters (by category, price, name)
- Empty cart state with call-to-action
- Cart item animations and transitions
```

## Product Management System
```
Implement product management with:
- Product interface with all necessary fields (id, name, price, category, image, description)
- Product service for API calls and data management
- Product grid and list views
- Product search with debouncing
- Category filtering system
- Product detail modal with full information
- Product image gallery
- Stock availability indicators
```

## User Interface Components
```
Build the following UI components:
- ProductCard component with image, name, price, add to cart button
- CartItem component with quantity controls and remove option
- SearchBar with autocomplete and filtering
- FilterModal for category and price filtering
- LoadingSpinner and EmptyState components
- ThemedButton and ThemedText components
- Custom Modal and Alert components
```

## Settings and Preferences
```
Create a settings screen with:
- Theme toggle (light/dark mode)
- Language selection
- Notification preferences
- Account information
- App version and about section
- Privacy policy and terms links
- Data management (clear cache, reset app)
```

## Navigation Enhancement
```
Enhance the navigation system with:
- Custom tab bar icons and labels
- Badge notifications on cart tab
- Modal routes for product details
- Deep linking support
- Custom header components
- Navigation guards for authentication
- Back button handling
```

## State Management
```
Implement comprehensive state management:
- ShoppingContext for cart operations
- ThemeContext for app theming
- UserContext for user preferences
- ProductContext for product data
- Loading states and error handling
- Optimistic updates for better UX
```

## TypeScript Integration
```
Add comprehensive TypeScript support:
- Product types and interfaces
- Cart item types and operations
- User preference types
- API response types
- Component prop types
- Hook return types
- Utility types and helpers
```

## Performance Optimizations
```
Implement performance improvements:
- Image lazy loading and caching
- List virtualization for large product lists
- Debounced search input
- Memoized components and calculations
- Efficient re-renders with React.memo
- Bundle size optimization
- Memory leak prevention
```
