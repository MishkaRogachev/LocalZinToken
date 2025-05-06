import { ethers } from "hardhat";

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_SEPOLIA_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  console.log("Wallet address:", await wallet.getAddress());
  const nonce = await wallet.getNonce();
  console.log("Nonce:", ethers.formatEther(nonce));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});