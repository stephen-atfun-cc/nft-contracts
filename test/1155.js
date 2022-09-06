const { expect } = require('chai')
const { ethers } = require('hardhat')
const helpers = require("@nomicfoundation/hardhat-network-helpers")

describe('1155合约', function () {
  it("测试部署铸造转账", async function () {
    const [owner, one, twe, three] = await hre.ethers.getSigners()

    // 部署合约
    const Factory = await ethers.getContractFactory('NFTBox')
    const contract = await Factory.deploy()
    await contract.deployed()

    console.log('NFTBox deployed to:', contract.address)
    // 铸造藏品
    let tx = await contract.mint(
      one.address,
      1,
      5000,
      ethers.utils.formatBytes32String('HelloWorld')
    )
    await tx.wait()
    // 转账藏品
    tx = await contract.transferByOwner(
      one.address,
      twe.address,
      1,
      300,
      ethers.utils.formatBytes32String('')
    )
    await tx.wait()
    // 批量铸造藏品
    tx = await contract.mintBatch(
      one.address,
      [2, 3, 4],
      [5000, 6000, 7000],
      ethers.utils.formatBytes32String('HelloWorld')
    )
    await tx.wait()

    tx = await contract.connect(twe).safeTransferFrom(
      twe.address,
      three.address,
      1,
      1,
      ethers.utils.formatBytes32String(''),
    )
    await tx.wait()

    console.log('one 的余额：', (await contract.balanceOf(one.address, 1)).toNumber())
    console.log('twe 的余额：', (await contract.balanceOf(twe.address, 1)).toNumber())
    console.log('three 的余额：', (await contract.balanceOf(three.address, 1)).toNumber())

    console.log('2号藏品余额：', (await contract.balanceOf(one.address, 2)).toNumber())
    console.log('3号藏品余额：', (await contract.balanceOf(one.address, 3)).toNumber())
    console.log('4号藏品余额：', (await contract.balanceOf(one.address, 4)).toNumber())

    await expect(4700).to.equal((await contract.balanceOf(one.address, 1)).toNumber())
    await expect(299).to.equal((await contract.balanceOf(twe.address, 1)).toNumber())
    await expect(1).to.equal((await contract.balanceOf(three.address, 1)).toNumber())

    await expect(5000).to.equal((await contract.balanceOf(one.address, 2)).toNumber())
    await expect(6000).to.equal((await contract.balanceOf(one.address, 3)).toNumber())
    await expect(7000).to.equal((await contract.balanceOf(one.address, 4)).toNumber())
  })

  it("测试权限判断", async function () {
    const [owner, one, twe, three] = await hre.ethers.getSigners()

    // 部署合约
    const Factory = await ethers.getContractFactory('NFTBox')
    const contract = await Factory.deploy()
    await contract.deployed()

    console.log('NFTBox deployed to:', contract.address)

    // 无权限铸造
    await expect(
      contract.connect(one).mint(
        one.address,
        1,
        5000,
        ethers.utils.formatBytes32String('HelloWorld')
      )
    ).to.be.revertedWith('Ownable: caller is not the owner')

    // 无余额转账
    await expect(
      contract.safeTransferFrom(
        owner.address,
        one.address,
        1,
        1,
        ethers.utils.formatBytes32String(''),
      )
    ).to.be.revertedWith('ERC1155: insufficient balance for transfer')

    let tx = await contract.mint(
      owner.address,
      1,
      100,
      ethers.utils.formatBytes32String('')
    )
    await tx.wait()

    // 无权限转账
    await expect(
      contract.safeTransferFrom(
        one.address,
        twe.address,
        1,
        1,
        ethers.utils.formatBytes32String(''),
      )
    ).to.be.revertedWith('ERC1155: caller is not token owner nor approved')


    // 无权限转账
    await expect(
      contract.connect(three).transferByOwner(
        one.address,
        twe.address,
        1,
        1,
        ethers.utils.formatBytes32String(''),
      )
    ).to.be.revertedWith('Ownable: caller is not the owner')
  })
})
