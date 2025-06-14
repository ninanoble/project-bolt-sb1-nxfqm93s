# NBS Journal Backend

This is the backend server for the NBS Journal application, providing authentication, user management, and subscription services.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nbs-journal
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
FRONTEND_URL=http://localhost:3000
```

3. Build the project:
```bash
npm run build
```

## Development

To run the server in development mode with hot reloading:
```bash
npm run dev
```

## Production

To run the server in production mode:
```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login to an existing account
- `GET /api/auth/verify/:token` - Verify email address

### Subscription

- `POST /api/subscription/update` - Update user subscription
- `GET /api/subscription/current` - Get current subscription status

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Email verification is required for full access
- CORS is enabled for the frontend domain
- Input validation using express-validator

## Error Handling

The API uses standard HTTP status codes and returns JSON responses with error messages when something goes wrong.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 