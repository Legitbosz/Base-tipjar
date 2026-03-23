const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  TipJar — Deploying to Base");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Deployer address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy TipJar
  const TipJar = await ethers.getContractFactory("TipJar");
  const tipJar = await TipJar.deploy(
    "My Tip Jar",
    "Buy me a coffee ☕ — or a lamborghini 🏎️"
  );

  await tipJar.waitForDeployment();

  const address = await tipJar.getAddress();

  console.log("✅ TipJar deployed!");
  console.log("   Contract address:", address);
  console.log("   Network:", hre.network.name);
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Next Steps");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("1. Copy the contract address above");
  console.log("2. Add it to frontend/src/utils/config.js");
  console.log("3. Verify on Basescan:");
  console.log(`   npx hardhat verify --network ${hre.network.name} ${address} "My Tip Jar" "Buy me a coffee ☕ — or a lamborghini 🏎️"`);

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    address: address,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    jarName: "My Tip Jar",
  };

  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n📄 Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
