// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract LocalZinToken is ERC20, Ownable {
    address public minter;

    event MinterSet(address indexed newMinter);
    event TokensMinted(address indexed to, uint256 amount);

    constructor(
        address initialOwner
    ) ERC20("Local Zin Token", "LZK") Ownable(initialOwner) {}

    // @dev Set an address authorized to mint tokens
    function setMinter(address _minter) external onlyOwner {
        require(_minter != address(0), "Minter cannot be the zero address");
        require(_minter != minter, "Minter is already set to this address");

        minter = _minter;
        emit MinterSet(_minter);
    }

    function mint(address to, uint256 amount) external {
        require(minter != address(0), "Minter should be set before minting");

        require(
            msg.sender == minter,
            "Only minter is authorized for mining tokens"
        );

        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
}
