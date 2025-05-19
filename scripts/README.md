# Utility Scripts

This directory contains utility scripts for the Maia backend application.

## Available Scripts

### setup-firebase.js

A script to help set up Firebase credentials securely in the project.

#### Usage

To set up Firebase credentials, run:

```bash
npm run setup-firebase
```

This script will:

1. Prompt you for the path to your Firebase service account JSON file
2. Extract the necessary credentials
3. Add them to your `.env` file
4. Create a backup of your original credentials in a secure location
5. Update `.gitignore` to exclude sensitive files

#### Security Considerations

- The script stores the original JSON file in a `secure-credentials` directory
- This directory is automatically added to `.gitignore`
- The private key is properly formatted for environment variables with newlines preserved

## Development Notes

- The scripts directory uses both ES modules and CommonJS modules
- `setup-firebase.js` is the main implementation using Node.js APIs
- `setup-firebase-wrapper.cjs` is a CommonJS wrapper for compatibility with npm scripts
