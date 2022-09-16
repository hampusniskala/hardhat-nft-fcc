const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT Unit Tests", function () {
          let basicNft, deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["basicnft"])
              basicNft = await ethers.getContract("BasicNft")
          })

          describe("Construtor", () => {
              it("Initilizes the NFT Correctly.", async () => {
                  const name = await basicNft.name()
                  const symbol = await basicNft.symbol()
                  const tokenCounter = await basicNft.getTokenCounter()
                  assert.equal(name, "Identical Pugs")
                  assert.equal(symbol, "IDPUG")
                  assert.equal(tokenCounter.toString(), "0")
              })
          })

          describe("Mint NFT", () => {
              it("Allows users to mint an NFT, and updates appropriately", async function () {
                  const txResponse = await basicNft.mintNft()
                  await txResponse.wait(1)
                  const tokenURI = await basicNft.tokenURI(0)
                  const tokenCounter = await basicNft.getTokenCounter()

                  assert.equal(tokenCounter.toString(), "1")
                  assert.equal(tokenURI, await basicNft.TOKEN_URI())
              })
          })

          describe("Get Token Counter", () => {
              it("Gets the correct number of tokens", async function () {
                  const firstTokenCounter = await basicNft.getTokenCounter()
                  const mintOne = await basicNft.mintNft()
                  await mintOne.wait(1)
                  const secondTokenCounter = await basicNft.getTokenCounter()
                  const mintTwo = await basicNft.mintNft()
                  await mintTwo.wait(1)
                  const thirdTokenCounter = await basicNft.getTokenCounter()

                  assert.equal(firstTokenCounter, "0")
                  assert.equal(secondTokenCounter, "1")
                  assert.equal(thirdTokenCounter, "2")
              })
          })
      })
