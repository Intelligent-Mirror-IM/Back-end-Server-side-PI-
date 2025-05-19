import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Function to initialize Firebase with credentials
const initializeFirebase = () => {
  try {
    // Check if we have the required environment variables
    if (process.env.FIREBASE_PROJECT_ID && 
        process.env.FIREBASE_CLIENT_EMAIL && 
        process.env.FIREBASE_PRIVATE_KEY) {
      
      // Initialize with environment variables
      admin.initializeApp({
        credential: admin.credential.cert({
          "type": process.env.FIREBASE_TYPE || "service_account",
          "project_id": process.env.FIREBASE_PROJECT_ID,
          "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
          "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          "client_email": process.env.FIREBASE_CLIENT_EMAIL,
          "client_id": process.env.FIREBASE_CLIENT_ID,
          "auth_uri": process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
          "token_uri": process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
          "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
          "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
        })
      });
      console.log("Firebase initialized with environment variables");
    } 
    // If credentials file exists, use it as a fallback
    else {
      const credentialFiles = [
        path.join(process.cwd(), 'firebase-credentials.json'),
        path.join(process.cwd(), 'FirebaseCredits.json'),
        path.join(process.cwd(), process.env.FIREBASE_CREDENTIALS_FILE || 'non-existent-file')
      ];
      
      // Find the first credential file that exists
      let credentialsFile = null;
      for (const file of credentialFiles) {
        if (fs.existsSync(file)) {
          credentialsFile = file;
          break;
        }
      }
      
      if (credentialsFile) {
        admin.initializeApp({
          credential: admin.credential.cert(require(credentialsFile))
        });
        console.log(`Firebase initialized with credentials file: ${credentialsFile}`);
      } else {
        throw new Error("Firebase credentials not found. Please set up environment variables or credentials file.");
      }
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    throw error;
  }
};

// Initialize Firebase
initializeFirebase();

export const verifyIdToken = async (idToken) => {
  try {
    const decodeToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodeToken.uid;
    return uid;
  } catch (error) {
    console.error("Error verifying ID token:", error);
    throw new Error("Unauthorized");
  }
};

export const getGoogleProfileFromToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken.firebase?.sign_in_provider !== "google.com") {
      throw new Error("Not a Google Sign in");
    }
    if (
      !decodedToken.firebase.identities["google.com"] ||
      !decodedToken.firebase.identities["google.com"][0]
    ) {
      throw new Error("Google ID not found in token");
    }

    return {
      googleId: decodedToken.firebase.identities["google.com"][0],
      email: decodedToken.email,
      username: decodedToken.name || decodedToken.email.split("@")[0],
    };
  } catch (error) {
    console.error("Error getting Google profile from token:", error);
    throw new Error(error.message || "Unauthorized");
  }
};
