import * as dotenv from "dotenv";
import * as path from "path";
import fs from "fs";
import { ethers } from "ethers";

// === Load env ===
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const {
  PRIVATE_KEY,
  ARBITRUM_MAINNET_RPC,
  ARBITRUM_SEPOLIA_RPC,
} = process.env;

// === Config ===
export const IS_DEVNET = true;
export const TOKEN_ADDRESS = "0x08C0898237D1906b9b39c8dA6249aC24D8fBC6Af";         // Replace with latest solidity contract address
export const AIRDROP_ADDRESS = "0xf019372561a280c8a6018b2c354d3b03dd9113f9";       // Replace with latest stylus contract address

const RPC_URL = IS_DEVNET ? ARBITRUM_SEPOLIA_RPC! : ARBITRUM_MAINNET_RPC!;
export const provider = new ethers.JsonRpcProvider(RPC_URL);
export const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);

// === ABI definitions ===
const tokenAbiPath = path.resolve(__dirname, "../../solidity/artifacts/contracts/LocalZinToken.sol/LocalZinToken.json");
const tokenJson = JSON.parse(fs.readFileSync(tokenAbiPath, "utf8"));

// Stylus contract ABI
const abiPath = path.resolve(__dirname, "../../stylus/abi/local_zin_airdrop.abi");
const airdropAbi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

// === Contracts ===
export const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenJson.abi, wallet);
export const airdropContract = new ethers.Contract(AIRDROP_ADDRESS, airdropAbi, wallet);