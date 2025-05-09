import { ethers } from "ethers";
import { wallet, tokenContract, airdropContract } from "./config";

async function run() {
  console.log("Starting integration test...");

  // Generate a random test code and keccak256 it
  const code = "TEST-" + Math.random().toString(36).substring(2, 10);
  const codeHash = ethers.keccak256(ethers.toUtf8Bytes(code));

  console.log("Generated test code:", code);
  console.log("Hashed code:", codeHash);

  // Check claimable (should be false)
  const initial = await airdropContract.canClaim(codeHash);
  console.log("Initially claimable:", initial);
  if (initial) throw new Error("Code should not be claimable yet");

  // Register the code
  console.log("Registering code...");
  await (await airdropContract.registerCode(codeHash)).wait();

  // Check again
  const afterRegister = await airdropContract.canClaim(codeHash);
  console.log("After register claimable:", afterRegister);
  if (!afterRegister) throw new Error("Code should be claimable after register");

  // Claim it
  console.log("Claiming airdrop...");
  await (await airdropContract.claim(codeHash)).wait();

  // Check balance
  const balance = await tokenContract.balanceOf(wallet.address);
  console.log("Token balance:", ethers.formatEther(balance));

  if (balance < ethers.parseEther("1000")) {
    throw new Error("Token amount mismatch: expected 1000");
  }

  console.log("Integration test passed.");
}

run().catch((err) => {
  console.error("Integration test failed:", err);
  process.exit(1);
});
