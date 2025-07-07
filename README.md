# 🗳️ Decentralized Voting System

A blockchain-based voting system built on Ethereum that ensures secure, transparent, and tamper-proof elections. 🔐✨

Link to the project deployed to the SEPOLIA TESTNET - https://decentra-voting-system.netlify.app/

## 🔍 How It Works

This system uses smart contracts on the Ethereum blockchain to manage the entire voting process:

1. **👥 Voter Registration**: Users register with their Aadhaar number and Voter ID
2. **🏛️ Candidate Registration**: Registered voters can register as candidates
3. **🗳️ Voting**: Registered voters can vote for candidates (one vote per person)
4. **📊 Results**: Real-time vote counting and winner determination

All data is stored on the blockchain, making it immutable and transparent. 🔒

## 📋 Prerequisites

- **🦊 MetaMask**: Install the MetaMask browser extension
- **💎 Ethereum**: Have some ETH for transaction fees
- **🗂️ IPFS**: Access to upload candidate images (optional)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/decentralized-voting-system.git
cd decentralized-voting-system
```

### 2. Deploy Smart Contract (If needed)
- Deploy `DecentralizedVotingSystem.sol` to Ethereum network
- Update contract address in `script.js` if you deploy your own contract

### 3. Setup Frontend
- No build process required - pure HTML/CSS/JS ✨
- Simply open `index.html` in your browser
- Or serve it using any web server

## ⚙️ Setup

1. **🦊 Install MetaMask** and create/import an Ethereum wallet
2. **🌐 Connect to Network**: Switch to the network where the contract is deployed
3. **💻 Open Website**: Load the `index.html` file in your browser
4. **🔗 Connect Wallet**: Click connect when MetaMask prompts

## 📖 How to Use

### Step 1: Register as Voter 👥

Before you can vote or become a candidate, you must register:

1. Click the **"Login"** button 🔐
2. Fill in your details:
   - **📄 Aadhaar Number**: 12-digit number
   - **🆔 Voter ID**: 10-character ID
   - **🎂 Age**: Must be 18 or above
3. Click **"Register"** and confirm the transaction in MetaMask ✅

### Step 2: Register as Candidate (Optional) 🏛️

If you want to run for election:

1. Click **"Register as Candidate"** 🎯
2. Fill in your details:
   - **📝 Full Name**
   - **🎂 Age**: Must match your voter registration age
   - **🔢 Candidate ID**: Unique number
   - **📸 Image CID**: Upload your photo to IPFS and enter the CID
3. Click **"Register"** and confirm the transaction ✅

### Step 3: Vote 🗳️

1. Browse the list of candidates on the main page 👀
2. Click the **"Vote"** button for your preferred candidate ✋
3. Confirm the transaction in MetaMask 💎
4. Wait for the transaction to be confirmed ⏳

### Step 4: View Results 📊

- **📈 Current Vote Count**: Click "View Vote Count" to see how many votes each candidate has
- **🏆 Election Winner**: Click "View Results" to see who is currently winning

## ⚠️ Important Rules

- 🔞 You must be 18 or older to participate
- 🎯 Each person can only register once (using unique Aadhaar/Voter ID)
- 🗳️ Each registered voter can vote only once
- 👥 Only registered voters can become candidates
- 💸 All transactions require gas fees (ETH)

## 🔧 Technical Details

- **📜 Smart Contract**: Written in Solidity ^0.8.0
- **🌐 Frontend**: HTML, CSS, JavaScript with Web3.js
- **💾 Storage**: Candidate images stored on IPFS
- **⛓️ Network**: Ethereum blockchain

## 📍 Contract Address

The smart contract is deployed at: `0x6F4Ed69DCFc56e9966d3b0C3711B53c434c47dD9`

## 🚨 Troubleshooting

**"Please install MetaMask"** 🦊: Install the MetaMask browser extension

**Transaction Failed** ❌: 
- Check if you have enough ETH for gas fees 💰
- Make sure you're connected to the correct network 🌐
- Verify your input data is correct ✅

**"You must register"** 📝: Complete voter registration first before voting or registering as candidate

**"Already registered"** 🔄: You can only register once with each Aadhaar/Voter ID

## 🛡️ Security Features

- **🔗 Blockchain Verification**: All votes are recorded on the blockchain
- **🆔 Identity Verification**: Prevents duplicate registrations
- **1️⃣ One Vote Rule**: Smart contract prevents multiple votes from same address
- **👁️ Transparency**: All votes are publicly verifiable on the blockchain
