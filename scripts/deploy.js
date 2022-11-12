const hre = require("hardhat");

async function main(){
    //Get the contract to deploy and deploy
  const BuyMeACoffeeFactory = await hre.ethers.getContractFactory('BuyMeACoffee');
  const buyMeACoffee = await BuyMeACoffeeFactory.deploy();
  await buyMeACoffee.deployed();

  console.log("BuyMeACoffee deployed to: ",buyMeACoffee.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });