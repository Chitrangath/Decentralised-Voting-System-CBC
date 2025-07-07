// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedVoting {

    // Structure to hold candidate information
    struct Candidate {
        string name;
        uint age;
        uint candidateID;
        uint voteCount; // To keep track of votes
        address candidateAddress; // Address of the candidate
        string imageCID; // CID of the candidate's image stored in IPFS
    }

    // Structure to hold voter information
    struct Voter {
        uint age;
        string aadharNumber; // 12-digit Aadhaar number
        string voterID;      // 10-character alphanumeric Voter ID
        bool isRegistered;   // Has the voter registered successfully
        bool hasVoted;       // Has the voter already voted
    }

    // Array to store candidates
    Candidate[] public candidates;
    //Mapping to store voter information by address
    mapping(address => Voter) public voters;
    // Mapping to check if an address is already registered as a candidate
    mapping(address => bool) public isCandidate;
    //Mapping to store candidate ID by name for vote tracking
    mapping(string => uint) private candidateIndexByName;
    //Mappings to track if Aadhaar number and Voter ID are unique
    mapping(string => bool) private usedAadhaar;
    mapping(string => bool) private usedVoterID;
    // Number of candidates registered
    uint public candidateCount;

    // Modifier to ensure a user is registered
    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "You must register with Aadhaar and Voter ID to participate!");
        _;
    }

    // Function to register as a voter
    function registerVoter(uint _age, string memory _aadharNumber, string memory _voterID) public {
        require(!voters[msg.sender].isRegistered, "You are already registered!");
        require(bytes(_aadharNumber).length == 12, "Aadhaar number must be 12 digits!");
        require(bytes(_voterID).length == 10, "Voter ID must be 10 characters!");
        require(_age >= 18, "You must be at least 18 years old to register!");
        require(!usedAadhaar[_aadharNumber], "This Aadhaar number has already been used!");
        require(!usedVoterID[_voterID], "This Voter ID has already been used!");

        // Mark Aadhaar and Voter ID as used
        usedAadhaar[_aadharNumber] = true;
        usedVoterID[_voterID] = true;

        voters[msg.sender] = Voter(_age, _aadharNumber, _voterID, true, false);
    }

    // Function to register as a candidate (only registered voters can do this)
    function registerAsCandidate(string memory _name, uint _age, uint _candidateID, string memory _imageCID) public onlyRegisteredVoter {
        require(!isCandidate[msg.sender], "You are already registered as a candidate!");
        require(bytes(_name).length > 0, "Candidate name is required!");
        require(_age >= 18, "You must be at least 18 years old to register as a candidate!");
        require(voters[msg.sender].age == _age, "Age must be the same as your voter registration age!");

        candidates.push(Candidate(_name, _age, _candidateID, 0, msg.sender, _imageCID));
        candidateIndexByName[_name] = candidateCount;
        isCandidate[msg.sender] = true;
        candidateCount++;
    }

    // Function to vote for a candidate (only registered voters can vote for registered candidates)
    function vote(string memory _name) public onlyRegisteredVoter {
        require(!voters[msg.sender].hasVoted, "You have already voted!");

        // Check if the candidate name exists in the candidates mapping
        require(candidateIndexByName[_name] > 0 || keccak256(bytes(candidates[0].name)) == keccak256(bytes(_name)), "Candidate not found!");

        uint index = candidateIndexByName[_name];
        candidates[index].voteCount += 1;
        voters[msg.sender].hasVoted = true;
    }

    // Function to get all candidates
    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    // Function to get vote count of each candidate
    function getVotes() public view returns (string[] memory, uint[] memory) {
        string[] memory names = new string[](candidateCount);
        uint[] memory votes = new uint[](candidateCount);
        for (uint i = 0; i < candidateCount; i++) {
            names[i] = candidates[i].name;
            votes[i] = candidates[i].voteCount;
        }
        return (names, votes);
    }

    // Function to get election result
    function getElectionResult() public view returns (string memory, uint) {
        require(candidateCount > 0, "No candidates registered!");
        uint maxVotes = 0;
        uint winnerIndex = 0;
        for (uint i = 0; i < candidateCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerIndex = i;
            }
        }
        return (candidates[winnerIndex].name, candidates[winnerIndex].voteCount);
    }

    // Function to get candidate image URL (uses CID)
    function getCandidateImage(uint _candidateID) public view returns (string memory) {
        require(_candidateID < candidateCount, "Candidate not found!");
        Candidate memory candidate = candidates[_candidateID];
        return string(abi.encodePacked("https://ipfs.io/ipfs/", candidate.imageCID));
    }
}