const hre = require('hardhat')

async function main () {
  const [owner] = await hre.ethers.getSigners()

  // 武汉链查询余额的算法
  let cny = (await owner.getBalance()) / hre.ethers.BigNumber.from('4200000000000000')

  const receiverAddres = '0x9cf74f4bfdf7027f3af5e94790613f9874f7147d'
  const tokenid = 1
  // 初始化合约
  let Factory, contract
  const networkName = hre.network.name
  if (networkName === 'hardhat') {
    Factory = await ethers.getContractFactory('NFTBox')
    contract = await Factory.deploy()
    await contract.deployed()
    // 铸造藏品
    let tx = await contract.mint(
      owner.address,
      tokenid,
      100,
      ethers.utils.formatBytes32String('HelloWorld')
    )
    await tx.wait()
  } else {
    const NFTBox = '0x93341b575d87e790bc2adFA590baD43282c5bfC0'
    Factory = await ethers.getContractFactory('NFTBox')
    contract = await Factory.attach(NFTBox)
  }
  console.log('NFTBox address to:', contract.address)

  // 藏品转移
  const tx = await contract.safeTransferFrom(
    owner.address,
    receiverAddres,
    tokenid,
    1,
    ethers.utils.formatBytes32String(''),
  )

  const receipt = await tx.wait()
  console.log('safeTransferFrom: ', receipt.from, ' => ', receipt.to)

  let last = (await owner.getBalance()) / hre.ethers.BigNumber.from('4200000000000000')
  console.log(owner.address, Math.ceil(cny * 1000) / 1000)
  console.log(owner.address, Math.ceil(last * 1000) / 1000)
  console.log('花费： ', cny - last)

  console.log(owner.address, (await contract.balanceOf(owner.address, tokenid)).toNumber())
  console.log(receiverAddres, (await contract.balanceOf(receiverAddres, tokenid)).toNumber())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
