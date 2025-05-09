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
export const TOKEN_ADDRESS = "0x6cB5AA5EE9eF0BF6b582f0617128893715C8F05A";         // Replace with actual token address
export const AIRDROP_ADDRESS = "0x44fa600b852047959af2e4f5b416bab27720ddf8";       // Replace with actual stylus contract address

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