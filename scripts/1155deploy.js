const hre = require('hardhat')

// 部署合约
async function main () {
  const [owner] = await hre.ethers.getSigners()

  // 武汉链查询余额的算法
  let cny = (await owner.getBalance()) / (hre.ethers.BigNumber.from('4200000000000000'))
  console.log(owner.address, Math.ceil(cny * 1000) / 1000)
  
  const Factory = await ethers.getContractFactory('NFTBox')
  const contract = await Factory.deploy()
  await contract.deployed()
  console.log('NFTBox deployed to:', contract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
