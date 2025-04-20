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
│   └── mobileController.js
├── models
│   └── schemas
│       ├── aiLogSchema.js
│       └── userSchema.js
├── routes
│   ├── chatbotRoutes.js
│   └── mobileRoute.js
├── utils
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

1. Create a `.env` file in the root directory and add your MongoDB connection string:
   ```
   MONGO_URI=<your-mongodb-connection-string>
   PORT=<your-port-number>
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

## Features

- **Secure Authentication**: User passwords are securely hashed using bcryptjs.
- **AI Interaction Logging**: All AI interactions are logged and associated with user accounts.
- **Input Validation**: Comprehensive input validation to prevent bad data.
- **Error Handling**: Global error handling middleware for consistent error responses.

## Dependencies

- Express.js: Web framework
- Mongoose: MongoDB object modeling
- bcryptjs: Password hashing
- dotenv: Environment variable management
- nodemon (dev): Auto-reload during development

## License

This project is licensed under the MIT License.
