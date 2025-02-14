require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
// Ensure your configuration variables are set before executing the script
const { vars } = require("hardhat/config");

module.exports = {
  solidity: "0.8.24",
  paths: {
    sources: "./contracts",
  },
  networks: {
    sepolia: {
      url: https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY},
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
