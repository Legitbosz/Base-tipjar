const hre = require("hardhat");

async function main() {
  console.log("Deploying TipLeaderboard...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const TipLeaderboard = await hre.ethers.getContractFactory("TipLeaderboard");
  const contract = await TipLeaderboard.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("TipLeaderboard deployed to:", address);
}

main().catch((err) => { console.error(err); process.exit(1); });
