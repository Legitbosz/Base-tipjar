const hre = require("hardhat");

async function main() {
  console.log("Deploying TipDAO...");
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const TipDAO = await hre.ethers.getContractFactory("TipDAO");
  const contract = await TipDAO.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("TipDAO deployed to:", address);
}

main().catch((err) => { console.error(err); process.exit(1); });
