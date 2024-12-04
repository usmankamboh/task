import React, { useState } from 'react';
import { ethers } from 'ethers';
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contractABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function mint(address to, uint256 amount) public",
  "function transfer(address to, uint256 amount) public"
];

const App = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenBalance, setTokenBalance] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  // Function to connect MetaMask
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const userAccounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const userAccount = userAccounts[0];

        // Check for Sepolia Network
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0xaa36a7') { // Sepolia network ID
          alert('Please switch to Sepolia network');
          return;
        }

        // Set up provider and contract
        const userProvider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/infura key`);
        const userContract = new ethers.Contract(contractAddress, contractABI, userProvider);
        setAccount(userAccount);
        setProvider(userProvider);
        setContract(userContract);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('MetaMask not detected');
    }
  };

  // Query token balance
  const queryBalance = async () => {
    if (contract && account) {
      try {
        const balance = await contract.balanceOf(account);
        setTokenBalance(ethers.formatUnits(balance, 6)); // Assuming 6 decimals for token
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Mint tokens
  const mintTokens = async () => {
    if (contract && account && mintAddress && mintAmount) {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const mintTx = await contractWithSigner.mint(mintAddress, ethers.parseUnits(mintAmount, 6));
        await mintTx.wait();
        alert('Minted successfully!');
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Transfer tokens
  const transferTokens = async () => {
    if (contract && account && transferAddress && transferAmount) {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const transferTx = await contractWithSigner.transfer(transferAddress, ethers.parseUnits(transferAmount, 6));
        await transferTx.wait();
        alert('Transfer successful!');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h1>Token Interaction with Sepolia</h1>
      {!account ? (
        <button onClick={connectMetaMask}>Connect MetaMask</button>
      ) : (
        <div>
          <p>Connected account: {account}</p>
          <p>Token Balance: {tokenBalance}</p>
          <button onClick={queryBalance}>Query Balance</button>
          <div>
            <h3>Mint Tokens</h3>
            <input
              type="text"
              placeholder="Address to mint"
              value={mintAddress}
              onChange={(e) => setMintAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="Amount to mint"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
            />
            <button onClick={mintTokens}>Mint Tokens</button>
          </div>
          <div>
            <h3>Transfer Tokens</h3>
            <input
              type="text"
              placeholder="Recipient Address"
              value={transferAddress}
              onChange={(e) => setTransferAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="Amount to transfer"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
            <button onClick={transferTokens}>Transfer Tokens</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
