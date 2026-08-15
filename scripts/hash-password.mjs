import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const readline = createInterface({ input, output });
const password = await readline.question("New private password: ");
readline.close();

if (!password || password.length < 8) {
  console.error("Password must contain at least 8 characters.");
  process.exit(1);
}

const salt = randomBytes(16);
const digest = scryptSync(password, salt, 64);
console.log(`scrypt$${salt.toString("base64url")}$${digest.toString("base64url")}`);
