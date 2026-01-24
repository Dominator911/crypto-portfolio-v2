import { getEthBalance } from "./balanceService.js";

export const supportedAssets = [
  {
    symbol: "ETH",
    chain: "ethereum",
    getBalance: getEthBalance,
    coingeckoId: "ethereum",
  },
];
