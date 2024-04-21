// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StorageContract {
    address public owner;
    mapping(address => uint256) public prepaid;
    uint256 public withdrawable;

    constructor() {
        owner = msg.sender;
    }

    // Function to receive Ether and store it in the prepaid mapping
    receive() external payable {
        prepaid[msg.sender] += msg.value;
    }

    // Function to submit a blob and transfer amount from prepaid to withdrawable
    function submitBlob(uint256 amount, address user) public {
        require(prepaid[user] >= amount, "Insufficient prepaid balance");
        prepaid[user] -= amount;
        withdrawable += amount;
    }

    // Function for owner to withdraw the withdrawable balance
    function withdraw() public {
        require(msg.sender == owner, "Caller is not the owner");
        require(withdrawable > 0, "No funds available to withdraw");

        uint256 amountToWithdraw = withdrawable;
        withdrawable = 0;

        // Transfer the withdrawable amount to the owner
        (bool success, ) = owner.call{value: amountToWithdraw}("");
        require(success, "Failed to send Ether");
    }

    // Getter to check the prepaid balance of a user
    function getPrepaidBalance(address user) public view returns (uint256) {
        return prepaid[user];
    }

    // Getter to check the withdrawable balance
    function getWithdrawableBalance() public view returns (uint256) {
        return withdrawable;
    }
}
