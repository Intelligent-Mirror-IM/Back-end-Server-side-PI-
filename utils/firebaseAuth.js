import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

// Initialize the app with credentials from environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
  })
});

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
