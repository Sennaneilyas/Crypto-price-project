import { ArrowUp, ArrowDown } from 'lucide-react'
import { formatMarketCap } from '../utils/formatter'

export const CryptoCard = ({ crypto }) => {
    const isPositive = crypto?.price_change_percentage_24h >= 0

    return (
        <div className="crypto-card">
            <div className="crypto-header">
                <div className="crypto-info">
                    <img src={crypto?.image} alt={crypto?.name} />
                    <div>
                        <h3>{crypto?.name}</h3>
                        <div className="symbol">{crypto?.symbol?.toUpperCase()}</div>
                    </div>
                </div>
                <div className="rank" style={{color: "white"}}>#{crypto?.market_cap_rank}</div>
            </div>

            <div className="crypto-price">
                <div className="price">${crypto?.current_price?.toLocaleString()}</div>
                <div className={`change ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? <ArrowUp className="change-icon" /> : <ArrowDown className="change-icon" />}
                    {isPositive ? '+' : '-'}{Math.abs(crypto?.price_change_percentage_24h ?? 0).toFixed(2)}%
                </div>
            </div>

            <div className="crypto-stats">
                <div className="stat">
                    <span className="stat-label">Market Cap</span>
                    <span className="stat-value">${formatMarketCap(crypto?.market_cap)}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Volume</span>
                    <span className="stat-value">${formatMarketCap(crypto?.total_volume)}</span>
                </div>
            </div>
        </div>
    )
}