// This is a CommonJS module version of the setup-firebase script
// to maintain compatibility with the package.json script command
const { execSync } = require("child_process");
const path = require("path");

try {
  const scriptPath = path.join(__dirname, "setup-firebase.js");
  execSync(`node ${scriptPath}`, { stdio: "inherit" });
} catch (error) {
  console.error("Error executing setup-firebase script:", error.message);
  process.exit(1);
}
