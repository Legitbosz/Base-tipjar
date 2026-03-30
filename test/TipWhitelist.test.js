const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TipWhitelist", function () {
  let whitelist, owner, allowed, notAllowed;

  beforeEach(async () => {
    [owner, allowed, notAllowed] = await ethers.getSigners();
    const TipWhitelist = await ethers.getContractFactory("TipWhitelist");
    whitelist = await TipWhitelist.deploy();
    await whitelist.waitForDeployment();
    await whitelist.connect(owner).addToWhitelist(allowed.address);
  });

  it("should allow whitelisted address to tip", async () => {
    await expect(
      whitelist.connect(allowed).tip({ value: ethers.parseEther("0.001") })
    ).to.not.be.reverted;
  });

  it("should reject non-whitelisted address", async () => {
    await expect(
      whitelist.connect(notAllowed).tip({ value: ethers.parseEther("0.001") })
    ).to.be.revertedWith("Not whitelisted");
  });

  it("should remove from whitelist", async () => {
    await whitelist.connect(owner).removeFromWhitelist(allowed.address);
    await expect(
      whitelist.connect(allowed).tip({ value: ethers.parseEther("0.001") })
    ).to.be.revertedWith("Not whitelisted");
  });

  it("should track total tipped per address", async () => {
    await whitelist.connect(allowed).tip({ value: ethers.parseEther("0.001") });
    expect(await whitelist.totalTipped(allowed.address)).to.equal(ethers.parseEther("0.001"));
  });
});
