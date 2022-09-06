const hre = require('hardhat')

async function main () {
  const [owner] = await ethers.getSigners()

  // 武汉链查询余额的算法
  let cny = (await owner.getBalance()) / hre.ethers.BigNumber.from('4200000000000000')

  // 初始化合约
  let Factory, contract
  const networkName = hre.network.name
  if (networkName === 'hardhat') {
    Factory = await ethers.getContractFactory('NFTBox')
    contract = await Factory.deploy()
    await contract.deployed()
  } else {
    const NFTBox = '0x283d3d9050BeECB5c10b3C2973A39123D03a49c6'
    Factory = await ethers.getContractFactory('NFTBox')
    contract = await Factory.attach(NFTBox)
  }
  console.log('NFTBox address to:', contract.address)

  // 铸造藏品
  const tokenid = 1
  let tx = await contract.mint(
    owner.address,
    tokenid,
    100,
    ethers.utils.formatBytes32String('HelloWorld')
  )
  await tx.wait()

  let last = (await owner.getBalance()) / hre.ethers.BigNumber.from('4200000000000000')
  console.log(owner.address, Math.ceil(cny * 1000) / 1000)
  console.log(owner.address, Math.ceil(last * 1000) / 1000)
  console.log('花费： ', cny - last)

  console.log('Token: ',(await contract.balanceOf(owner.address, tokenid)).toNumber())
  console.log('URI:',await contract.uri(tokenid))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
