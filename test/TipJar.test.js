const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TipJar", function () {
  let tipJar;
  let owner;
  let tipper1;
  let tipper2;

  beforeEach(async function () {
    [owner, tipper1, tipper2] = await ethers.getSigners();

    const TipJar = await ethers.getContractFactory("TipJar");
    tipJar = await TipJar.deploy("Test Jar", "A test tip jar");
    await tipJar.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await tipJar.owner()).to.equal(owner.address);
    });

    it("Should set jar name and description", async function () {
      expect(await tipJar.jarName()).to.equal("Test Jar");
      expect(await tipJar.jarDescription()).to.equal("A test tip jar");
    });

    it("Should start with 0 tips", async function () {
      expect(await tipJar.getTipCount()).to.equal(0);
    });
  });

  describe("Tipping", function () {
    it("Should accept a tip with message and emoji", async function () {
  const tipAmount = ethers.parseEther("0.001");
  const tx = await tipJar.connect(tipper1).tip("Great work!", "🔥", { value: tipAmount });
  const receipt = await tx.wait();
  const block = await ethers.provider.getBlock(receipt.blockNumber);

  const event = receipt.logs
    .map((log) => { try { return tipJar.interface.parseLog(log); } catch { return null; } })
    .find((e) => e && e.name === "TipReceived");

  expect(event).to.not.be.null;
  expect(event.args.sender).to.equal(tipper1.address);
  expect(event.args.amount).to.equal(tipAmount);
  expect(event.args.message).to.equal("Great work!");
  expect(event.args.emoji).to.equal("🔥");
  expect(Number(event.args.timestamp)).to.equal(block.timestamp);
});

    it("Should reject tips below minimum", async function () {
      await expect(
        tipJar.connect(tipper1).tip("Too small", "💸", {
          value: ethers.parseEther("0.00001"),
        })
      ).to.be.revertedWith("Tip too small: minimum is 0.0001 ETH");
    });

    it("Should reject messages over 280 chars", async function () {
      const longMessage = "a".repeat(281);
      await expect(
        tipJar.connect(tipper1).tip(longMessage, "💬", {
          value: ethers.parseEther("0.001"),
        })
      ).to.be.revertedWith("Message too long: max 280 characters");
    });

    it("Should track total tips and count", async function () {
      const amount1 = ethers.parseEther("0.001");
      const amount2 = ethers.parseEther("0.002");

      await tipJar.connect(tipper1).tip("First tip!", "🚀", { value: amount1 });
      await tipJar.connect(tipper2).tip("Second tip!", "💜", { value: amount2 });

      expect(await tipJar.getTipCount()).to.equal(2);
      expect(await tipJar.totalTipCount()).to.equal(2);
      expect(await tipJar.totalTipsReceived()).to.equal(amount1 + amount2);
    });
  });

  describe("Withdrawal", function () {
    it("Should allow owner to withdraw", async function () {
      await tipJar
        .connect(tipper1)
        .tip("Keep it up!", "💪", { value: ethers.parseEther("0.01") });

      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      const jarBalance = await tipJar.getBalance();

      await expect(tipJar.connect(owner).withdraw())
        .to.emit(tipJar, "Withdrawn")
        .withArgs(owner.address, jarBalance);

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfter).to.be.gt(ownerBalanceBefore);
    });

    it("Should NOT allow non-owner to withdraw", async function () {
      await tipJar
        .connect(tipper1)
        .tip("Tip!", "💰", { value: ethers.parseEther("0.001") });

      await expect(tipJar.connect(tipper1).withdraw()).to.be.reverted;
    });
  });

  describe("getTips pagination", function () {
    it("Should return tips newest first", async function () {
      await tipJar.connect(tipper1).tip("First", "1️⃣", { value: ethers.parseEther("0.001") });
      await tipJar.connect(tipper1).tip("Second", "2️⃣", { value: ethers.parseEther("0.001") });
      await tipJar.connect(tipper1).tip("Third", "3️⃣", { value: ethers.parseEther("0.001") });

      const result = await tipJar.getTips(0, 3);
      expect(result[0].message).to.equal("Third");
      expect(result[1].message).to.equal("Second");
      expect(result[2].message).to.equal("First");
    });
  });
});

async function getTimestamp() {
  const block = await ethers.provider.getBlock("latest");
  return block.timestamp;
}
