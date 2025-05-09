import { TOKEN_ADDRESS, AIRDROP_ADDRESS, wallet, tokenContract, airdropContract } from "./config";

async function run() {
  console.log("Starting integration test...");

  // Set minter to airdrop contract
  console.log("Setting minter...");
  await (await tokenContract.setMinter(AIRDROP_ADDRESS)).wait();

  console.log("Initializing airdrop contract...");
  await (await airdropContract.init()).wait();

  // Get wallets
  console.log("Deployer wallet:", wallet.address);
  console.log("Contract owner:", await airdropContract.getOwner());

  // Set token address in airdrop contract
  console.log("Setting token address in airdrop...");
  await (await airdropContract.setTokenAddress(TOKEN_ADDRESS)).wait();

  console.log("Contract initialisation complete.");
}

run().catch((err) => {
  console.error("Contract initialisation failed:", err);
  process.exit(1);
});
