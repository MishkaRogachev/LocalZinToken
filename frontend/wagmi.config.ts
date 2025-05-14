import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export function getConfig() {
  return createConfig({
    chains: [arbitrum, arbitrumSepolia],
    connectors: [metaMask()],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [arbitrum.id]: http(),
      [arbitrumSepolia.id]: http(),
    },
  });
}
