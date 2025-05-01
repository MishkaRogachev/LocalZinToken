# Local Zin Token

ERC-20 token used to distribute magazine-branded tokens (“LZT”) via on-chain QR airdrop.

## Solidity

The Solidity part responsible for core ERC-20 mechanics with ability to delegate minting to specific address.

```shell
cd ./solidity
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/LocalZinToken.ts
```

## Stylus (coming soon)

The Stylus part responsible for claim codes registry and handles claim mechanics


```shell
cd ./stylus
cargo test
cargo stylus check
```