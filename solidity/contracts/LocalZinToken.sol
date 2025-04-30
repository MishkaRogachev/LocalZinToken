// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract LocalZinToken is ERC20, Ownable {
    address public minter;

    constructor(
        address initialOwner
    ) ERC20("Local Zin Token", "LZK") Ownable(initialOwner) {}

    // @dev Set an address authorized to mint tokens
    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    function mint(address to, uint256 amount) external {
        require(
            msg.sender == minter,
            "Only minter is authorized for mining tokens"
        );
        _mint(to, amount);
    }
}
