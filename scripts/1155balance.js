const hre = require('hardhat')

async function main () {
  const [owner] = await hre.ethers.getSigners()

  // 武汉链查询余额的算法
  let cny = ((await owner.getBalance()).div(hre.ethers.BigNumber.from('4200000000000000'))).toNumber()
  console.log(owner.address, cny)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
