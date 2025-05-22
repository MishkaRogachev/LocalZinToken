import { ethers } from "ethers";
import { wallet, tokenContract, airdropContract } from "./config";

async function run() {
  console.log("Starting integration test...");

  // Generate a time-based test code and keccak256 it
  const code = `TEST-${Date.now()}`;
  const codeHash = ethers.keccak256(ethers.toUtf8Bytes(code));

  console.log("Generated test code:", code);
  console.log("Hashed code:", codeHash);

  // Check claim status (should be 0)
  let status = await airdropContract.getClaimStatus(codeHash);
  console.log("Claim status:", status.toString());
  if (status) throw new Error("Code should be unregistered");

  // Try to claim before registration (should revert)
  console.log("Trying to claim before registration (should fail)...");
  try {
    await (await airdropContract.claim(codeHash)).wait();
    throw new Error("Claim should have failed before code was registered");
  } catch (err: any) {
    if (!err.message.includes("reverted")) {
      throw new Error("Unexpected error during early claim: " + err.message);
    }
    console.log("Claim correctly failed before registration.");
  }

  // Register the code
  console.log("Registering code...");
  await (await airdropContract.registerCode(codeHash)).wait();

  // Check claim status (should be 1)
  status = await airdropContract.getClaimStatus(codeHash);
  console.log("Claim status:", status.toString());
  if (status != 1) throw new Error("Code should be registered");

  // Claim it
  console.log("Claiming airdrop...");
  await (await airdropContract.claim(codeHash)).wait();

  // Check balance
  const balance = await tokenContract.balanceOf(wallet.address);
  console.log("Token balance (raw):", balance.toString());

  if (balance < 1000) {
    throw new Error("Token amount mismatch: expected 1000");
  }

  // Check claim status (should be 2)
  status = await airdropContract.getClaimStatus(codeHash);
  console.log("Claim status:", status.toString());
  if (status != 2) throw new Error("Code should be claimed");

  console.log("Integration test passed.");
}

run().catch((err) => {
  console.error("Integration test failed:", err);
  process.exit(1);
});
