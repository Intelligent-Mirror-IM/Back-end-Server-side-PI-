# Maia_Backend-NodeJS

## Description

This project is a Node.js application that implements a chatbot functionality using Express, Socket.io, and MongoDB. It provides a RESTful API for interacting with the chatbot and mobile application authentication, with real-time communication capabilities through WebSockets.

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
│   ├── firebaseAuth.js
│   ├── helpers.js
│   ├── mailHandler.js
│   └── OTPhandler.js
├── index.js
├── .env
├── package.json
├── MOBILE_API_DOCUMENTATION.md
├── CHATBOT_API_DOCUMENTATION.md
├── FIREBASE_SETUP.md
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
   MAIL_HOST=<your-smtp-host>
   MAIL_PORT=<your-smtp-port>
   MAIL_USER=<your-email-address>
   MAIL_PASS=<your-email-password-or-app-password>
   ```

2. For Firebase Authentication, you can either:

   a. Add Firebase configuration manually to your `.env` file:

   ```
   FIREBASE_TYPE=service_account
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY_ID=your_private_key_id
   FIREBASE_PRIVATE_KEY="your_private_key_with_newlines"
   FIREBASE_CLIENT_EMAIL=your_client_email
   ...
   ```

   b. Or use our setup script (recommended):

   ```
   npm run setup-firebase
   ```

   You'll need your Firebase service account JSON file ready. The script will guide you through the process.

3. For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

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
- `POST /api/mobile/logout`: Logs out the current user (requires JWT authentication).
- `POST /api/mobile/ask-maia`: Sends a prompt to Maia AI and returns the generated response (requires JWT authentication).
- `POST /api/mobile/forgot-password`: Initiates password reset process by sending OTP via email.
- `POST /api/mobile/check-otp`: Verifies the OTP sent to the user's email.
- `POST /api/mobile/reset-password`: Resets the user's password using a valid JWT token.
- `PATCH /api/mobile/edit-profile`: Updates the user's profile information (requires JWT authentication).
- `DELETE /api/mobile/delete-account`: Permanently deletes the user's account (requires JWT authentication).
- `GET /api/mobile/get-logs`: Retrieves the most recent AI conversation logs for the authenticated user (requires JWT authentication).
- `GET /api/mobile/google`: Initiates Google OAuth authentication flow.
- `GET /api/mobile/google/callback`: Handles Google OAuth callback and returns user data with JWT token.

For detailed API documentation, refer to `MOBILE_API_DOCUMENTATION.md` and `CHATBOT_API_DOCUMENTATION.md`.

## Socket.io Integration

### Real-time Communication

The application implements a three-way real-time communication system between:

- Mobile clients (via REST API endpoints)
- Backend server (Node.js with Express and Socket.io)
- AI processing services (connected via Socket.io)

### Socket Event System

- `connection`: Tracks new client connections and stores them in a global Map
- `disconnect`: Removes disconnected clients from the tracking system
- `message`: General purpose messaging with acknowledgment
- `messageResponse`: Server response to basic messages
- `processAiRequest`: Sends AI requests from the server to AI service clients
- `aiResponse`: Receives responses from AI services and resolves pending promises

### Request-Response Flow

The innovative bridge between HTTP and WebSockets works as follows:

1. Mobile client sends HTTP request to `/api/mobile/ask-maia` endpoint
2. Server creates a unique requestId and Promise for the asynchronous response
3. Server emits a `processAiRequest` event to connected Socket.io clients (AI services)
4. Server stores the Promise resolvers in a pendingRequests Map
5. AI service processes the request and emits an `aiResponse` event
6. Server receives the response, looks up the associated Promise, and resolves it
7. The resolved Promise allows the HTTP response to be sent back to the mobile client

### Timeout and Error Handling

The Socket.io implementation includes robust error handling:

- 30-second timeout for AI service responses
- Socket connection availability checking
- Request tracking and cleanup
- Detailed error reporting for failed requests

## Features

- **Secure Authentication**: User passwords are securely hashed using bcryptjs.
- **Firebase Authentication**: Support for Firebase Authentication with Google, Email, and other providers.
- **Google OAuth Integration**: Support for authentication with Google accounts.
- **Google Calendar API**: Integration with Google Calendar for managing events.
- **User Session Tracking**: Global user tracking across the application using singleton pattern.
- **AI Interaction Logging**: All AI interactions are logged and associated with user accounts.
- **Email Services**: SMTP integration for sending transactional emails like password reset.
- **OTP System**: One-Time Password generation and verification for secure password reset.
- **User Profile Management**: Endpoints for updating user profile information.
- **Account Management**: Complete user lifecycle including sign-up, profile editing, and account deletion.
- **Password Reset Flow**: Complete forgot password, OTP verification, and reset password workflow.
- **Simplified API Responses**: Streamlined JSON responses for better client integration.
- **Input Validation**: Comprehensive input validation to prevent bad data.
- **Error Handling**: Global error handling middleware for consistent error responses.
- **Route-specific JWT Authentication**: JWT verification middleware applied to protected routes.
- **Real-time Communication**: WebSocket integration via Socket.io for instant messaging and AI responses.
- **Asynchronous Request Handling**: Promise-based architecture for handling long-running AI requests.
- **Timeout Management**: Automatic timeout handling for unresponsive AI services.
- **Connection Management**: Tracking of connected clients with proper cleanup.
- **Global State Management**: Cross-file variable sharing using ES modules.

## Deployment Architecture

This application is deployed with the following architecture:

- **Server**: AWS EC2 instance (t3.micro)

  - 10GB storage
  - Running Ubuntu OS
  - Domain: [maiasalt.online](https://maiasalt.online)

- **Database**: MongoDB Atlas cloud database

  - Managed NoSQL database service
  - Automated backups and scaling

- **Network**:
  - Secured with AWS Security Groups
  - HTTPS enabled for secure communication

The WebSocket connections are managed through the same EC2 instance, allowing for real-time communication between the mobile application, backend, and AI processing services.

## Dependencies

- Express.js: Web framework
- Socket.io: Real-time bidirectional event-based communication
- Mongoose: MongoDB object modeling
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- passport: Authentication middleware
- passport-google-oauth20: Google OAuth strategy
- googleapis: Google API client library
- nodemailer: Email sending functionality
- dotenv: Environment variable management
- http: HTTP server creation for Socket.io integration
- nodemon (dev): Auto-reload during development

## License

This project is licensed under the MIT License.
