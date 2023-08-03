const { network, ethers } = require("hardhat")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("deploying Governance Token...")
    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
    })
    log(`deployed address${governanceToken.address}`)

    await delegate(governanceToken.address, deployer)
    log("delegated")
}

async function delegate(governanceTokenAddress, deletedAccount) {
    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress)
    const tx = await governanceToken.delegate(deletedAccount)
    await tx.wait(1)
    console.log(`Checkpoints ${await governanceToken.numCheckpoints(deletedAccount)}`)
}
