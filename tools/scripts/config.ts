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
export const TOKEN_ADDRESS_DEVNET = "0x08C0898237D1906b9b39c8dA6249aC24D8fBC6Af";
export const TOKEN_ADDRESS_MAINNET = "0x8703bc6F9Ca3293C5aCf258dd961caA22a9e289f";
export const AIRDROP_ADDRESS_DEVNET = "0xf019372561a280c8a6018b2c354d3b03dd9113f9";
export const AIRDROP_ADDRESS_MAINNET = "0x947b339a02fa36ef8f9fee6d5810b2eb5c9d2744";

export const TOKEN_ADDRESS = IS_DEVNET ? TOKEN_ADDRESS_DEVNET : TOKEN_ADDRESS_MAINNET;
export const AIRDROP_ADDRESS = IS_DEVNET ? AIRDROP_ADDRESS_DEVNET : AIRDROP_ADDRESS_MAINNET;

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
