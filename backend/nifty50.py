from nsepython import nsefetch

# NSE API for Nifty 50 index
url = "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050"

# Fetch data
data = nsefetch(url)

# Extract stock symbols
nifty50_symbols = [stock["symbol"] for stock in data["data"]]

print("Nifty 50 Stocks:")
print(nifty50_symbols)
