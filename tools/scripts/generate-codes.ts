import fs from "fs";
import path from "path";
import keccak256 from "keccak256";
import QRCode from "qrcode";

// === Config ===
const NUM_CODES = 1000;
const OUTPUT_DIR = "output";
const CLAIM_URL_PREFIX = "https://localzin.com/claim?code=";

// === Parse salt from CLI ===
const SALT = process.argv[2];
if (!SALT) {
  console.error("❌ You must provide a salt as a CLI argument.");
  process.exit(1);
}

// === Derive folder name from current date ===
const now = new Date();
const BATCH_FOLDER =
  now.toISOString().split("T")[0] + `_${now.getHours()}-${now.getMinutes()}`;

const BATCH_PATH = path.join(OUTPUT_DIR, BATCH_FOLDER);
const QR_DIR = path.join(BATCH_PATH, "qrs");
const PLAINS_PATH = path.join(BATCH_PATH, "plain.json");
const HASHES_PATH = path.join(BATCH_PATH, "hashed.json");

function ensureDirs() {
  fs.mkdirSync(QR_DIR, { recursive: true });
}

async function generateCodes() {
  ensureDirs();

  const plain: string[] = [];
  const hashed: string[] = [];

  for (let i = 0; i < NUM_CODES; i++) {
    const code = `ZIN-${i+1}-${Math.random().toString(36).substring(2, 10)}`;
    const salted = `${code}:${SALT}`;
    const hash = keccak256(salted).toString("hex");

    plain.push(code);
    hashed.push(hash);

    const url = `${CLAIM_URL_PREFIX}${hash}`;
    await QRCode.toFile(path.join(QR_DIR, `${i+1}.png`), url);
  }

  fs.writeFileSync(PLAINS_PATH, JSON.stringify(plain, null, 2));
  fs.writeFileSync(HASHES_PATH, JSON.stringify(hashed, null, 2));

  console.log(`Generated ${NUM_CODES} codes into "${BATCH_FOLDER}"`);
}

generateCodes().catch((err) => {
  console.error("❌ Failed to generate codes:", err);
});