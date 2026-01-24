import { parse } from 'node:path';
import { createPublicClient, http, formatEther} from 'viem'
import { mainnet } from 'viem/chains'
 
const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
 
export const getEthBalance = async (address) => {
    if (!address) {
        console.error("Error: getEthBalance received missing address!");
        return 0.00;
    }
    try {
        const balanceWei = await client.getBalance({ 
            address: address
        });
        const etherString = formatEther(balanceWei);
        const balanceEth = parseFloat(etherString);
        return balanceEth;
    } catch (error) {
        console.error(`Error fetching balance for [${address}]:`, error.message);
    return 0.00; 
        
    }
}