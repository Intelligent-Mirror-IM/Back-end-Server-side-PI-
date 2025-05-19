# Firebase Security & Credentials Setup Guide for Team Members

## Introduction

This guide helps team members set up Firebase authentication securely in their development environment. By following this guide, you will:

1. Set up Firebase credentials properly
2. Keep sensitive information secure
3. Prevent accidental credential leakage
4. Configure your local environment for development

## Prerequisites

- Access to the project's Firebase account
- Permission to create a service account in Firebase
- Git installed on your computer
- Node.js installed on your computer

## Step 1: Clone the Repository

```bash
git clone https://github.com/Intelligent-Mirror-IM/Back-end-Server-side-PI-.git backend-nodejs
cd backend-nodejs
npm install
```

## Step 2: Obtain Firebase Service Account Credentials

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select our project: "maia-mirror"
3. Click the gear icon (⚙️) for "Project settings" in the top-left
4. Go to the "Service accounts" tab
5. Click "Generate new private key"
6. Save the JSON file to your local machine (BUT NOT IN THE PROJECT DIRECTORY)
7. Keep this file secure and never commit it to any repository

## Step 3: Run the Setup Script

Our project includes a helper script to set up Firebase credentials securely. Run:

```bash
npm run setup-firebase
```

When prompted, provide the path to the JSON file you downloaded in Step 2.

The script will:

- Extract the necessary credentials
- Configure your local .env file
- Create a backup in a secure location
- Update .gitignore to exclude the sensitive files

## Step 4: Verify Setup

1. Check that the `.env` file has been updated with Firebase credentials
2. Make sure the original JSON credentials file is NOT in the project directory
3. Verify the `.gitignore` file includes entries for:
   - `secure-credentials/`
   - `*.json` files containing firebase credentials
   - `.env.firebase`

## Alternative Manual Setup

If the script doesn't work for you, follow these steps:

1. Copy `.env.example` to `.env`
2. Open the Firebase JSON credentials file
3. Manually copy each field to the corresponding entry in your `.env` file
4. Make sure to properly format the private key with escaped newlines

## Important Security Practices

- NEVER commit credentials to Git
- NEVER share service account credentials in chat/email/etc.
- Regularly rotate service account keys
- Use environment variables for all sensitive data
- Check Git commits before pushing to ensure no credentials are included

## Troubleshooting

If you encounter any issues:

1. Check the console for error messages
2. Ensure the Firebase JSON file is valid
3. Verify all required environment variables are set
4. Make sure the private key has proper newline formatting

## Need Help?

Contact the team lead for assistance with setting up Firebase credentials.

## Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Securely Using API Keys](https://cloud.google.com/docs/authentication/api-keys)
- [Environment Variables Best Practices](https://12factor.net/config)
