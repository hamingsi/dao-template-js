const { ethers, network } = require("hardhat")
const {
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    VOTING_DELAY,
    proposalsFile,
} = require("../helper-hardhat-config")
const { moveBlocks } = require("../utils/move-block")
const fs = require("fs")

async function propose(args, functionToCall, proposalDescription) {
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")
    // encode your function and data into bytes
    // send them to governor contract
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)

    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
    console.log(`Proposal Description: \n ${proposalDescription}`)

    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    )
    const proposeReceipt = await proposeTx.wait(1)

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1)
    }
    const proposalId = proposeReceipt.events[0].args.proposalId
    console.log(`proposal state${await governor.state(proposalId)}`)
    let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    proposals[network.config.chainId.toString()].push(proposalId.toString())
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals))
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
