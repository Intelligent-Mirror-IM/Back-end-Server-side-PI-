# MongoDB Database Architecture and Relationships

This document provides a visual representation and explanation of the database architecture used in the Graduation Project backend.

## Database Schema Diagram

```
+----------------------+         +-------------------------+
|      User            |         |      AI Log            |
+----------------------+         +-------------------------+
| _id: ObjectId        |-------->| _id: ObjectId          |
| username: String     |         | userId: ObjectId       |
| email: String        |         | prompt: String         |
| password: String     |         | response: String       |
| createdAt: Date      |         | status: String         |
| updatedAt: Date      |         | errorMessage: String   |
| googleId: String     |         | createdAt: Date        |
| aiLogs: [ObjectId]   |<--------| updatedAt: Date        |
| isVerified: Boolean  |         +-------------------------+
+----------------------+         
```

## Database Relationships

### One-to-Many Relationship: User to AI Logs

- Each user can have multiple AI conversation logs
- Each AI log belongs to exactly one user
- The relationship is maintained through:
  - The `aiLogs` array in the User document (containing references to AI Log documents)
  - The `userId` field in each AI Log document (reference to the owner User)

## Collection Details

### User Collection

The User collection stores user account information, authentication details, and references to conversation history.

#### Key Fields:

- `_id`: Unique identifier for the user
- `username`: User's display name
- `email`: User's email address (used for authentication)
- `password`: Hashed password using bcrypt
- `createdAt`: Account creation timestamp
- `updatedAt`: Last account update timestamp
- `googleId`: Google OAuth identifier (for users who signed up with Google)
- `aiLogs`: Array of references to AI Log documents
- `isVerified`: Boolean indicating if email is verified

#### Indexes:

```javascript
// Unique index on email to prevent duplicate accounts
db.users.createIndex({ email: 1 }, { unique: true })

// Index on username for quick lookups
db.users.createIndex({ username: 1 })

// Index on googleId for OAuth authentication
db.users.createIndex({ googleId: 1 })
```

### AI Log Collection

The AI Log collection stores conversation history between users and the AI system.

#### Key Fields:

- `_id`: Unique identifier for the log entry
- `userId`: Reference to the user who owns this conversation
- `prompt`: User's input/question
- `response`: AI-generated response
- `status`: Processing status ("processing", "success", "error")
- `errorMessage`: Error details if status is "error"
- `createdAt`: Timestamp when conversation occurred
- `updatedAt`: Last update timestamp

#### Indexes:

```javascript
// Compound index for efficient retrieval of a user's logs in chronological order
db.aiLogs.createIndex({ userId: 1, createdAt: -1 })

// Text index for searching conversation content
db.aiLogs.createIndex({ prompt: "text", response: "text" })
```

## Data Flow Diagram

```
                 +----------------+
                 |                |
                 |  Mobile App    |
                 |                |
                 +--------+-------+
                          |
                          | HTTP Requests
                          v
+---------------------+   |    +----------------+
|                     |   |    |                |
|  Authentication     |<--+    |    AI API      |
|  (JWT + Session)    |        |   Endpoints    |
|                     |        |                |
+----------+----------+        +--------+-------+
           |                            |
           v                            v
    +------+-------+             +------+------+
    |              |             |             |
    |   User       |<-----------+|   AI Log    |
    | Collection   |             | Collection  |
    |              |             |             |
    +--------------+             +-------------+
```

## Example Documents

### User Document Example

```json
{
  "_id": ObjectId("60d21b4667d0d8992e610c85"),
  "username": "john_doe",
  "email": "john@example.com",
  "password": "$2a$10$X7ZkjCxzSn3a.r4dOBmJm.fVn9uvJvGD7Q2yQUy0rMT7hdFYfQbiq",
  "createdAt": ISODate("2023-05-07T14:30:45.123Z"),
  "updatedAt": ISODate("2023-05-10T09:15:30.123Z"),
  "googleId": null,
  "aiLogs": [
    ObjectId("60d21b4667d0d8992e610c86"),
    ObjectId("60d21b4667d0d8992e610c87")
  ],
  "isVerified": true
}
```

### AI Log Document Example

```json
{
  "_id": ObjectId("60d21b4667d0d8992e610c86"),
  "userId": ObjectId("60d21b4667d0d8992e610c85"),
  "prompt": "What is the meaning of life?",
  "response": "The meaning of life is a philosophical question that has been debated throughout human history...",
  "status": "success",
  "errorMessage": null,
  "createdAt": ISODate("2023-05-07T14:35:10.123Z"),
  "updatedAt": ISODate("2023-05-07T14:35:15.456Z")
}
```

## Entity-Relationship Model

```
┌───────────────────────┐         ┌───────────────────────────┐
│         User          │         │          AI Log           │
├───────────────────────┤         ├───────────────────────────┤
│ PK: _id (ObjectId)    │         │ PK: _id (ObjectId)        │
├───────────────────────┤         ├───────────────────────────┤
│ username (String)     │         │ FK: userId (ObjectId)     │
│ email (String)        │ 1     * │ prompt (String)           │
│ password (String)     │---------│ response (String)         │
│ createdAt (Date)      │         │ status (String)           │
│ updatedAt (Date)      │         │ errorMessage (String)     │
│ googleId (String)     │         │ createdAt (Date)          │
│ aiLogs [ObjectId]     │         │ updatedAt (Date)          │
│ isVerified (Boolean)  │         │                           │
└───────────────────────┘         └───────────────────────────┘
```

## Query Patterns

### Common Database Operations

#### 1. User Authentication
```javascript
// Find user by email (for login)
db.users.findOne({ email: "john@example.com" })

// Find user by Google ID (for OAuth)
db.users.findOne({ googleId: "google_oauth_id_123" })
```

#### 2. Retrieve User's Conversation History
```javascript
// Get most recent conversations, limited to 15
db.aiLogs.find({ userId: ObjectId("60d21b4667d0d8992e610c85") })
         .sort({ createdAt: -1 })
         .limit(15)
```

#### 3. Delete User's Conversation History
```javascript
// Delete all logs for a specific user
db.aiLogs.deleteMany({ userId: ObjectId("60d21b4667d0d8992e610c85") })
```

#### 4. Update User Profile
```javascript
// Update username
db.users.updateOne(
  { _id: ObjectId("60d21b4667d0d8992e610c85") },
  { $set: { username: "new_username", updatedAt: new Date() } }
)
```

#### 5. Create New AI Log Entry
```javascript
// Insert new conversation log
db.aiLogs.insertOne({
  userId: ObjectId("60d21b4667d0d8992e610c85"),
  prompt: "New question",
  response: "AI response",
  status: "success",
  createdAt: new Date(),
  updatedAt: new Date()
})

// Update user with reference to new log
db.users.updateOne(
  { _id: ObjectId("60d21b4667d0d8992e610c85") },
  { $push: { aiLogs: ObjectId("new_log_id") } }
)
```

## Performance Considerations

### Scaling Strategies

1. **Database Sharding**
   - Shard by userId to distribute user data across multiple servers
   - Enables horizontal scaling for growing user base

2. **Read Performance**
   - Strategic use of indexes for common query patterns
   - Caching frequently accessed user data with Redis

3. **Write Performance**
   - Batch updates when possible
   - Consider write concern options based on operation criticality

### Index Utilization

The database design includes carefully planned indexes to support:

- Fast user lookup by email, username, or OAuth ID
- Efficient retrieval of conversation history
- Text search capabilities within conversation content
- Time-based sorting of conversation logs

## Conclusion

The MongoDB database architecture provides a flexible and scalable foundation for the application. The document-oriented model elegantly represents the relationship between users and their conversation history while offering the performance and flexibility needed for a growing application.

The schema design balances normalization and denormalization, using references for the user-to-logs relationship while keeping related data within respective documents. This approach optimizes both read and write operations for the most common user flows within the application.
