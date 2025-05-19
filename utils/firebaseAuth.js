import admin from "firebase-admin";
import serviceAccount from "../maia-mirror-firebase-adminsdk-fbsvc-63615d3185.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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
