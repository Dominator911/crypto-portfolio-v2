export const getPrices = async (symbols) => {
  try {
    const ids = symbols.map(s => s.toLowerCase()).join(',');
    const vs_currency = 'cad';

    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vs_currency}`
    );

    const data = await res.json();

    const prices = {};
    symbols.forEach((symbol) => {
      const key = symbol.toLowerCase();
      prices[symbol] = data[key]?.[vs_currency] ?? 0;
    });

    return prices;

  } catch (error) {
    console.error("Error fetching prices from CoinGecko:", error);
    const fallback = {};
    symbols.forEach(s => (fallback[s] = 0));
    return fallback;
  }
};
