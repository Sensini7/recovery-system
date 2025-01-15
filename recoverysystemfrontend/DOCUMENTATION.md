# Solar Recovery System Documentation

## Overview
Solar Recovery System is a comprehensive web application designed to manage and facilitate solar panel installations, products, and services. The system supports both customer and administrative interfaces with role-based access control.

## System Architecture

### Frontend Technologies
- React.js
- React Router for navigation
- TailwindCSS for styling
- Shadcn UI components
- Context API for state management
- Axios for API requests

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/Customer)
- Protected routes for authenticated users
- Special routes for admin functionality

## Components Structure

### Layouts
1. **PublicLayout**
   - Used for public pages (Home, Login, Register)
   - Includes Navbar and Footer
   - No authentication required

2. **AuthenticatedLayout**
   - Used for authenticated pages (Dashboard)
   - Includes fixed Navbar and Sidebar
   - Requires user authentication

### Core Features

#### 1. Products Management
- Product listing and details
- Admin CRUD operations
- Shopping cart functionality
- Product categories and filtering

#### 2. Services Management
- Solar installation services
- Service booking system
- Required products calculation
- Labor cost and duration estimates

#### 3. Course Management
- Online courses listing
- Course enrollment system
- Progress tracking
- Course materials access

#### 4. User Management
- User registration and authentication
- Profile management
- Role-based permissions
- Order history

#### 5. Admin Dashboard
- Comprehensive admin controls
- Products management
- Services management
- User management
- Orders tracking
- Analytics and reporting

## API Integration

### Endpoints Structure
- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Products management
- `/api/services/*` - Services management
- `/api/courses/*` - Courses management
- `/api/orders/*` - Orders management
- `/api/users/*` - User management

### Data Flow
1. Frontend makes API requests using Axios
2. JWT token included in Authorization header
3. Backend validates token and permissions
4. Response handled and state updated accordingly

## Security Features
- JWT token authentication
- Protected routes
- Role-based access control
- Secure password handling
- XSS protection
- CORS configuration

## User Roles

### Customer
- Browse products and services
- Place orders
- Enroll in courses
- View order history
- Update profile

### Administrator
- All customer capabilities
- Manage products
- Manage services
- Manage courses
- View all orders
- Manage users
- Access analytics

## Error Handling
- Toast notifications for user feedback
- Error boundaries for component errors
- API error handling
- Loading states management

## State Management
- Context API for global state
- Local state for component-specific data
- Form state management
- Cart state management

## UI/UX Features
- Responsive design
- Fixed navigation
- Loading indicators
- Toast notifications
- Modal dialogs
- Form validation
- Error messages
- Success feedback
