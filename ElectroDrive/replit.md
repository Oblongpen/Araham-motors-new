# Overview

VoltEdge Motors is a modern, mobile-first electric vehicle company website built with pure HTML, CSS, and vanilla JavaScript. The project showcases a complete electric vehicle manufacturer's digital presence with interactive features including model comparison, technology demonstrations, and advanced mobile navigation. The website emphasizes accessibility, performance, and responsive design while maintaining a clean, professional aesthetic that reflects the innovative nature of electric vehicles.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Pure Web Technologies**: Built entirely with HTML5, CSS3, and vanilla JavaScript without any frameworks or build tools
- **Multi-Page Application**: Traditional page-based navigation with separate HTML files for each section (index, models, technology, about, contact)
- **Mobile-First Design**: CSS written with mobile breakpoints as the primary target, progressively enhancing for larger screens
- **Component-Based CSS**: Modular CSS architecture using CSS custom properties (CSS variables) for consistent theming
- **Semantic HTML5**: Uses proper semantic elements for accessibility and SEO optimization

## Navigation System
- **Responsive Navigation**: Desktop horizontal navigation that transforms into an animated hamburger menu on mobile
- **Progressive Enhancement**: Touch-friendly mobile interactions with swipe gesture support for carousels
- **Accessibility Features**: ARIA labels, keyboard navigation support, focus management, and screen reader compatibility

## Interactive Components
- **Model Carousel**: Auto-playing carousel with touch/swipe navigation for showcasing vehicle models
- **Comparison Tool**: Client-side vehicle comparison system allowing users to select and compare up to 3 models
- **Filtering System**: Advanced filtering for vehicles by body type, range, and price using JavaScript
- **Modal System**: Interactive specification modals with detailed vehicle information
- **Form Handling**: Contact forms with validation and mailto integration for submissions

## Performance Optimizations
- **Intersection Observer API**: Used for scroll-triggered animations to improve performance
- **Lazy Loading**: Performance-conscious code structure to minimize initial load times
- **CSS Variables**: Centralized theming system for consistent styling and easy maintenance
- **Minimal Dependencies**: Only uses Font Awesome for icons to keep the bundle size small

## Design System
- **CSS Custom Properties**: Comprehensive design tokens for colors, typography, spacing, and breakpoints
- **Responsive Grid**: CSS Grid and Flexbox for layout management across different screen sizes
- **Animation System**: Smooth transitions and micro-interactions for enhanced user experience
- **Typography Scale**: Consistent typography system using Inter font family with multiple weights

# External Dependencies

## Fonts
- **Google Fonts**: Inter font family loaded via Google Fonts CDN for typography
- **Font Preloading**: Uses `rel="preconnect"` for performance optimization

## Icons
- **Font Awesome 6.0.0**: Icon library loaded from CDN for UI icons and symbols

## Browser APIs
- **Intersection Observer API**: For performance-efficient scroll-triggered animations
- **Touch Events API**: For mobile swipe gestures and touch interactions
- **Local Storage API**: For persisting user preferences and form data
- **History API**: For potential single-page application navigation (if implemented)

## No Backend Dependencies
- **Static Hosting**: Designed to be hosted on any static file server or CDN
- **No Database**: All data is stored in JavaScript objects and arrays
- **Mailto Integration**: Contact forms use mailto links instead of server-side processing
- **Client-Side Only**: All functionality runs entirely in the browser