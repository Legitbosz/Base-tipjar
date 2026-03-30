const hre = require("hardhat");

async function main() {
  console.log("Deploying TipSubscription...");
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const TipSubscription = await hre.ethers.getContractFactory("TipSubscription");
  const contract = await TipSubscription.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("TipSubscription deployed to:", address);
}

main().catch((err) => { console.error(err); process.exit(1); });
