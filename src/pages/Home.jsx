import { useEffect, useState } from 'react'
import { fetchCryptos } from '../api/coinGecko'
import { CryptoCard } from '../components/CryptoCard'

export const Home = () => {

    const [cryptoList, setCryptoList] = useState([])
    const [isLoading, setIsLoading] = useState(true)

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

    return (
        <main className="home-page">
            {isLoading ? (
                <div className="loading">
                    <div className="spinner" />
                    <p>Loading crypto data...</p>
                </div>
            ) : (
                <>
                    <section className="page-header">
                        <div>
                            <h1>Crypto market overview</h1>
                            <p className="count">{cryptoList.length} coins loaded</p>
                        </div>
                    </section>

                    {cryptoList.length === 0 ? (
                        <div className="no-results">No crypto data available.</div>
                    ) : (
                        <div className="crypto-container grid">
                            {cryptoList.map((crypto) => (
                                <CryptoCard key={crypto.id} crypto={crypto} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </main>
    )
}