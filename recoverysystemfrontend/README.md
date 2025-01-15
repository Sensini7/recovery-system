# Solar Recovery System

A modern web application for managing solar panel installations, products, and services.

## Features

- 🌟 Product Management & Shopping Cart
- 🛠️ Solar Installation Services
- 📚 Online Courses
- 👥 User Authentication & Authorization
- 📊 Admin Dashboard
- 🎯 Role-based Access Control

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB (v4.4 or higher)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/solar-recovery-system.git
cd solar-recovery-system
```

2. Install dependencies:
```bash
cd recoverysystemfrontend
npm install
```

3. Create a `.env` file in the root directory and add the following:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

1. Start the development server:
```bash
npm start
```

2. The application will be available at:
```
http://localhost:3000
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Project Structure

```
src/
├── components/        # Reusable components
├── context/          # Context providers
├── lib/              # Utilities and configurations
├── pages/            # Page components
├── services/         # API service functions
└── styles/           # Global styles
```

## Usage

### Customer Access
1. Visit the homepage
2. Browse products and services
3. Register/Login to place orders
4. Access your dashboard
5. View your orders and enrolled courses

### Admin Access
1. Login with admin credentials
2. Access admin dashboard
3. Manage products, services, and courses
4. View all orders
5. Manage users

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## Support

For support, email support@solarrecovery.com or open an issue in the repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
