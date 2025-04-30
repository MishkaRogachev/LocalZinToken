import { expect } from "chai";
import { ethers } from "hardhat";

const PREMINT_AMOUNT = ethers.parseUnits("100000", 18);

describe("LocalZinToken", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTokenFixture() {
    const [recipient, owner, otherAccount] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("LocalZinToken");

    const token = await Token.deploy(recipient.address, owner.address);

    return { token, recipient, owner, otherAccount };
  }

  it("should assign ownership correctly", async function () {
    const { token, owner } = await deployTokenFixture();
    expect(await token.owner()).to.equal(owner.address);
  });

  it("should premint 100,000 tokens to recipient", async function () {
    const { token, recipient } = await deployTokenFixture();
    const balance = await token.balanceOf(recipient.address);
    expect(balance).to.equal(PREMINT_AMOUNT);
  });

  it("should allow owner to mint", async function () {
    const { token, owner } = await deployTokenFixture();
    const mintAmount = ethers.parseEther("1000");

    await token.connect(owner).mint(owner.address, mintAmount);
    const balance = await token.balanceOf(owner.address);
    expect(balance).to.equal(mintAmount);

    const totalSupply = await token.totalSupply();
    expect(totalSupply).to.equal(PREMINT_AMOUNT + mintAmount);
  });

  it("should not allow non-owner to mint", async function () {
    const { token, otherAccount } = await deployTokenFixture();
    const mintAmount = ethers.parseEther("1000");

    await expect(
      token.connect(otherAccount).mint(otherAccount.address, mintAmount)
    ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
     .withArgs(otherAccount.address);
  });
});
