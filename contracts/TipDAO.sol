// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TipDAO
 * @notice Tippers vote on how funds get spent — majority wins
 */
contract TipDAO {
    address public owner;

    struct Proposal {
        string description;
        address payable recipient;
        uint256 amount;
        uint256 votes;
        bool executed;
        bool exists;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256) public tipBalance;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public proposalCount;
    uint256 public totalTips;

    uint256 public constant MIN_TIP = 0.0001 ether;

    event TipReceived(address indexed tipper, uint256 amount);
    event ProposalCreated(uint256 indexed id, string description, address recipient, uint256 amount);
    event Voted(uint256 indexed id, address indexed voter, uint256 weight);
    event ProposalExecuted(uint256 indexed id, address recipient, uint256 amount);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }

    constructor() { owner = msg.sender; }

    function tip() external payable {
        require(msg.value >= MIN_TIP, "Tip too small");
        tipBalance[msg.sender] += msg.value;
        totalTips += msg.value;
        emit TipReceived(msg.sender, msg.value);
    }

    function createProposal(string memory _desc, address payable _recipient, uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Insufficient funds");
        proposals[proposalCount] = Proposal(_desc, _recipient, _amount, 0, false, true);
        emit ProposalCreated(proposalCount, _desc, _recipient, _amount);
        proposalCount++;
    }

    function vote(uint256 _id) external {
        require(proposals[_id].exists, "Proposal not found");
        require(!proposals[_id].executed, "Already executed");
        require(!hasVoted[_id][msg.sender], "Already voted");
        require(tipBalance[msg.sender] > 0, "Must be a tipper to vote");

        hasVoted[_id][msg.sender] = true;
        proposals[_id].votes += tipBalance[msg.sender];
        emit Voted(_id, msg.sender, tipBalance[msg.sender]);
    }

    function executeProposal(uint256 _id) external onlyOwner {
        Proposal storage p = proposals[_id];
        require(p.exists, "Not found");
        require(!p.executed, "Already executed");
        require(p.votes > totalTips / 2, "Not enough votes");
        require(p.amount <= address(this).balance, "Insufficient funds");
        p.executed = true;
        p.recipient.transfer(p.amount);
        emit ProposalExecuted(_id, p.recipient, p.amount);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
