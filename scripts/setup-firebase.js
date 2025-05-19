#!/usr/bin/env node

/**
 * This script helps set up Firebase credentials in the .env file
 * from a Firebase service account JSON file.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create directory if it doesn't exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Main function
const setupFirebase = async () => {
  console.log("\n========================================");
  console.log("🔥 Firebase Credentials Setup Tool 🔥");
  console.log("========================================\n");

  try {
    // Ask for the path to the Firebase service account JSON file
    const jsonPath = await new Promise((resolve) => {
      rl.question(
        "Enter the path to your Firebase service account JSON file: ",
        (answer) => {
          resolve(answer.trim());
        }
      );
    });

    // Verify the file exists
    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ Error: File not found at ${jsonPath}`);
      process.exit(1);
    }

    // Read and parse the JSON file
    const rawData = fs.readFileSync(jsonPath, "utf8");
    const credentials = JSON.parse(rawData);

    console.log("\n✅ Successfully read Firebase credentials\n");

    // Read existing .env file
    const envPath = path.join(process.cwd(), ".env");
    let envContent = "";

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    }

    // Prepare Firebase environment variables
    const firebaseEnvVars = [
      `FIREBASE_TYPE=${credentials.type || "service_account"}`,
      `FIREBASE_PROJECT_ID=${credentials.project_id || ""}`,
      `FIREBASE_PRIVATE_KEY_ID=${credentials.private_key_id || ""}`,
      `FIREBASE_PRIVATE_KEY="${
        credentials.private_key
          ? credentials.private_key.replace(/\n/g, "\\n")
          : ""
      }"`,
      `FIREBASE_CLIENT_EMAIL=${credentials.client_email || ""}`,
      `FIREBASE_CLIENT_ID=${credentials.client_id || ""}`,
      `FIREBASE_AUTH_URI=${
        credentials.auth_uri || "https://accounts.google.com/o/oauth2/auth"
      }`,
      `FIREBASE_TOKEN_URI=${
        credentials.token_uri || "https://oauth2.googleapis.com/token"
      }`,
      `FIREBASE_AUTH_PROVIDER_CERT_URL=${
        credentials.auth_provider_x509_cert_url ||
        "https://www.googleapis.com/oauth2/v1/certs"
      }`,
      `FIREBASE_CLIENT_CERT_URL=${credentials.client_x509_cert_url || ""}`,
      `FIREBASE_UNIVERSE_DOMAIN=${
        credentials.universe_domain || "googleapis.com"
      }`,
    ].join("\n");

    // Check if Firebase variables already exist in .env
    const hasFirebaseConfig =
      envContent.includes("FIREBASE_TYPE") ||
      envContent.includes("FIREBASE_PROJECT_ID");

    let updatedEnvContent;

    if (hasFirebaseConfig) {
      // Replace existing Firebase configuration
      const regex =
        /(FIREBASE_TYPE=.+\n)([\s\S]*?)(FIREBASE_UNIVERSE_DOMAIN=.+|$)/m;
      if (regex.test(envContent)) {
        updatedEnvContent = envContent.replace(regex, firebaseEnvVars);
      } else {
        // If regex didn't match but we detected Firebase configs, just append
        updatedEnvContent =
          envContent + "\n\n# Firebase Configuration\n" + firebaseEnvVars;
      }
    } else {
      // Append Firebase configuration to the end
      updatedEnvContent =
        envContent.trim() +
        "\n\n# Firebase Configuration\n" +
        firebaseEnvVars +
        "\n";
    }

    // Write updated content back to .env
    fs.writeFileSync(envPath, updatedEnvContent);

    // Backup the original credentials file to a secure location
    const backupDir = path.join(process.cwd(), "secure-credentials");
    ensureDirectoryExists(backupDir);

    const backupPath = path.join(backupDir, "firebase-credentials.json");
    fs.writeFileSync(backupPath, rawData);

    console.log(`✅ Firebase credentials added to .env file`);
    console.log(`✅ Original credentials backed up to ${backupPath}`);

    // Add the backup directory to .gitignore if it's not already there
    const gitignorePath = path.join(process.cwd(), ".gitignore");
    let gitignoreContent = "";

    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
    }

    if (!gitignoreContent.includes("secure-credentials/")) {
      fs.appendFileSync(
        gitignorePath,
        "\n# Secure credentials\nsecure-credentials/\n"
      );
      console.log("✅ Added secure-credentials/ to .gitignore");
    }

    console.log(
      "\n🎉 Firebase setup complete! Your credentials are now securely stored.\n"
    );
  } catch (error) {
    console.error("❌ Error setting up Firebase credentials:", error.message);
  } finally {
    rl.close();
  }
};

// Run the setup
setupFirebase();
