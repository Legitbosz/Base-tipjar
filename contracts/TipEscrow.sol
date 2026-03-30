// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TipEscrow
 * @notice Tip held in escrow — released when creator marks task complete
 * Tipper can refund if task not completed within deadline
 */
contract TipEscrow {
    enum Status { Pending, Completed, Refunded }

    struct Escrow {
        address tipper;
        address creator;
        uint256 amount;
        uint256 deadline;
        string task;
        Status status;
    }

    uint256 public escrowCount;
    mapping(uint256 => Escrow) public escrows;

    uint256 public constant MIN_TIP = 0.0001 ether;

    event EscrowCreated(uint256 indexed id, address tipper, address creator, uint256 amount, string task);
    event EscrowReleased(uint256 indexed id, address creator, uint256 amount);
    event EscrowRefunded(uint256 indexed id, address tipper, uint256 amount);

    function createEscrow(address _creator, string memory _task, uint256 _deadlineDays) external payable {
        require(msg.value >= MIN_TIP, "Tip too small");
        require(_creator != address(0), "Invalid creator");
        require(_deadlineDays > 0, "Deadline must be > 0");

        escrows[escrowCount] = Escrow(
            msg.sender, _creator, msg.value,
            block.timestamp + (_deadlineDays * 1 days),
            _task, Status.Pending
        );

        emit EscrowCreated(escrowCount, msg.sender, _creator, msg.value, _task);
        escrowCount++;
    }

    function releaseEscrow(uint256 _id) external {
        Escrow storage e = escrows[_id];
        require(e.creator == msg.sender, "Not creator");
        require(e.status == Status.Pending, "Not pending");
        e.status = Status.Completed;
        payable(e.creator).transfer(e.amount);
        emit EscrowReleased(_id, e.creator, e.amount);
    }

    function refundEscrow(uint256 _id) external {
        Escrow storage e = escrows[_id];
        require(e.tipper == msg.sender, "Not tipper");
        require(e.status == Status.Pending, "Not pending");
        require(block.timestamp > e.deadline, "Deadline not passed");
        e.status = Status.Refunded;
        payable(e.tipper).transfer(e.amount);
        emit EscrowRefunded(_id, e.tipper, e.amount);
    }

    function getEscrow(uint256 _id) external view returns (Escrow memory) {
        return escrows[_id];
    }
}
