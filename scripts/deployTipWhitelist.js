const hre = require("hardhat");

async function main() {
  console.log("Deploying TipWhitelist...");
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const TipWhitelist = await hre.ethers.getContractFactory("TipWhitelist");
  const contract = await TipWhitelist.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("TipWhitelist deployed to:", address);
}

main().catch((err) => { console.error(err); process.exit(1); });
