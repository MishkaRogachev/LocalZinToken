// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract LocalZinToken is ERC20, Ownable {
    constructor(
        address recipient,
        address initialOwner
    ) ERC20("Local Zin Token", "LZK") Ownable(initialOwner) {
        // Mint 100,000 tokens to the recipient
        _mint(recipient, 100_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
