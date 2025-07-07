let web3;
let contract;
const contractAddress = "0x6F4Ed69DCFc56e9966d3b0C3711B53c434c47dD9";
const abi = [
    {
    "inputs": [
        {
            "internalType": "string",
            "name": "_name",
            "type": "string"
        },
        {
            "internalType": "uint256",
            "name": "_age",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "_candidateID",
            "type": "uint256"
        },
        {
            "internalType": "string",
            "name": "_imageCID",
            "type": "string"
        }
    ],
    "name": "registerAsCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "_age",
            "type": "uint256"
        },
        {
            "internalType": "string",
            "name": "_aadharNumber",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "_voterID",
            "type": "string"
        }
    ],
    "name": "registerVoter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "string",
            "name": "_name",
            "type": "string"
        }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "candidateCount",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "name": "candidates",
    "outputs": [
        {
            "internalType": "string",
            "name": "name",
            "type": "string"
        },
        {
            "internalType": "uint256",
            "name": "age",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "candidateID",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "voteCount",
            "type": "uint256"
        },
        {
            "internalType": "address",
            "name": "candidateAddress",
            "type": "address"
        },
        {
            "internalType": "string",
            "name": "imageCID",
            "type": "string"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "_candidateID",
            "type": "uint256"
        }
    ],
    "name": "getCandidateImage",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "getCandidates",
    "outputs": [
        {
            "components": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "age",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "candidateID",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "voteCount",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "candidateAddress",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "imageCID",
                    "type": "string"
                }
            ],
            "internalType": "struct DecentralizedVoting.Candidate[]",
            "name": "",
            "type": "tuple[]"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "getElectionResult",
    "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        },
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "getVotes",
    "outputs": [
        {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
        },
        {
            "internalType": "uint256[]",
            "name": "",
            "type": "uint256[]"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "address",
            "name": "",
            "type": "address"
        }
    ],
    "name": "isCandidate",
    "outputs": [
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "address",
            "name": "",
            "type": "address"
        }
    ],
    "name": "voters",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "age",
            "type": "uint256"
        },
        {
            "internalType": "string",
            "name": "aadharNumber",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "voterID",
            "type": "string"
        },
        {
            "internalType": "bool",
            "name": "isRegistered",
            "type": "bool"
        },
        {
            "internalType": "bool",
            "name": "hasVoted",
            "type": "bool"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}
];

// Initialized Web3 and contract
window.onload = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' });
        contract = new web3.eth.Contract(abi, contractAddress);
        loadCandidates();
        initializeScrollEffects();
    } else {
        showAlert("Please install MetaMask to use this dApp.", "error");
    }
};

// Scroll effects
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const logoCenter = document.querySelector('.logo-center');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            logoCenter.style.transform = 'scale(0.8)';
        } else {
            navbar.classList.remove('scrolled');
            logoCenter.style.transform = 'scale(1)';
        }
    });
}

// Form validation
function validateForm(formData) {
    let isValid = true;
    Object.keys(formData).forEach(key => {
        const input = document.getElementById(key);
        const errorElement = input.nextElementSibling;
        
        if (!formData[key]) {
            errorElement.textContent = 'This field is required';
            isValid = false;
        } else {
            errorElement.textContent = '';
        }
    });
    return isValid;
}

// Modal functions
function showRegisterForm() {
    document.getElementById("register-form").style.display = 'flex';
}

function showCandidateForm() {
    document.getElementById("candidate-form").style.display = 'flex';
}

function closeModal() {
    document.getElementById("register-form").style.display = 'none';
    document.getElementById("candidate-form").style.display = 'none';
    clearFormErrors();
}

function clearFormErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });
}

// Register voter with validation
async function registerVoter() {
    const formData = {
        'voter-aadhar': document.getElementById("voter-aadhar").value,
        'voter-id': document.getElementById("voter-id").value,
        'voter-age': document.getElementById("voter-age").value
    };

    if (!validateForm(formData)) return;

    const accounts = await web3.eth.getAccounts();
    try {
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

// Register candidate with validation
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

// Load and display candidates
async function loadCandidates() {
    try {
        const candidates = await contract.methods.getCandidates().call();
        const candidatesList = document.getElementById("candidates-list");
        candidatesList.innerHTML = '';

        candidates.forEach((candidate, index) => {
            const candidateCard = document.createElement('div');
            candidateCard.classList.add("candidate-card");
            candidateCard.innerHTML = `
                <img class="candidate-image" src="https://ipfs.io/ipfs/${candidate.imageCID}" alt="${candidate.name}">
                <h3>${candidate.name}</h3>
                <p>Age: ${candidate.age}</p>
                <button onclick="vote(${index})" class="action-btn">
                    <i class="fas fa-vote-yea"></i> Vote
                </button>
            `;
            candidatesList.appendChild(candidateCard);
        });
    } catch (error) {
        showAlert("Error loading candidates: " + error.message, "error");
    }
}

// Vote function
async function vote(index) {
    const accounts = await web3.eth.getAccounts();
    try {
        const candidates = await contract.methods.getCandidates().call();
        await contract.methods.vote(candidates[index].name).send({ from: accounts[0] });
        showAlert("Vote cast successfully!", "success");
        loadCandidates();
    } catch (error) {
        showAlert(error.message, "error");
    }
}

// Get votes
async function getVotes() {
    try {
        const votesResponse = await contract.methods.getVotes().call();
        const candidateNames = votesResponse[0];
        const voteCounts = votesResponse[1];

        const voteResultsDiv = document.getElementById("vote-results");
        voteResultsDiv.innerHTML = `
            <h3>Current Vote Count</h3>
            ${candidateNames.map((name, index) => `
                <div class="vote-result-item">
                    <span>${name}</span>
                    <span class="vote-count">${voteCounts[index]} votes</span>
                </div>
            `).join('')}
        `;
    } catch (error) {
        showAlert("Error fetching votes: " + error.message, "error");
    }
}

// Get election result
async function getResult() {
    try {
        const result = await contract.methods.getElectionResult().call();
        const winnerName = result[0];
        const voteCount = result[1];

        const resultDiv = document.getElementById("election-result");
        resultDiv.innerHTML = `
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

// Show alert messages
function showAlert(message, type) {
    const alertBox = document.createElement("div");
    alertBox.classList.add("alert", type);
    alertBox.innerHTML = message;
    document.getElementById("alerts").appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove();
    }, 5000);
}