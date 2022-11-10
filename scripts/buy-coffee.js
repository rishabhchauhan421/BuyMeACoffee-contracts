// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  //Get Example Contract
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  //Get the contract to deploy and deploy
  const BuyMeACoffeeFactory = await hre.ethers.getContractFactory('BuyMeACoffee');
  const buyMeACoffee = await BuyMeACoffeeFactory.deploy();
  await buyMeACoffee.deployed();

  console.log("BuyMeACoffee deployed to: ",buyMeACoffee.address);

  //check balances before coffee purchase
  const addresses = [owner.address, tipper1.address, buyMeACoffee.address];

  console.log("== START ==");
  await PrintBalances(addresses);

  //buy the owner a few coffee
  const tip = {value: hre.ethers.utils.parseEther("1")};
  await buyMeACoffee.connect(tipper1).buyCoffee("Ram","Hello", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Shyam","The best", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Test Person","Yup, you are the one!!", tip);


  //check balances after coffee purchases

  console.log("== BOUGHT COFFEE ==");
  await PrintBalances(addresses);

  //Withdraw funds
  await buyMeACoffee.connect(owner).withdrawTips();


  //check balance after withdraw
  console.log("== AFTER WITHDRAW TIPS ==");
  await PrintBalances(addresses);


  //Read all the memos left for the owner.
  console.log("== Memos ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//Returns Ether balance of a given address
async function getBalance(address){
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

//Log ether balances for a list of addresses
async function PrintBalances(addresses){
  let idx=0;
  for(const address of addresses){
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

//Logs the memos stored on-chain from coffee purchases
async function printMemos(memos){
  for(const memo of memos){
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}