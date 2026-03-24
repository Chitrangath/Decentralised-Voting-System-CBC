let web3;
let contract;
const contractAddress = "0x6F4Ed69DCFc56e9966d3b0C3711B53c434c47dD9";
const abi = [
    {
    "inputs": [
        { "internalType": "string", "name": "_name", "type": "string" },
        { "internalType": "uint256", "name": "_age", "type": "uint256" },
        { "internalType": "uint256", "name": "_candidateID", "type": "uint256" },
        { "internalType": "string", "name": "_imageCID", "type": "string" }
    ],
    "name": "registerAsCandidate", "outputs": [], "stateMutability": "nonpayable", "type": "function"
},
{
    "inputs": [
        { "internalType": "uint256", "name": "_age", "type": "uint256" },
        { "internalType": "string", "name": "_aadharNumber", "type": "string" },
        { "internalType": "string", "name": "_voterID", "type": "string" }
    ],
    "name": "registerVoter", "outputs": [], "stateMutability": "nonpayable", "type": "function"
},
{
    "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }],
    "name": "vote", "outputs": [], "stateMutability": "nonpayable", "type": "function"
},
{
    "inputs": [], "name": "candidateCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view", "type": "function"
},
{
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "candidates",
    "outputs": [
        { "internalType": "string", "name": "name", "type": "string" },
        { "internalType": "uint256", "name": "age", "type": "uint256" },
        { "internalType": "uint256", "name": "candidateID", "type": "uint256" },
        { "internalType": "uint256", "name": "voteCount", "type": "uint256" },
        { "internalType": "address", "name": "candidateAddress", "type": "address" },
        { "internalType": "string", "name": "imageCID", "type": "string" }
    ],
    "stateMutability": "view", "type": "function"
},
{
    "inputs": [{ "internalType": "uint256", "name": "_candidateID", "type": "uint256" }],
    "name": "getCandidateImage",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view", "type": "function"
},
{
    "inputs": [], "name": "getCandidates",
    "outputs": [{
        "components": [
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "uint256", "name": "age", "type": "uint256" },
            { "internalType": "uint256", "name": "candidateID", "type": "uint256" },
            { "internalType": "uint256", "name": "voteCount", "type": "uint256" },
            { "internalType": "address", "name": "candidateAddress", "type": "address" },
            { "internalType": "string", "name": "imageCID", "type": "string" }
        ],
        "internalType": "struct DecentralizedVoting.Candidate[]", "name": "", "type": "tuple[]"
    }],
    "stateMutability": "view", "type": "function"
},
{
    "inputs": [], "name": "getElectionResult",
    "outputs": [
        { "internalType": "string", "name": "", "type": "string" },
        { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view", "type": "function"
},
{
    "inputs": [], "name": "getVotes",
    "outputs": [
        { "internalType": "string[]", "name": "", "type": "string[]" },
        { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view", "type": "function"
},
{
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "isCandidate",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view", "type": "function"
},
{
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "voters",
    "outputs": [
        { "internalType": "uint256", "name": "age", "type": "uint256" },
        { "internalType": "string", "name": "aadharNumber", "type": "string" },
        { "internalType": "string", "name": "voterID", "type": "string" },
        { "internalType": "bool", "name": "isRegistered", "type": "bool" },
        { "internalType": "bool", "name": "hasVoted", "type": "bool" }
    ],
    "stateMutability": "view", "type": "function"
}
];

// =========================================
// INIT
// =========================================
window.onload = async () => {
    initializeScrollEffects();

    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        // Check if already connected
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            await onWalletConnected(accounts[0]);
        }

        // Listen for account changes
        window.ethereum.on('accountsChanged', async (accounts) => {
            if (accounts.length > 0) {
                await onWalletConnected(accounts[0]);
            } else {
                onWalletDisconnected();
            }
        });

        window.ethereum.on('chainChanged', () => window.location.reload());
    } else {
        showAlert("Please install MetaMask to use this dApp.", "error");
        document.getElementById('chain-name').textContent = 'MetaMask not found';
    }
};

// =========================================
// WALLET CONNECTION
// =========================================
async function connectWallet() {
    if (!window.ethereum) {
        showAlert("MetaMask not detected. Please install it from metamask.io", "error");
        return;
    }
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        await onWalletConnected(accounts[0]);
    } catch (err) {
        showAlert("Wallet connection rejected.", "error");
    }
}

async function onWalletConnected(account) {
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(abi, contractAddress);

    // Update wallet button
    const short = account.slice(0, 6) + '...' + account.slice(-4);
    const walletBtn = document.getElementById('wallet-btn');
    const walletLabel = document.getElementById('wallet-label');
    walletBtn.classList.add('connected');
    walletLabel.textContent = short;

    // Update chain badge
    const chainId = await web3.eth.getChainId();
    const chainNames = {
        1: 'Ethereum', 5: 'Goerli', 11155111: 'Sepolia',
        137: 'Polygon', 80001: 'Mumbai', 1337: 'Localhost'
    };
    document.getElementById('chain-name').textContent = chainNames[chainId] || `Chain ${chainId}`;
    document.getElementById('chain-badge').querySelector('.chain-dot').classList.add('active');

    // Hide connect banner
    const banner = document.getElementById('connect-banner');
    if (banner) banner.style.display = 'none';

    loadCandidates();
}

function onWalletDisconnected() {
    document.getElementById('wallet-label').textContent = 'Connect Wallet';
    document.getElementById('wallet-btn').classList.remove('connected');
    document.getElementById('chain-name').textContent = 'Not Connected';
    document.getElementById('chain-badge').querySelector('.chain-dot').classList.remove('active');
    document.getElementById('connect-banner').style.display = '';
}

// =========================================
// SCROLL & NAVIGATION
// =========================================
function initializeScrollEffects() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function scrollToVoting() {
    document.getElementById('candidates-section').scrollIntoView({ behavior: 'smooth' });
}

function scrollToResults() {
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
}

function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('open');
}

// =========================================
// FORM VALIDATION
// =========================================
function validateForm(formData) {
    let isValid = true;
    Object.keys(formData).forEach(key => {
        const input = document.getElementById(key);
        const errorElement = input.nextElementSibling;
        if (!formData[key]) {
            errorElement.textContent = 'This field is required';
            input.style.borderColor = 'rgba(245,94,94,0.5)';
            isValid = false;
        } else {
            errorElement.textContent = '';
            input.style.borderColor = '';
        }
    });
    return isValid;
}

// =========================================
// MODALS
// =========================================
function showRegisterForm() {
    const modal = document.getElementById("register-form");
    modal.style.display = 'flex';
    modal.classList.add('open');
}

function showCandidateForm() {
    const modal = document.getElementById("candidate-form");
    modal.style.display = 'flex';
    modal.classList.add('open');
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => {
        m.style.display = 'none';
        m.classList.remove('open');
    });
    clearFormErrors();
}

function clearFormErrors() {
    document.querySelectorAll('.error-message').forEach(e => e.textContent = '');
    document.querySelectorAll('.form-group input').forEach(i => i.style.borderColor = '');
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) closeModal();
});

// =========================================
// REGISTER VOTER
// =========================================
async function registerVoter() {
    const formData = {
        'voter-aadhar': document.getElementById("voter-aadhar").value,
        'voter-id': document.getElementById("voter-id").value,
        'voter-age': document.getElementById("voter-age").value
    };
    if (!validateForm(formData)) return;

    const accounts = await web3.eth.getAccounts();
    try {
        showAlert("Submitting registration to blockchain...", "info");
        await contract.methods.registerVoter(
            formData['voter-age'],
            formData['voter-aadhar'],
            formData['voter-id']
        ).send({ from: accounts[0] });
        showAlert("Successfully registered as voter!", "success");
        closeModal();
    } catch (error) {
        showAlert(error.message, "error");
    }
}

// =========================================
// REGISTER CANDIDATE
// =========================================
async function registerAsCandidate() {
    const formData = {
        'candidate-name': document.getElementById("candidate-name").value,
        'candidate-age': document.getElementById("candidate-age").value,
        'candidate-id': document.getElementById("candidate-id").value,
        'candidate-image-cid': document.getElementById("candidate-image-cid").value
    };
    if (!validateForm(formData)) return;

    const accounts = await web3.eth.getAccounts();
    try {
        showAlert("Submitting candidacy to blockchain...", "info");
        await contract.methods.registerAsCandidate(
            formData['candidate-name'],
            formData['candidate-age'],
            formData['candidate-id'],
            formData['candidate-image-cid']
        ).send({ from: accounts[0] });
        showAlert("Successfully registered as candidate!", "success");
        closeModal();
        loadCandidates();
    } catch (error) {
        showAlert(error.message, "error");
    }
}

// =========================================
// LOAD CANDIDATES
// =========================================
async function loadCandidates() {
    const list = document.getElementById("candidates-list");
    if (!contract) {
        list.innerHTML = '<p style="color:var(--text-secondary);font-size:0.9rem;">Connect your wallet to load candidates.</p>';
        return;
    }
    try {
        const candidates = await contract.methods.getCandidates().call();
        list.innerHTML = '';

        // Update count badge
        const badge = document.getElementById('candidate-count-badge');
        if (badge) badge.textContent = `${candidates.length} candidate${candidates.length !== 1 ? 's' : ''} registered`;

        if (candidates.length === 0) {
            list.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-secondary);">
                    <i class="fas fa-user-slash" style="font-size:2rem;margin-bottom:1rem;display:block;color:var(--text-muted);"></i>
                    No candidates registered yet.
                </div>`;
            return;
        }

        candidates.forEach((candidate, index) => {
            const card = document.createElement('div');
            card.classList.add('candidate-card');
            card.innerHTML = `
                <img class="candidate-image"
                    src="https://ipfs.io/ipfs/${candidate.imageCID}"
                    alt="${candidate.name}"
                    onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'260\\' height=\\'220\\' style=\\'background:%23181b22\\'><text x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' fill=\\'%234a4f5e\\' font-size=\\'14\\'>No Image</text></svg>'">
                <div class="candidate-info">
                    <h3>${candidate.name}</h3>
                    <p>Age: ${candidate.age} &nbsp;|&nbsp; ID: #${candidate.candidateID}</p>
                    <button onclick="vote(${index})" class="vote-btn">
                        <i class="fas fa-vote-yea"></i> Cast Vote
                    </button>
                </div>
            `;
            list.appendChild(card);
        });
    } catch (error) {
        list.innerHTML = `<p style="color:var(--red);font-size:0.88rem;"><i class="fas fa-exclamation-circle"></i> Error loading candidates: ${error.message}</p>`;
    }
}

// =========================================
// VOTE
// =========================================
async function vote(index) {
    const accounts = await web3.eth.getAccounts();
    try {
        const candidates = await contract.methods.getCandidates().call();
        showAlert(`Submitting your vote for ${candidates[index].name}...`, "info");
        await contract.methods.vote(candidates[index].name).send({ from: accounts[0] });
        showAlert(`Vote cast for ${candidates[index].name}!`, "success");
        loadCandidates();
    } catch (error) {
        showAlert(error.message, "error");
    }
}

// =========================================
// GET VOTES
// =========================================
async function getVotes() {
    try {
        const votesResponse = await contract.methods.getVotes().call();
        const candidateNames = votesResponse[0];
        const voteCounts = votesResponse[1];
        const totalVotes = voteCounts.reduce((a, b) => a + parseInt(b), 0);

        const voteResultsDiv = document.getElementById("vote-results");
        voteResultsDiv.innerHTML = `
            <h3>Current Vote Count</h3>
            ${candidateNames.map((name, i) => {
                const pct = totalVotes > 0 ? Math.round((parseInt(voteCounts[i]) / totalVotes) * 100) : 0;
                return `
                    <div class="vote-result-item" style="flex-direction:column;align-items:stretch;gap:8px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span>${name}</span>
                            <span class="vote-count">${voteCounts[i]} votes</span>
                        </div>
                        <div style="height:4px;background:var(--surface3);border-radius:2px;overflow:hidden;">
                            <div style="height:100%;width:${pct}%;background:var(--blue);border-radius:2px;transition:width 0.5s;"></div>
                        </div>
                    </div>
                `;
            }).join('')}
            <p style="font-size:0.75rem;color:var(--text-muted);margin-top:0.8rem;font-family:var(--font-mono);">
                Total votes cast: ${totalVotes}
            </p>
        `;
    } catch (error) {
        showAlert("Error fetching votes: " + error.message, "error");
    }
}

// =========================================
// GET RESULT
// =========================================
async function getResult() {
    try {
        const result = await contract.methods.getElectionResult().call();
        const winnerName = result[0];
        const voteCount = result[1];

        document.getElementById("election-result").innerHTML = `
            <h3>Election Winner</h3>
            <div class="winner-announcement">
                <i class="fas fa-trophy winner-trophy"></i>
                <div class="winner-details">
                    <h4>${winnerName}</h4>
                    <p>${voteCount} votes</p>
                </div>
            </div>
        `;
    } catch (error) {
        showAlert("Error fetching result: " + error.message, "error");
    }
}

// =========================================
// ADMIN UTILS
// =========================================
function copyContract() {
    navigator.clipboard.writeText(contractAddress).then(() => {
        showAlert("Contract address copied to clipboard!", "success");
    });
}

// =========================================
// ALERTS
// =========================================
function showAlert(message, type = 'info') {
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    const alertBox = document.createElement("div");
    alertBox.classList.add("alert", type);
    alertBox.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    document.getElementById("alerts").appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 5000);
}