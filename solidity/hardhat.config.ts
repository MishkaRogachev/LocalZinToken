import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { PRIVATE_KEY, ARBITRUM_MAINNET_RPC, ARBITRUM_SEPOLIA_RPC } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    arbitrumMainnet: {
      url: ARBITRUM_MAINNET_RPC || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    arbitrumSepolia: {
      url: ARBITRUM_SEPOLIA_RPC || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};

export default config;
