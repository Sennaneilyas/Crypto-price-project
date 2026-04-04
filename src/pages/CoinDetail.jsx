import { useParams, useNavigate } from "react-router-dom"
import { fetchChartData, fetchCoinData } from "../api/coinGecko"
import { useEffect, useState } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const formatPrice = (price) => {
    if (!price) return 'N/A'
    return typeof price === 'number' ? `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}` : 'N/A'
}

const formatPercentage = (value) => {
    if (value === null || value === undefined) return '0.00%'
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

export const CoinDetail = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const [coin, setCoin] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    const [chartData, setChartData] = useState([])

    const isPositive = (coin?.market_data?.price_change_percentage_24h ?? 0) >= 0

    // Inside CoinDetail.jsx
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            setError(false);
            try {
                // Run both fetches in parallel
                const [coinRes, chartRes] = await Promise.all([
                    fetchCoinData(id),
                    fetchChartData(id)
                ]);

                setCoin(coinRes);

                // Format chart data
                const formattedChartData = chartRes.prices.map((price) => ({
                    time: new Date(price[0]).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    }),
                    price: price[1].toFixed(2),
                }));
                setChartData(formattedChartData);

            } catch (err) {
                console.error('Error loading data:', err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="loading">
                <div className="spinner" />
                <p>Loading coin data...</p>
            </div>
        )
    }

    if (error || !coin) {
        return (
            <div className="app">
                <div className="no-results">
                    <p>Coin not found</p>
                    <button onClick={() => navigate("/")}>Go Back</button>
                </div>
            </div>
        )
    }

    const currentPrice = coin?.market_data?.current_price?.usd
    const high24h = coin?.market_data?.high_24h?.usd
    const low24h = coin?.market_data?.low_24h?.usd
    const priceChange = coin?.market_data?.price_change_percentage_24h

    return (
        <div className="app">
            <header className="header">
                <div className="header-content">
                    <div className="logo-section">
                        <h1>🚀 Crypto Tracker</h1>
                        <p>Real-time cryptocurrency prices and market data</p>
                    </div>
                    <button onClick={() => navigate('/')} className="back-button">
                        ← back to list
                    </button>
                </div>
            </header>

            <div className="coin-detail">
                <div className="coin-header">
                    <div className="coin-title">
                        <img src={coin.image?.large || coin.image} alt={coin.name} />
                        <div>
                            <h1>{coin.name}</h1>
                            <p className="symbol">{coin.symbol?.toUpperCase() ?? 'N/A'}</p>
                        </div>
                    </div>
                    <span className="rank">Rank #{coin.market_cap_rank || 'N/A'}</span>
                </div>

                <div className="coin-price-section">
                    <div className="current-price">
                        <h2 className="price">{formatPrice(currentPrice)}</h2>
                        <span className={`change-badge ${isPositive ? 'positive' : 'negative'}`}>
                            {isPositive ? <ArrowUp className="change-icon" /> : <ArrowDown className="change-icon" />}
                            {formatPercentage(priceChange)}
                        </span>
                    </div>

                    <div className="price-ranges">
                        <div className="price-range">
                            <span className="range-label">24h High</span>
                            <span className="range-value">{formatPrice(high24h)}</span>
                        </div>
                        <div className="price-range">
                            <span className="range-label">24h Low</span>
                            <span className="range-value">{formatPrice(low24h)}</span>
                        </div>
                    </div>
                </div>

                <div className="chart-section">
                    <h3>Price Chart (7 days)</h3>
                    <ResponsiveContainer width='100%' height={400} >
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgb(110, 138, 152)" />
                            <XAxis
                                dataKey="time"
                                stroke="rgb(132, 139, 143)"
                                style={{ fontSize: "12px" }}
                            />
                            <YAxis
                                stroke="rgb(132, 139, 143)"
                                style={{ fontSize: "12px" }}
                                domain={["auto", "auto"]}
                            />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(20, 20, 40, 0.95)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "8px",
                                    color: "#e0e0e0",
                                }}
                            />

                            <Line dataKey="price"
                                type="monotone"
                                stroke="rgb(57, 172, 230)"
                                strokeWidth={2}
                                dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">Market Cap</span>
                        <span className="stat-value">
                            ${coin.market_data.market_cap.usd.toLocaleString('en-US')}
                        </span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Volume (24)</span>
                        <span className="stat-value">
                            ${coin.market_data.total_volume.usd.toLocaleString('en-US')}
                        </span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Circulating Supply</span>
                        <span className="stat-value">
                            {coin.market_data.circulating_supply?.toLocaleString() || "N/A"}
                        </span>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">Total Supply</span>
                        <span className="stat-value">
                            {coin.market_data.total_supply?.toLocaleString() || "N/A"}
                        </span>
                    </div>
                </div>

                <footer className="footer">
                    <p>Data provided by CoinGecko API • Updated every 30 seconds</p>
                </footer>

            </div>
        </div >
    )
}