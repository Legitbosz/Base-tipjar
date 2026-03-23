// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TipJar
 * @notice A decentralized tip jar on Base — send ETH tips with a message
 * @dev Deployed on Base (L2) for cheap, fast micro-transactions
 */
contract TipJar is Ownable, ReentrancyGuard {
    // ─── Events ───────────────────────────────────────────────────────────────
    event TipReceived(
        address indexed sender,
        uint256 amount,
        string message,
        string emoji,
        uint256 timestamp
    );

    event Withdrawn(address indexed owner, uint256 amount);

    // ─── State ────────────────────────────────────────────────────────────────
    uint256 public totalTipsReceived;
    uint256 public totalTipCount;
    string public jarName;
    string public jarDescription;

    struct Tip {
        address sender;
        uint256 amount;
        string message;
        string emoji;
        uint256 timestamp;
    }

    Tip[] public tips;

    // ─── Config ───────────────────────────────────────────────────────────────
    uint256 public constant MIN_TIP = 0.0001 ether;
    uint256 public constant MAX_MESSAGE_LENGTH = 280;

    // ─── Constructor ──────────────────────────────────────────────────────────
    constructor(
        string memory _jarName,
        string memory _jarDescription
    ) Ownable(msg.sender) {
        jarName = _jarName;
        jarDescription = _jarDescription;
    }

    // ─── Core Functions ───────────────────────────────────────────────────────

    /**
     * @notice Send a tip with an optional message and emoji
     * @param message A short message to attach to the tip (max 280 chars)
     * @param emoji An emoji to represent the tip (e.g. "🔥", "💜", "🚀")
     */
    function tip(
        string calldata message,
        string calldata emoji
    ) external payable nonReentrant {
        require(msg.value >= MIN_TIP, "Tip too small: minimum is 0.0001 ETH");
        require(
            bytes(message).length <= MAX_MESSAGE_LENGTH,
            "Message too long: max 280 characters"
        );

        tips.push(Tip({
            sender: msg.sender,
            amount: msg.value,
            message: message,
            emoji: emoji,
            timestamp: block.timestamp
        }));

        totalTipsReceived += msg.value;
        totalTipCount++;

        emit TipReceived(msg.sender, msg.value, message, emoji, block.timestamp);
    }

    /**
     * @notice Withdraw all accumulated tips to owner wallet
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdraw failed");

        emit Withdrawn(owner(), balance);
    }

    // ─── View Functions ───────────────────────────────────────────────────────

    /**
     * @notice Get the total number of tips
     */
    function getTipCount() external view returns (uint256) {
        return tips.length;
    }

    /**
     * @notice Get a paginated list of tips (newest first)
     * @param offset Starting index
     * @param limit Max number of tips to return
     */
    function getTips(
        uint256 offset,
        uint256 limit
    ) external view returns (Tip[] memory) {
        uint256 total = tips.length;
        if (offset >= total) return new Tip[](0);

        uint256 end = offset + limit;
        if (end > total) end = total;

        uint256 count = end - offset;
        Tip[] memory result = new Tip[](count);

        // Return newest first
        for (uint256 i = 0; i < count; i++) {
            result[i] = tips[total - 1 - offset - i];
        }

        return result;
    }

    /**
     * @notice Get current ETH balance in the jar
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Update jar name and description (owner only)
     */
    function updateJarInfo(
        string calldata _name,
        string calldata _description
    ) external onlyOwner {
        jarName = _name;
        jarDescription = _description;
    }
}
