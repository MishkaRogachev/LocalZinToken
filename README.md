# Local Zin Token

[![CI](https://github.com/MishkaRogachev/LocalZinToken/actions/workflows/solidity.yml/badge.svg)](https://github.com/MishkaRogachev/LocalZinToken/actions)
[![CI](https://github.com/MishkaRogachev/LocalZinToken/actions/workflows/stylus.yml/badge.svg)](https://github.com/MishkaRogachev/LocalZinToken/actions)

ERC-20 token used to distribute magazine-branded tokens (“LZT”) via on-chain QR airdrop.


## Building & testing

### Clone the repository

```shell
git clone git@github.com:MishkaRogachev/LocalZinToken.git
cd LocalZinToken
```

### Install prerequisites

Before you start, ensure the following tools are installed:

1. Node.js and npm (LTS version recommended) from [nodejs.org](https://nodejs.org/en/download).
Once installed, install project dependencies:

```shell
cd ./solidity
npm install
npm install -g solc
```

2. Rust toolchain with wasm target
```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
```

3. Cargo Stylus (for Stylus contracts)
```shell
cargo install stylus-cli
```

### Enviroment setup

1. Create an Ethereum wallet using [MetaMask](https://metamask.io/) or any preferred tool. Export your private key.
2. Send at least 0.001 ETH on Ethereum Arbitrum on your wallet address. Yo can use [bridge](https://bridge.arbitrum.io/) to transfer your founds from Ethereum Mainnet. (It will take about 15 minutes)
3. Send some testnet ETH using [Arbitrum Sepolia Faucet](https://www.alchemy.com/faucets/arbitrum-sepolia)
2. Sign up at [Infura](https://developer.metamask.io/) and create a project to get your API key.
3. Create a .env file in the root of the project with the following content:

```
# === Private Credentials ===
PRIVATE_KEY=<your_wallet_private_key>

# === Network RPC Endpoints ===
ARBITRUM_MAINNET_RPC=https://arbitrum-mainnet.infura.io/v3/<your_infura_api_key>
ARBITRUM_SEPOLIA_RPC=https://arbitrum-sepolia.infura.io/v3/<your_infura_api_key>
```

### Solidity

The Solidity part responsible for core ERC-20 mechanics with ability to delegate minting to specific address.

```shell
cd ./solidity
npx hardhat test
REPORT_GAS=true npx hardhat test
```

### Stylus

The Stylus part responsible for claim codes registry and handles claim mechanics

1. Build and test the Stylus contract
```shell
cd ./stylus
cargo test
cargo stylus check
```

2. Export contract ABI
```shell
cargo stylus export-abi
npx solc --abi ./abi/local_zin_airdrop.sol -o abi
```

### Deployment

1. Double check `.env` in project root folder. Wallet and RPC endpoints will be used for both stylus and solidity parts.

2. Deploy the Solidity contract:
- On Arbitrum Testnet
```shell
npx hardhat ignition deploy ./ignition/modules/LocalZinToken.ts --network arbitrumSepolia
```

- On Arbitrum Mainnet
```shell
npx hardhat ignition deploy ./ignition/modules/LocalZinToken.ts --network arbitrumMainnet
```
Remember the deployed contract address!


3. Deploy the Stylus contract:
```shell
export $(grep -v '^#' ../.env | xargs)
cargo stylus deploy --endpoint "$ARBITRUM_SEPOLIA_RPC" --private-key "$PRIVATE_KEY" --no-verify
```
Remember the deployed one more contract address!

4. Update `tools/scripts/config.ts` with your contract addreses from previous steps.

5. Init contracts with script. You need to run `init-contracts` every time you change any of contract addresses
```
cd tools
npm run init-contracts
```
Note: for each contact pair init script works just once

6. Run the integration test!

```
cd tools
npm run integration-test
```
