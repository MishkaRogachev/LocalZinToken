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

  it("should reject mint with no minter set", async function () {
    const { token, owner } = await deployTokenFixture();
    const mintAmount = ethers.parseEther("1000");

    await expect(
      token.connect(owner).mint(owner.address, mintAmount)
    ).to.be.revertedWith("Minter should be set before minting");
  });

  it("should allow owner to set minter and emit event", async function () {
    const { token, owner, minter } = await deployTokenFixture();

    await expect(token.connect(owner).setMinter(minter.address))
      .to.emit(token, "MinterSet")
      .withArgs(minter.address);

    expect(await token.minter()).to.equal(minter.address);
  });
  
  it("should reject setting minter to zero address", async function () {
    const { token, owner } = await deployTokenFixture();

    await expect(
      token.connect(owner).setMinter(ethers.ZeroAddress)
    ).to.be.revertedWith("Minter cannot be the zero address");
  });

  it("should reject setting minter to current minter", async function () {
    const { token, owner, minter } = await deployTokenFixture();

    await token.connect(owner).setMinter(minter.address);

    await expect(
      token.connect(owner).setMinter(minter.address)
    ).to.be.revertedWith("Minter is already set to this address");
  });
  
  it("should only allow owner to set minter", async function () {
    const { token, minter, otherAccount } = await deployTokenFixture();

    await expect(
      token.connect(otherAccount).setMinter(minter.address)
    ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
  });

  it("should reject mint from unauthorized address", async function () {
    const { token, owner, minter } = await deployTokenFixture();

    await expect(token.connect(owner).setMinter(minter.address))
      .to.emit(token, "MinterSet")
      .withArgs(minter.address);

    const mintAmount = ethers.parseEther("1000");
    await expect(
      token.connect(owner).mint(minter.address, mintAmount)
    ).to.be.revertedWith("Only minter can mint tokens");
  });

  it("should only allow owner to set minter", async function () {
    const { token, minter, otherAccount } = await deployTokenFixture();

    await expect(
      token.connect(otherAccount).setMinter(minter.address)
    ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
  });
});
