# Maia_Backend-NodeJS

## Description

This project is a Node.js application that implements a chatbot functionality using Express and MongoDB. It provides a RESTful API for interacting with the chatbot and mobile application authentication.

## Project Structure

```
backend-nodejs
├── config
│   └── db.js
├── controllers
│   ├── chatbotController.js
│   ├── mobileActiions.js
│   └── mobileController.js
├── models
│   ├── aiLogSchema.js
│   └── userSchema.js
├── routes
│   ├── chatbotRoutes.js
│   └── mobileRoute.js
├── utils
│   ├── currentActiveUser.js
│   └── helpers.js
├── index.js
├── .env
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Intelligent-Mirror-IM/Back-end-Server-side-PI- backend-nodejs
   ```
2. Navigate to the project directory:
   ```
   cd backend-nodejs
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory and add your MongoDB connection string and authentication secrets:
   ```
   MONGO_URI=<your-mongodb-connection-string>
   PORT=<your-port-number>
   JWT_SECRET=<your-jwt-secret>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```
2. For development with auto-reload:
   ```
   npm run dev
   ```
3. Access the API at `http://localhost:<your-port-number>/`.

## API Endpoints

### Chatbot Endpoints

- `GET /api/maia`: Returns a simple message indicating the chatbot API is working.
- `POST /api/maia/message`: Logs AI interactions and stores them in the database.

### Mobile Endpoints

- `GET /api/mobile`: Returns a simple message indicating the mobile API is working.
- `POST /api/mobile/signup`: Creates a new user account with secure password hashing.
- `POST /api/mobile/login`: Authenticates a user and returns a JWT token.
- `POST /api/mobile/google-oauth`: Processes Google OAuth tokens from mobile clients.
- `POST /api/mobile/askMaia`: Sends a prompt to Maia AI and returns the generated response (requires JWT authentication).
- `GET /api/mobile/getLogs`: Retrieves all AI conversation logs for the authenticated user (requires JWT authentication).
- `GET /api/mobile/google`: Initiates Google OAuth authentication flow.
- `GET /api/mobile/google/callback`: Handles Google OAuth callback and returns user data with JWT token.

## Features

- **Secure Authentication**: User passwords are securely hashed using bcryptjs.
- **Google OAuth Integration**: Support for authentication with Google accounts.
- **Google Calendar API**: Integration with Google Calendar for managing events.
- **User Session Tracking**: Global user tracking across the application.
- **AI Interaction Logging**: All AI interactions are logged and associated with user accounts.
- **Input Validation**: Comprehensive input validation to prevent bad data.
- **Error Handling**: Global error handling middleware for consistent error responses.
- **Route-specific JWT Authentication**: JWT verification middleware applied to protected routes.

## Dependencies

- Express.js: Web framework
- Mongoose: MongoDB object modeling
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- passport: Authentication middleware
- passport-google-oauth20: Google OAuth strategy
- googleapis: Google API client library
- dotenv: Environment variable management
- nodemon (dev): Auto-reload during development

## License

This project is licensed under the MIT License.
