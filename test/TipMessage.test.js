const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TipMessage", function () {
  let tipMsg, owner, tipper;

  beforeEach(async () => {
    [owner, tipper] = await ethers.getSigners();
    const TipMessage = await ethers.getContractFactory("TipMessage");
    tipMsg = await TipMessage.deploy();
    await tipMsg.waitForDeployment();
  });

  it("should accept a public tip with message", async () => {
    await tipMsg.connect(tipper).tipWithMessage("Hello world!", false, {
      value: ethers.parseEther("0.001"),
    });
    expect(await tipMsg.getMessageCount()).to.equal(1);
  });

  it("should accept a private tip", async () => {
    await tipMsg.connect(tipper).tipWithMessage("Secret!", true, {
      value: ethers.parseEther("0.001"),
    });
    expect(await tipMsg.getMessageCount()).to.equal(1);
  });

  it("should reject messages that are too long", async () => {
    const longMsg = "a".repeat(501);
    await expect(
      tipMsg.connect(tipper).tipWithMessage(longMsg, false, {
        value: ethers.parseEther("0.001"),
      })
    ).to.be.revertedWith("Message too long");
  });

  it("should track total received", async () => {
    await tipMsg.connect(tipper).tipWithMessage("Hi", false, {
      value: ethers.parseEther("0.001"),
    });
    expect(await tipMsg.totalReceived()).to.equal(ethers.parseEther("0.001"));
  });
});
