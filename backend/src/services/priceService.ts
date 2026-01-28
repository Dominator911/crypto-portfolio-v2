export const getPrices = async (coingeckoIds: string[]) => {
  try {
    const ids = coingeckoIds.join(',');
    const vs_currency = 'cad';

    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vs_currency}`
    );

    const data = await res.json();

    const prices: Record<string, number> = {};
    coingeckoIds.forEach((id) => {
      prices[id] = data[id]?.[vs_currency] ?? 0;
    });

    return prices;

  } catch (error) {
    console.error("Error fetching prices from CoinGecko:", error);
    const fallback: Record<string, number> = {};
    coingeckoIds.forEach(id => (fallback[id] = 0));
    return fallback;
  }
};
