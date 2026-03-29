// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TipBadge
 * @notice Awards on-chain badges to tippers based on milestones
 * Badges: Bronze (0.001 ETH), Silver (0.01 ETH), Gold (0.1 ETH), Diamond (1 ETH)
 */
contract TipBadge {
    address public owner;

    enum Badge { None, Bronze, Silver, Gold, Diamond }

    mapping(address => uint256) public totalTipped;
    mapping(address => Badge) public badge;

    uint256 public constant BRONZE_THRESHOLD  = 0.001 ether;
    uint256 public constant SILVER_THRESHOLD  = 0.01 ether;
    uint256 public constant GOLD_THRESHOLD    = 0.1 ether;
    uint256 public constant DIAMOND_THRESHOLD = 1 ether;

    event TipReceived(address indexed tipper, uint256 amount);
    event BadgeAwarded(address indexed tipper, Badge badge);
    event Withdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function tip() external payable {
        require(msg.value >= BRONZE_THRESHOLD, "Tip too small");
        totalTipped[msg.sender] += msg.value;
        emit TipReceived(msg.sender, msg.value);
        _updateBadge(msg.sender);
    }

    function _updateBadge(address tipper) internal {
        Badge current = badge[tipper];
        Badge newBadge = current;

        uint256 total = totalTipped[tipper];
        if (total >= DIAMOND_THRESHOLD) newBadge = Badge.Diamond;
        else if (total >= GOLD_THRESHOLD) newBadge = Badge.Gold;
        else if (total >= SILVER_THRESHOLD) newBadge = Badge.Silver;
        else if (total >= BRONZE_THRESHOLD) newBadge = Badge.Bronze;

        if (newBadge != current) {
            badge[tipper] = newBadge;
            emit BadgeAwarded(tipper, newBadge);
        }
    }

    function getBadgeName(address tipper) external view returns (string memory) {
        Badge b = badge[tipper];
        if (b == Badge.Diamond) return "Diamond";
        if (b == Badge.Gold) return "Gold";
        if (b == Badge.Silver) return "Silver";
        if (b == Badge.Bronze) return "Bronze";
        return "None";
    }

    function withdraw() external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "Nothing to withdraw");
        payable(owner).transfer(bal);
        emit Withdrawn(owner, bal);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
