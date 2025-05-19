# Chatbot API Documentation

This document provides detailed information about the Chatbot API endpoints, including request parameters, authentication requirements, and response formats.

## Base URL

```
http://maiasalt.online:5200/api/maia
```

For local development:

```
http://localhost:5200/api/maia
```

## Authentication

Some endpoints require an active user session tracked by the `activeUsers` module. This is different from the JWT authentication used in the Mobile API.

## Endpoints

### Health Check

**GET /**

Checks if the Chatbot API is working properly.

- **Authentication Required**: No
- **Request**: None
- **Response**:
  - Status Code: 200 OK
  - Body:
    ```json
    {
      "message": "Chatbot API is working"
    }
    ```

### Log AI Interaction

**POST /message**

Logs an AI interaction between a user and the chatbot.

- **Authentication Required**: Yes (Active user session required)
- **Request Body**:
  ```json
  {
    "prompt": "What is the meaning of life?",
    "response": "The meaning of life is a philosophical question...",
    "status": "success", // Optional, defaults to "success"
    "errorMessage": "" // Optional, include if there was an error
  }
  ```
- **Validation**:
  - Both prompt and response fields are required
  - User must be active in the system
  - User ID must be in valid MongoDB ObjectId format
- **Response**:
  - Status Code: 201 Created
  - Body: The created AI Log object
    ```json
    {
      "_id": "60d21b4667d0d8992e610c85",
      "userId": "60d21b4667d0d8992e610c85",
      "prompt": "What is the meaning of life?",
      "response": "The meaning of life is a philosophical question...",
      "status": "success",
      "errorMessage": "",
      "createdAt": "2023-05-07T14:30:45.123Z",
      "updatedAt": "2023-05-07T14:30:45.123Z"
    }
    ```
- **Error Responses**:
  - 400 Bad Request: Missing prompt or response
  - 400 Bad Request: Invalid user ID format
  - 401 Unauthorized: No active user
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

## Integration with User Sessions

The Chatbot API relies on the `activeUsers` module to track multiple active users. This variable is set when:

1. A user logs in through the Mobile API
2. A user is authenticated through Google OAuth

Unlike the Mobile API, which uses JWT tokens in request headers, the Chatbot API expects the user to be already authenticated and active in the system.

## Database Integration

All AI interactions logged through the `/message` endpoint are:

1. Saved to the database in the `AiLog` collection
2. Associated with the user's account
3. Added to the user's `aiLogs` array reference

This allows for a complete history of all AI interactions to be maintained and associated with the correct user account.
