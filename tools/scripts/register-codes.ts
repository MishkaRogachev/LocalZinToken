import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Load env from root .env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// === Constants ===
const CONTRACT_ADDRESS = "0xb6b444d1cb709ce248d48f0a52a8501e26264403";
const HASHES_FILE = path.resolve(__dirname, "../generated/code_hashes.json");

// === Load keys and RPC from env ===
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC!;

// === ABI for register_code ===
const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "bytes32", name: "code_hash", type: "bytes32" }],
    name: "register_code",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

  const codeHashes: string[] = JSON.parse(fs.readFileSync(HASHES_FILE, "utf-8"));

  console.log(`Registering ${codeHashes.length} QR codes to contract: ${CONTRACT_ADDRESS}`);

  for (const hash of codeHashes) {
    try {
      const tx = await contract.register_code(hash);
      console.log(`Registered: ${hash} | TX: ${tx.hash}`);
      await tx.wait();
    } catch (err) {
      console.error(`Failed to register ${hash}:`, err);
    }
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
