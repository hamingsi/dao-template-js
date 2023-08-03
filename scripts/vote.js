const { network, ethers } = require("hardhat")
const { proposalsFile, developmentChains, VOTING_PERIOD } = require("../helper-hardhat-config")
const fs = require("fs")
const { moveBlocks } = require("../utils/move-block")

const index = 0

async function main(proposalIndex) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile), "utf8")
    const proposalId = proposals[network.config.chainId][proposalIndex]

    // 0 = against 1 = for
    const voteWay = 1
    const governor = await ethers.getContract("GovernorContract")
    const reason = "I do like to do something"
    const voteTxREsponse = await governor.castVoteWithReason(proposalId, voteWay, reason)
    await voteTxREsponse.wait(1)
    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }
    console.log("Voted! Ready to go")
}

main(index)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
