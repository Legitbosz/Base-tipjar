// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TipSplitter
 * @notice Split incoming ETH tips between multiple recipients automatically
 */
contract TipSplitter {
    address public owner;

    struct Recipient {
        address wallet;
        uint256 share; // out of 100
    }

    Recipient[] public recipients;

    event TipSplit(address indexed sender, uint256 amount);
    event RecipientsUpdated();

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address[] memory _wallets, uint256[] memory _shares) {
        require(_wallets.length == _shares.length, "Length mismatch");
        uint256 total;
        for (uint i = 0; i < _wallets.length; i++) {
            total += _shares[i];
            recipients.push(Recipient(_wallets[i], _shares[i]));
        }
        require(total == 100, "Shares must add up to 100");
        owner = msg.sender;
    }

    receive() external payable {
        require(msg.value > 0, "No ETH sent");
        for (uint i = 0; i < recipients.length; i++) {
            uint256 amount = (msg.value * recipients[i].share) / 100;
            payable(recipients[i].wallet).transfer(amount);
        }
        emit TipSplit(msg.sender, msg.value);
    }

    function updateRecipients(address[] memory _wallets, uint256[] memory _shares) external onlyOwner {
        require(_wallets.length == _shares.length, "Length mismatch");
        uint256 total;
        delete recipients;
        for (uint i = 0; i < _wallets.length; i++) {
            total += _shares[i];
            recipients.push(Recipient(_wallets[i], _shares[i]));
        }
        require(total == 100, "Shares must add up to 100");
        emit RecipientsUpdated();
    }

    function getRecipients() external view returns (Recipient[] memory) {
        return recipients;
    }
}
