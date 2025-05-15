import fs from "fs";
import path from "path";
import { argv } from "process";
import { airdropContract } from "./config";
import { ethers } from "ethers";

// === Constants ===
const MAX_CODES_PER_BATCH = 500;

// === Parse CLI argument ===
const codesFlagIndex = argv.indexOf("--codes");
if (codesFlagIndex === -1 || !argv[codesFlagIndex + 1]) {
  console.error("Please provide --codes path/to/hashed.json");
  process.exit(1);
}
const CODES_FILE = path.resolve(argv[codesFlagIndex + 1]);

// === Load codes ===
let codeHashes: string[];
try {
  const raw = fs.readFileSync(CODES_FILE, "utf-8");
  codeHashes = JSON.parse(raw);
  if (!Array.isArray(codeHashes)) throw new Error("Invalid JSON format");
} catch (err) {
  console.error("Failed to load code hashes:", err);
  process.exit(1);
}

console.log(`Loaded ${codeHashes.length} codes from ${CODES_FILE}`);
console.log(`Sending in batches of ${MAX_CODES_PER_BATCH} to: ${airdropContract.target}`);

async function main() {
  for (let i = 0; i < codeHashes.length; i += MAX_CODES_PER_BATCH) {
    const batch = codeHashes.slice(i, i + MAX_CODES_PER_BATCH);
    const padded = batch.map((hex) => ethers.getBytes("0x" + hex));

    try {
      const tx = await airdropContract.registerCodes(padded);
      console.log(`Batch ${i / MAX_CODES_PER_BATCH + 1}: TX ${tx.hash}`);
      await tx.wait();
    } catch (err) {
      console.error(`Failed to register batch ${i / MAX_CODES_PER_BATCH + 1}:`, err);
    }
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
