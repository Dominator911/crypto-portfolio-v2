
export const getEthPrice = async () => {
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=cad');
        const data = await res.json();
        return data.ethereum.cad;
    } catch (error) {
        console.error("Error fetching ETH price:", error);
        return 0.00;
    }
}