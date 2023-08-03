const { network, ethers } = require("hardhat")
const { VOTING_PERIOD, VOTING_DELAY, QUORUM_PERCENTAGE } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const governanceToken = await get("GovernanceToken")
    const timeLock = await get("TimeLock")
    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        args: [
            governanceToken.address,
            timeLock.address,
            QUORUM_PERCENTAGE,
            VOTING_DELAY,
            VOTING_PERIOD,
        ],
        log: true,
    })
}
