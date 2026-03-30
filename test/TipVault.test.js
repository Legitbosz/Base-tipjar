const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("TipVault", function () {
  let vault, owner, tipper;

  beforeEach(async () => {
    [owner, tipper] = await ethers.getSigners();
    const TipVault = await ethers.getContractFactory("TipVault");
    vault = await TipVault.deploy(7); // 7 day lock
    await vault.waitForDeployment();
  });

  it("should accept tips", async () => {
    await vault.connect(tipper).tip({ value: ethers.parseEther("0.001") });
    expect(await vault.getBalance()).to.equal(ethers.parseEther("0.001"));
  });

  it("should not allow withdrawal before unlock", async () => {
    await vault.connect(tipper).tip({ value: ethers.parseEther("0.001") });
    await expect(vault.connect(owner).withdraw()).to.be.revertedWith("Vault is still locked");
  });

  it("should allow withdrawal after unlock time", async () => {
    await vault.connect(tipper).tip({ value: ethers.parseEther("0.001") });
    await time.increase(7 * 24 * 60 * 60 + 1);
    await expect(vault.connect(owner).withdraw()).to.not.be.reverted;
  });

  it("should show correct time until unlock", async () => {
    const timeLeft = await vault.timeUntilUnlock();
    expect(timeLeft).to.be.gt(0);
  });
});
