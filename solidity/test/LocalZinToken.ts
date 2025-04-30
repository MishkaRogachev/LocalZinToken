import { expect } from "chai";
import { ethers } from "hardhat";

describe("LocalZinToken", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTokenFixture() {
    const [owner, minter, otherAccount] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("LocalZinToken");
    const token = await Token.deploy(owner.address);

    return { token, owner, minter, otherAccount };
  }

  it("should assign ownership correctly", async function () {
    const { token, owner } = await deployTokenFixture();
    expect(await token.owner()).to.equal(owner.address);
  });

  it("should allow authorized minter to mint", async function () {
    const { token, owner, minter } = await deployTokenFixture();
    const mintAmount = ethers.parseEther("1000");

    await token.connect(owner).setMinter(minter.address);
    await token.connect(minter).mint(minter.address, mintAmount);

    const balance = await token.balanceOf(minter.address);
    expect(balance).to.equal(mintAmount);
  });

  it("should reject mint from unauthorized address", async function () {
    const { token, otherAccount } = await deployTokenFixture();
    const mintAmount = ethers.parseEther("1000");

    await expect(
      token.connect(otherAccount).mint(otherAccount.address, mintAmount)
    ).to.be.revertedWith("Only minter is authorized for mining tokens");
  });

  it("should only allow owner to set minter", async function () {
    const { token, minter, otherAccount } = await deployTokenFixture();

    await expect(
      token.connect(otherAccount).setMinter(minter.address)
    ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
  });
});
