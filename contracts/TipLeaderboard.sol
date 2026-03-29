// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TipLeaderboard
 * @notice On-chain leaderboard tracking top tippers by total amount sent
 */
contract TipLeaderboard {
    address public owner;

    mapping(address => uint256) public totalTipped;
    address[] public tippers;

    uint256 public constant MIN_TIP = 0.0001 ether;

    event TipReceived(address indexed tipper, uint256 amount, uint256 newTotal);
    event Withdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function tip() external payable {
        require(msg.value >= MIN_TIP, "Tip too small");

        if (totalTipped[msg.sender] == 0) {
            tippers.push(msg.sender);
        }
        totalTipped[msg.sender] += msg.value;

        emit TipReceived(msg.sender, msg.value, totalTipped[msg.sender]);
    }

    // Returns top N tippers sorted by total amount
    function getTopTippers(uint256 n) external view returns (address[] memory, uint256[] memory) {
        uint256 len = tippers.length < n ? tippers.length : n;
        address[] memory addrs = new address[](len);
        uint256[] memory amounts = new uint256[](len);

        // Copy tippers
        address[] memory temp = new address[](tippers.length);
        for (uint i = 0; i < tippers.length; i++) temp[i] = tippers[i];

        // Simple bubble sort by totalTipped descending
        for (uint i = 0; i < temp.length; i++) {
            for (uint j = i + 1; j < temp.length; j++) {
                if (totalTipped[temp[j]] > totalTipped[temp[i]]) {
                    (temp[i], temp[j]) = (temp[j], temp[i]);
                }
            }
        }

        for (uint i = 0; i < len; i++) {
            addrs[i] = temp[i];
            amounts[i] = totalTipped[temp[i]];
        }
        return (addrs, amounts);
    }

    function getTipperCount() external view returns (uint256) {
        return tippers.length;
    }

    function withdraw() external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "Nothing to withdraw");
        payable(owner).transfer(bal);
        emit Withdrawn(owner, bal);
    }
}
