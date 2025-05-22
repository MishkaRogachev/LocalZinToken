// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

interface ILocalZinAirdrop {
    function init() external;
    function getOwner() external view returns (address);
    function setTokenAddress(address token) external;
    function registerCode(bytes32 code_hash) external;
    function registerCodes(bytes32[] memory code_hashes) external;
    function claim(bytes32 code_hash) external;
    function getClaimStatus(bytes32 code_hash) external view returns (uint8);
}
