import { useEffect, useState, useMemo } from "react";
import { fetchCryptos } from "../api/coinGecko";
import { CryptoCard } from "../components/CryptoCard";

export const Home = () => {
    const [cryptoList, setCryptoList] = useState([]); // Ensure cryptoList is initialized as an array
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("market_cap_rank");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchCryptoData = async () => {
            try {
                const data = await fetchCryptos();
                if (Array.isArray(data)) {
                    setCryptoList(data); // Only set cryptoList if data is an array
                } else {
                    console.error("Invalid data format: Expected an array");
                    setCryptoList([]); // Fallback to an empty array
                }
            } catch (err) {
                console.error("Error fetching crypto: ", err);
                setCryptoList([]); // Fallback to an empty array in case of error
            } finally {
                setIsLoading(false);
            }
        };

        fetchCryptoData();
        const interval = setInterval(fetchCryptoData, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const filteredList = useMemo(() => {
        if (!Array.isArray(cryptoList)) return []; // Ensure cryptoList is an array before filtering
        return cryptoList
            .filter(
                (crypto) =>
                    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                switch (sortBy) {
                    case "name":
                        return a.name.localeCompare(b.name);
                    case "price":
                        return a.current_price - b.current_price;
                    case "price_desc":
                        return b.current_price - a.current_price;
                    case "change":
                        return b.price_change_percentage_24h - a.price_change_percentage_24h;
                    case "market_cap":
                        return b.market_cap - a.market_cap;
                    default:
                        return a.market_cap_rank - b.market_cap_rank;
                }
            });
    }, [cryptoList, sortBy, searchQuery]);

    return (
        <div className="app">
            <header className="header">
                <div className="header-content">
                    <div className="logo-section">
                        <h1>🚀 Crypto Tracker</h1>
                        <p>Real-time cryptocurrency prices and market data</p>
                    </div>
                    <div className="search-section">
                        <input
                            type="text"
                            placeholder="Search cryptos..."
                            className="search-input"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                        />
                    </div>
                </div>
            </header>
            <div className="controls">
                <div className="filter-group">
                    <label>Sort by:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="market_cap_rank">Rank</option>
                        <option value="name">Name</option>
                        <option value="price">Price (Low to High)</option>
                        <option value="price_desc">Price (High to Low)</option>
                        <option value="change">24h Change</option>
                        <option value="market_cap">Market Cap</option>
                    </select>
                </div>
                <div className="view-toggle">
                    <button
                        className={viewMode === "grid" ? "active" : ""}
                        onClick={() => setViewMode("grid")}
                    >
                        Grid
                    </button>
                    <button
                        className={viewMode === "list" ? "active" : ""}
                        onClick={() => setViewMode("list")}
                    >
                        List
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="loading">
                    <div className="spinner" />
                    <p>Loading crypto data...</p>
                </div>
            ) : (
                <div className={`crypto-container ${viewMode}`}>
                    {filteredList.map((crypto) => (
                        <CryptoCard key={crypto.id} crypto={crypto} />
                    ))}
                </div>
            )}

            <footer className="footer">
                <p>Data provided by CoinGecko API • Updated every 30 seconds</p>
            </footer>
        </div>
    );
};