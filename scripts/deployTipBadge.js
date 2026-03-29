const hre = require("hardhat");

async function main() {
  console.log("Deploying TipBadge...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const TipBadge = await hre.ethers.getContractFactory("TipBadge");
  const contract = await TipBadge.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("TipBadge deployed to:", address);
}

main().catch((err) => { console.error(err); process.exit(1); });
