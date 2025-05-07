import fs from "fs";
import path from "path";
import keccak256 from "keccak256";
import QRCode from "qrcode";

// === Config ===
const NUM_CODES = 100;
const SALT = "local-zin-secret-salt";
const OUTPUT_DIR = "output";
const CLAIM_URL_PREFIX = "https://localzin.com/claim?code=";

// Derive folder name from current date
const now = new Date();
const BATCH_FOLDER = now.toISOString().split("T")[0] + `_${now.getHours()}:${now.getMinutes()}`;

const TEXT_DIR = path.join(OUTPUT_DIR, BATCH_FOLDER, "plain");
const HASH_DIR = path.join(OUTPUT_DIR, BATCH_FOLDER, "hashed");
const QR_DIR = path.join(OUTPUT_DIR, BATCH_FOLDER, "qrs");

function ensureDirs() {
  [TEXT_DIR, HASH_DIR, QR_DIR].forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
  });
}

async function generateCodes() {
  ensureDirs();

  for (let i = 0; i < NUM_CODES; i++) {
    const code = `ZIN-${i}-${Math.random().toString(36).substring(2, 10)}`;
    const salted = `${code}:${SALT}`;
    const hash = keccak256(salted).toString("hex");

    // Save raw code and hash
    fs.writeFileSync(path.join(TEXT_DIR, `${i}.txt`), code);
    fs.writeFileSync(path.join(HASH_DIR, `${i}.hash`), hash);

    // Generate QR with hashed code
    const url = `${CLAIM_URL_PREFIX}${hash}`;
    await QRCode.toFile(path.join(QR_DIR, `${i}.png`), url);
  }

  console.log(`Generated ${NUM_CODES} hashed QR codes into "${BATCH_FOLDER}"`);
}

generateCodes().catch((err) => {
  console.error("❌ Failed to generate codes:", err);
});