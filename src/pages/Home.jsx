import { useEffect, useState } from 'react'
import { fetchCryptos } from '../api/coinGecko'
import { CryptoCard } from '../components/CryptoCard'

export const Home = () => {

    const [cryptoList, setCryptoList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [viewMode, setViewMode] = useState("grid")
    const [sortBy, setSortBy] = useState("market_cap_rank")
    const [filteredList, setFilteredList] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchCryptoData = async () => {
            try {
                const data = await fetchCryptos()
                setCryptoList(data)
            } catch (error) {
                console.error('Failed to load cryptos', error.message)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCryptoData()
    }, [])

    useEffect(() => {
        filterAndSort()
    }, [sortBy, cryptoList, searchTerm])

    const filterAndSort = () => {
        let filtered = cryptoList.filter(crypto =>
            crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) || crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'price':
                    return a.current_price - b.current_price
                case 'price_desc':
                    return b.current_price - a.current_price
                case 'change':
                    return b.price_change_percentage_24h - a.price_change_percentage_24h
                case 'market_cap':
                    return b.market_cap - a.market_cap
                default:
                    return a.market_cap_rank - b.market_cap_rank
            }
        })
        setFilteredList(filtered)
    }



    return (
        <main className="app">

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
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                        />
                    </div>
                </div>
            </header>

            <div className="controls">
                <div className="filter-group">
                    <label>Sort by :</label>
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
                    <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => {
                        setViewMode('grid')
                    }}>Grid</button>
                    <button className={viewMode === 'list' ? 'active' : ''} onClick={() => {
                        setViewMode('list')
                    }}>List</button>
                </div>
            </div>

            {isLoading ? (
                <div className="loading">
                    <div className="spinner" />
                    <p>Loading crypto data...</p>
                </div>
            ) : (
                <div className={`crypto-container ${viewMode === 'grid' ? 'grid' : 'list'}`}>
                    {filteredList.map((crypto) => (
                        <CryptoCard key={crypto.id} crypto={crypto} />
                    ))}
                </div>
            )}
        </main>
    )
}