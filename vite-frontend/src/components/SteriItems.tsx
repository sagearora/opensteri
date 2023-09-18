import { useListSteriItemsQuery } from '../__generated__/graphql'

function SteriItems() {
    const { data, loading } = useListSteriItemsQuery()

    if (loading) {
        return <div>Loading...</div>
    }

    const items = data?.steri_item || []

    return (
        <div>
            {items.map(item => <div key={item.id}>
                <h3>{item.name}</h3>
                <p>{item.category}</p>
            </div>)}
        </div>
    )
}

export default SteriItems