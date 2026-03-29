const hre = require("hardhat");

async function main() {
  console.log("Deploying TipSplitter...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 70% to you, 30% to a second wallet — change these addresses!
  const wallets = [
    deployer.address,
    deployer.address, // replace with second wallet address
  ];
  const shares = [70, 30];

  const TipSplitter = await hre.ethers.getContractFactory("TipSplitter");
  const contract = await TipSplitter.deploy(wallets, shares);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("TipSplitter deployed to:", address);
}

main().catch((err) => { console.error(err); process.exit(1); });
