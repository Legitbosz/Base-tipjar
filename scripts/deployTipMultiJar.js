const hre = require("hardhat");

async function main() {
  console.log("Deploying TipMultiJar...");
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const TipMultiJar = await hre.ethers.getContractFactory("TipMultiJar");
  const contract = await TipMultiJar.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("TipMultiJar deployed to:", address);
}

main().catch((err) => { console.error(err); process.exit(1); });
