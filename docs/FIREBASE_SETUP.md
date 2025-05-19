# Firebase Authentication Setup Guide

This document explains how to set up Firebase authentication for the project.

## Prerequisites

1. A Google account
2. Access to the Firebase console

## Steps to Set Up Firebase Authentication

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics if desired

### 2. Set Up Firebase Authentication

1. In your Firebase project console, navigate to "Authentication" in the left sidebar
2. Click "Get started"
3. Enable the sign-in methods required for the application:
   - Email/Password
   - Google
   - Any other providers needed

### 3. Create a Firebase Service Account

1. In your Firebase project console, navigate to "Project settings" (gear icon)
2. Go to the "Service accounts" tab
3. Click "Generate new private key"
4. Save the JSON file securely (DO NOT COMMIT THIS FILE TO GIT)

### 4. Configure Environment Variables

1. Copy the `.env.example` file to a new file named `.env` in the root directory
2. Fill in the Firebase configuration values from your service account JSON file:

```
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="your_private_key_with_newlines_preserved"
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=your_client_cert_url
FIREBASE_UNIVERSE_DOMAIN=googleapis.com
```

**Important Notes:**

- Make sure to preserve the newline characters in the private key by wrapping it in quotes
- NEVER commit the .env file or any file containing credentials to your Git repository
- The .gitignore file should already exclude these sensitive files

### 5. Flutter Configuration (Mobile App)

For the Flutter mobile app, follow these additional steps:

1. In your Firebase project console, go to Project settings
2. Click the Android or iOS icon to add your app
3. Follow the setup instructions to download the configuration file
   - For Android: `google-services.json` (place in android/app directory)
   - For iOS: `GoogleService-Info.plist` (place in ios/Runner directory)
4. Update your Flutter app with the necessary Firebase packages:

```dart
dependencies:
  firebase_core: ^latest_version
  firebase_auth: ^latest_version
  google_sign_in: ^latest_version
```

5. Initialize Firebase in your Flutter app:

```dart
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}
```

### 6. Security Best Practices

- Use environment variables for all Firebase configuration
- Don't hardcode credentials in your code
- Set up proper Firebase security rules
- Implement proper token validation on the backend
- Regularly rotate your Firebase service account key
