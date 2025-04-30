# Local Zin Token

ERC-20 token used to distribute magazine-branded tokens (“LZT”) via on-chain QR airdrop.

## Solidity

The Solidity part handles minting, balance tracking, and core ERC-20 compliance.

```shell
cd ./solidity
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

## Stylus (coming soon)
