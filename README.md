# 🛒 Grocery Shopping App

A modern, feature-rich grocery shopping application built with React Native and Expo, inspired by popular apps like Instacart, Amazon Fresh, and Walmart Grocery.

## ✨ Features

### 🏠 Home Screen
- Modern, clean interface with intuitive navigation
- Quick access to shopping lists and recent items
- Search functionality with smart suggestions
- Category-based product browsing

### 🛒 Shopping Cart & Lists
- **Smart Shopping Lists**: Create custom lists with comprehensive filtering
- **Dashboard Widget**: View and access recent shopping lists instantly
- **Modal Integration**: Click any list to view detailed items in a modal
- **Advanced Filters**: Filter by store, quantity, price range, and categories
- **Real-time Updates**: Live cart total calculation
- **Item Management**: Add, remove, and update quantities with smooth animations

### 👤 Account & Settings
- Personalized user experience
- Theme switching (light/dark mode)
- App preferences and configurations
- Account management

### 🎨 Modern UI/UX
- **Contemporary Design**: Clean, modern interface following latest design trends
- **Tab Navigation**: Intuitive bottom tab bar with badges and animations
- **Responsive Layout**: Optimized for different screen sizes
- **Dark Mode Support**: Full theme support with smooth transitions
- **Micro-interactions**: Thoughtful animations and feedback

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (File-based routing)
- **Language**: TypeScript
- **State Management**: React Context API
- **Styling**: StyleSheet with theme system
- **Icons**: Expo Vector Icons (Ionicons)
- **Platform**: iOS & Android

## 📱 Screenshots & UI Components

### Tab Bar Features
- **Home Tab**: Main shopping interface with search
- **Cart Tab**: Shopping cart with item count badge
- **Account Tab**: User settings and preferences

### Visual Elements
- Modern tab icons with focus states
- Cart badge showing item count
- Smooth transitions and hover effects
- Consistent color theming

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mariam-Mathew/grocery-shopping-app-.git
   cd grocery-shopping-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 📁 Project Structure

```
grocery-shopping-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab-based screens
│   │   ├── _layout.tsx   # Tab layout configuration
│   │   ├── index.tsx      # Home screen
│   │   ├── cart.tsx       # Shopping cart screen
│   │   └── settings.tsx   # Settings screen
│   ├── +not-found.tsx     # 404 page
│   ├── _layout.tsx        # Root layout
│   └── modal.tsx          # Modal routes
├── components/            # Reusable UI components
│   ├── Themed.tsx         # Theme provider
│   ├── EditScreenInfo.tsx # Edit screen component
│   ├── ExternalLink.tsx   # External link component
│   ├── useColorScheme.tsx # Color scheme hook
│   ├── useClientOnlyValue.tsx # Client-side value hook
│   ├── CartFilters.tsx    # Cart filtering component
│   ├── ShoppingListFilters.tsx # Shopping list filters
│   └── ShoppingListModal.tsx # Shopping list modal
├── context/              # React Context providers
│   └── ShoppingContext.tsx # Shopping cart context
├── constants/            # App constants and configurations
│   └── Colors.ts         # Color definitions
├── types/                # TypeScript type definitions
│   └── shopping.ts       # Shopping-related types
├── prompts/              # Development prompts and documentation
│   ├── README.md         # Development process overview
│   ├── original-prompts.md # Actual development prompts
│   ├── initial-setup.md  # Setup prompts
│   ├── features-development.md # Feature prompts
│   ├── styling-and-ui.md # UI/UX prompts
│   └── testing-and-deployment.md # Testing prompts
├── assets/               # Static assets
├── .expo/                # Expo configuration
├── .vscode/              # VS Code settings
├── package.json          # Dependencies and scripts
├── app.json              # Expo app configuration
├── babel.config.js       # Babel configuration
├── metro.config.js       # Metro bundler config
├── tsconfig.json         # TypeScript configuration
└── eas.json              # EAS Build configuration
```

## 🎯 Key Features Deep Dive

### Shopping List Management
- **Dashboard Integration**: Recent lists appear as widgets on the home screen
- **One-Click Access**: Tap any list widget to open detailed view in modal
- **Smart Filtering**: Filter lists by store, price range, item categories
- **Quantity Tracking**: Monitor and update item quantities in real-time
- **Custom Categories**: Create and organize items by custom categories

### Advanced Filtering System
- **Store-Based Filtering**: Organize shopping by different stores
- **Price Range Filters**: Set minimum and maximum price limits
- **Category Filters**: Filter by product categories (produce, dairy, etc.)
- **Quantity Filters**: Filter by item quantity ranges
- **Combined Filters**: Apply multiple filters simultaneously

### Modern UI Components
- **Themed Components**: Full theme support with light/dark modes
- **Responsive Design**: Adapts to different screen sizes
- **Smooth Animations**: Micro-interactions and transitions
- **Accessibility**: Screen reader support and proper contrast ratios

## 🔧 Configuration

### Environment Variables
Create a `.env` file for environment-specific configurations:

```env
EXPO_PUBLIC_API_URL=your_api_url
EXPO_PUBLIC_ENVIRONMENT=development
```

### Theme Customization
Modify `constants/Colors.ts` to customize the color scheme:

```typescript
export default Colors = {
  light: {
    primary: '#4CAF50',
    background: '#FFFFFF',
    // ... other colors
  },
  dark: {
    primary: '#66BB6A',
    background: '#121212',
    // ... other colors
  }
};
```

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Build & Deployment

### Development Build
```bash
# Build for development
expo build:android --mode development
expo build:ios --mode development
```

### Production Build
```bash
# Build for production
expo build:android --mode production
expo build:ios --mode production
```

### EAS Build (Recommended)
```bash
# Configure EAS
eas build:configure

# Build with EAS
eas build --platform android
eas build --platform ios
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Process

This project was developed using AI-assisted development with specific prompts. The complete development process is documented in the `prompts/` folder:

- **Original Prompts**: Actual prompts used during development
- **Feature Development**: Step-by-step feature implementation
- **UI/UX Design**: Design decisions and implementations
- **Error Resolution**: Problem-solving approaches

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Instacart, Amazon Fresh, Walmart Grocery
- **Framework**: Expo and React Native teams
- **Icons**: Expo Vector Icons (Ionicons)
- **Community**: React Native and Expo developer communities

## 📞 Support

For support, questions, or contributions:
- Create an issue on GitHub
- Review the development prompts in the `prompts/` folder
- Check the documentation in the wiki

---

**Built with ❤️ using React Native and Expo**
