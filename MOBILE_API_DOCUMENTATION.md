# Mobile API Documentation

This document provides detailed information about the Mobile API endpoints, including request parameters, authentication requirements, and response formats.

## Base URL

```
http://maiasalt.online:5200/api/mobile
```

For local development:

```
http://localhost:5200/api/mobile
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Health Check

**GET /**

Checks if the Mobile API is working properly.

- **Authentication Required**: No
- **Request**: None
- **Response**:
  - Status Code: 200 OK
  - Body:
    ```json
    {
      "message": "Mobile API is working"
    }
    ```

### User Signup

**POST /signup**

Creates a new user account.

- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Validation**:
  - All fields are required
  - Email must be in a valid format
  - Email must not already be registered
- **Response**:
  - Status Code: 201 Created
  - Body:
    ```json
    {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "john_doe",
      "email": "john@example.com",
      "createdAt": "2023-05-07T14:30:45.123Z",
      "token": "your_jwt_token"
    }
    ```
- **Error Responses**:
  - 400 Bad Request: Missing fields or invalid email format
  - 400 Bad Request: User already exists
  - 500 Internal Server Error: Server-side error

### User Login

**POST /login**

Authenticates a user and returns a JWT token.

- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**:
  - Status Code: 200 OK
  - Body:
    ```json
    {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "john_doe",
      "email": "john@example.com",
      "createdAt": "2023-05-07T14:30:45.123Z",
      "token": "your_jwt_token"
    }
    ```
- **Error Responses**:
  - 400 Bad Request: Missing fields
  - 400 Bad Request: Invalid credentials
  - 500 Internal Server Error: Server-side error

### Google OAuth (Direct Token)

**POST /google-oauth**

Processes Google OAuth tokens from mobile clients.

- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "id_token": "google_id_token_from_client"
  }
  ```
- **Response**:
  - Status Code: 200 OK
  - Body:
    ```json
    {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "John Doe",
      "email": "john@example.com",
      "createdAt": "2023-05-07T14:30:45.123Z",
      "token": "your_jwt_token"
    }
    ```
- **Error Responses**:
  - 400 Bad Request: Missing ID token
  - 400 Bad Request: Email not verified with Google
  - 500 Internal Server Error: Authentication failed

### Google OAuth (Web Flow)

**GET /google**

Initiates Google OAuth authentication flow by redirecting to Google's consent page.

- **Authentication Required**: No
- **Request**: None
- **Response**: Redirects to Google authentication

**GET /google/callback**

Handles the callback from Google after successful authentication.

- **Authentication Required**: No
- **Request**: Handled by Google OAuth
- **Response**:
  - Status Code: 200 OK
  - Body:
    ```json
    {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "John Doe",
      "email": "john@example.com",
      "createdAt": "2023-05-07T14:30:45.123Z",
      "token": "your_jwt_token"
    }
    ```
- **Error Responses**:
  - 500 Internal Server Error: Authentication failed

### Ask Maia AI

**POST /ask-maia**

Sends a prompt to Maia AI and returns the generated response.

- **Authentication Required**: Yes
- **Request Body**:
  ```json
  {
    "prompt": "What is the meaning of life?"
  }
  ```
- **Process**:
  1. Validates the user and prompt
  2. Creates a unique request ID
  3. Logs the request in the database
  4. Forwards the request to an AI service via Socket.io
  5. Waits for the AI service to respond (with a 30-second timeout)
  6. Returns the response to the client
- **Response**:
  - Status Code: 200 OK
  - Body:
    ```json
    {
      "response": "The meaning of life is a philosophical question..."
    }
    ```
- **Error Responses**:
  - 400 Bad Request: Prompt is required
  - 401 Unauthorized: No active user or authentication mismatch
  - 503 Service Unavailable: No active socket connection
  - 500 Internal Server Error: Request timed out or other errors

### Retrieve AI Logs

**GET /get-logs**

Retrieves the most recent AI conversation logs for the authenticated user.

- **Authentication Required**: Yes
- **Request**: No body required
- **Response**:
  - Status Code: 200 OK
  - Body: Array of AI Log objects
    ```json
    [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "userId": "60d21b4667d0d8992e610c85",
        "prompt": "What is the meaning of life?",
        "response": "The meaning of life is a philosophical question...",
        "status": "success",
        "createdAt": "2023-05-07T14:30:45.123Z",
        "updatedAt": "2023-05-07T14:30:45.123Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "userId": "60d21b4667d0d8992e610c85",
        "prompt": "How to learn programming?",
        "response": "Learning programming involves several steps...",
        "status": "success",
        "createdAt": "2023-05-07T14:20:30.123Z",
        "updatedAt": "2023-05-07T14:20:30.123Z"
      }
    ]
    ```
- **Error Responses**:
  - 401 Unauthorized: No active user or authentication mismatch
  - 404 Not Found: User not found
  - 500 Internal Server Error: Server-side error

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "message": "Error description",
  "error": "Detailed error information (only in development)"
}
```

## Socket.io Integration

The `/ask-maia` endpoint utilizes Socket.io for real-time communication with AI services. The flow is:

1. Client sends HTTP request to `/ask-maia`
2. Server emits a `processAiRequest` event to connected AI services
3. AI service processes the request and emits an `aiResponse` event
4. Server resolves the pending promise and returns the response to the client

For AI service implementation details, refer to Socket.io documentation and the README.md file in this repository.
