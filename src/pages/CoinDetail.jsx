import { useParams } from "react-router-dom"

export const CoinDetail = () => {

    const { id } = useParams()

    return (
        <p>This is the coin detail page for the id : {id}</p>
    )
}