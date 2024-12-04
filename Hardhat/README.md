# Setup hardhat (https://hardhat.org/hardhat-runner/docs/getting-started)
npm install --save-dev hardhat
npx hardhat init
npx hardhat
npx hardhat compile
npx hardhat test
npx hardhat ignition deploy ./ignition/modules/Token.js
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Token.js --network localhost