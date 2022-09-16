const { developmentChains } = require("../helper-hardhat-config")
const DECIMALS = "18"
const INITIAL_PRICE = ethers.utils.parseUnits("2000", "ether")
const BASE_FEE = ethers.utils.parseEther("0.25") // the premium. it cost 0.25 LINK per request
const GAS_PRICE_LINK = 1e9 //link per gas. calculated based on gas
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        log("Mocks Deployed!")
        log("---------------------------------")
    }
}

module.exports.tags = ["all", "mocks", "randomipfsnft"]
