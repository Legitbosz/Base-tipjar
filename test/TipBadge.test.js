const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TipBadge", function () {
  let badge, owner, tipper;

  beforeEach(async () => {
    [owner, tipper] = await ethers.getSigners();
    const TipBadge = await ethers.getContractFactory("TipBadge");
    badge = await TipBadge.deploy();
    await badge.waitForDeployment();
  });

  it("should start with no badge", async () => {
    expect(await badge.getBadgeName(tipper.address)).to.equal("None");
  });

  it("should award Bronze badge", async () => {
    await badge.connect(tipper).tip({ value: ethers.parseEther("0.001") });
    expect(await badge.getBadgeName(tipper.address)).to.equal("Bronze");
  });

  it("should award Silver badge", async () => {
    await badge.connect(tipper).tip({ value: ethers.parseEther("0.01") });
    expect(await badge.getBadgeName(tipper.address)).to.equal("Silver");
  });

  it("should award Gold badge", async () => {
    await badge.connect(tipper).tip({ value: ethers.parseEther("0.1") });
    expect(await badge.getBadgeName(tipper.address)).to.equal("Gold");
  });

  it("should reject tips below minimum", async () => {
    await expect(
      badge.connect(tipper).tip({ value: ethers.parseEther("0.00001") })
    ).to.be.reverted;
  });
});
