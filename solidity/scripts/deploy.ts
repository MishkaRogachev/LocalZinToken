import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying to network: ${network.name}`);
  console.log(`Deployer address: ${deployer.address}`);

  const Token = await ethers.getContractFactory("LocalZinToken");
  const contract = await Token.deploy(deployer.address);
  await contract.waitForDeployment();

  console.log(`✅ Token deployed at: ${await contract.getAddress()}`);
  console.log(`Owner: ${await contract.owner()}`);
  console.log(`Name: ${await contract.name()}`);
  console.log(`Symbol: ${await contract.symbol()}`);

  const minter = await contract.minter();
  if (minter !== ethers.ZeroAddress) {
    console.log(`Minter already set to: ${minter}`);
  } else {
    console.log(`ℹ️ Minter not set yet`);
  }
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});