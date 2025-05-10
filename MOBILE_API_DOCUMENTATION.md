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
  - Username must not already be taken
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

### User Logout

**POST /logout**

Logs out the current user.

- **Authentication Required**: Yes
- **Request**: No body required
- **Response**:
  - Status Code: 200 OK
  - Body:
    ```json
    {
      "message": "Logged out successfully"
    }
    ```
- **Error Responses**:
  - 401 Unauthorized: No active user or authentication mismatch
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

### Forgot Password

**POST /forgot-password**

Initiates the password reset process by sending a One-Time Password (OTP) to the user's email.

- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Process**:
  1. Validates the email
  2. Checks if a user with the email exists
  3. Generates a 6-digit OTP
  4. Sends the OTP to the user's email
  5. Stores the OTP in memory for verification
- **Response**:
  - Status Code: 200 OK
  - Body:
    ```json
    {
      "message": "OTP sent to your email"
    }
    ```
- **Error Responses**:
  - 400 Bad Request: Email is required
  - 404 Not Found: User not found
  - 500 Internal Server Error: Error sending email or other server-side error

### Check OTP

**POST /check-otp**

Verifies the OTP sent to the user's email and returns a JWT token for resetting the password.

- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "otp": "123456"
  }
  ```
- **Process**:
  1. Validates the email and OTP
  2. Verifies if the OTP matches the one sent to the email
  3. Generates a JWT token for password reset
- **Response**:
  - Status Code: 200 OK
  - Body:
    ```json
    {
      "message": "OTP verified successfully",
      "token": "jwt_token_for_password_reset"
    }
    ```
- **Error Responses**:
  - 400 Bad Request: Email and OTP are required
  - 400 Bad Request: Invalid OTP
  - 404 Not Found: User not found
  - 500 Internal Server Error: Server-side error

### Reset Password

**POST /reset-password**

Resets the user's password using a valid JWT token.

- **Authentication Required**: Yes (with token from check-otp)
- **Request Body**:
  ```json
  {
    "password": "newSecurePassword123"
  }
  ```
- **Process**:
  1. Validates the new password
  2. Updates the user's password in the database
- **Response**:
  - Status Code: 200 OK
  - Body:
    ```json
    {
      "message": "Password reset successful"
    }
    ```
- **Error Responses**:
  - 400 Bad Request: Password is required
  - 401 Unauthorized: Invalid or expired token
  - 404 Not Found: User not found
  - 500 Internal Server Error: Server-side error

### Edit Profile

**PATCH /edit-profile**

Updates the user's profile information.

- **Authentication Required**: Yes
- **Request Body** (all fields optional):
  ```json
  {
    "username": "new_username",
    "email": "new.email@example.com",
    "currentPassword": "currentSecurePassword123",
    "newPassword": "newSecurePassword456"
  }
  ```
- **Process**:
  1. Validates the provided fields
  2. If updating password, verifies the current password
  3. Updates the user's information in the database
- **Response**:
  - Status Code: 200 OK
  - Body:
    ```json
    {
      "message": "Profile updated successfully",
      "user": {
        "_id": "60d21b4667d0d8992e610c85",
        "username": "new_username",
        "email": "new.email@example.com",
        "createdAt": "2023-05-07T14:30:45.123Z",
        "updatedAt": "2023-05-10T09:15:30.123Z"
      }
    }
    ```
- **Error Responses**:
  - 400 Bad Request: Invalid input data
  - 400 Bad Request: Current password is incorrect
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

## Email Integration

The application uses Nodemailer to send transactional emails such as password reset OTPs. The configuration includes:

1. SMTP server connection settings
2. Email templates for various types of communications
3. Error handling for failed email deliveries

For email service configuration, set the following environment variables:

- `MAIL_HOST`: SMTP server host (e.g., smtp.gmail.com)
- `MAIL_PORT`: SMTP server port (typically 587 for TLS)
- `MAIL_USER`: Email address used as sender
- `MAIL_PASS`: Password or app-specific password for the email account
