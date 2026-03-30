const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TipSplitter", function () {
  let splitter, owner, wallet1, wallet2, tipper;

  beforeEach(async () => {
    [owner, wallet1, wallet2, tipper] = await ethers.getSigners();
    const TipSplitter = await ethers.getContractFactory("TipSplitter");
    splitter = await TipSplitter.deploy(
      [wallet1.address, wallet2.address],
      [70, 30]
    );
    await splitter.waitForDeployment();
  });

  it("should deploy with correct recipients", async () => {
    const r0 = await splitter.recipients(0);
    const r1 = await splitter.recipients(1);
    expect(r0.share).to.equal(70);
    expect(r1.share).to.equal(30);
  });

  it("should split tips correctly", async () => {
    const before1 = await ethers.provider.getBalance(wallet1.address);
    const before2 = await ethers.provider.getBalance(wallet2.address);

    await tipper.sendTransaction({
      to: await splitter.getAddress(),
      value: ethers.parseEther("0.1"),
    });

    const after1 = await ethers.provider.getBalance(wallet1.address);
    const after2 = await ethers.provider.getBalance(wallet2.address);

    expect(after1 - before1).to.equal(ethers.parseEther("0.07"));
    expect(after2 - before2).to.equal(ethers.parseEther("0.03"));
  });

  it("should reject shares not adding to 100", async () => {
    const TipSplitter = await ethers.getContractFactory("TipSplitter");
    await expect(
      TipSplitter.deploy([wallet1.address, wallet2.address], [60, 30])
    ).to.be.revertedWith("Shares must add up to 100");
  });
});
