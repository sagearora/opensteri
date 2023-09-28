
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { SteriItemFragment, useListSettingsSteriItemsQuery } from "../../../__generated__/graphql";
import BackButton from "../../../components/BackButton";


function SteriItemListScreen() {
    const {
        loading,
        data,
    } = useListSettingsSteriItemsQuery()

    const items = useMemo(() => data?.steri_item || [], [data])

    const categories = useMemo(() => {
        return items
            .reduce((all, item) => ({
                ...all,
                [item.category.toLowerCase()]: {
                    name: item.category,
                    items: all[item.category.toLowerCase()] ? [
                        ...all[item.category.toLowerCase()].items,
                        item,
                    ] : [item],
                }
            }), {} as {
                [id: string]: {
                    name: string;
                    items: SteriItemFragment[]
                }
            })
    }, [items])

    return <div className='my-6 mx-auto container'>
        <div className='flex items-center mb-4'>
            <BackButton href='/settings' />
            <p className='ml-2 font-bold text-gray-500'>Steri Items</p>
            <div className='flex-1' />
            <Link
                to='create'
            >+ Add Item</Link>
        </div>
        {loading && <Loader2 />}
        {Object.keys(categories).map((category: string) => <div
            className="mb-6"
            key={category}>
            <p className="text-sm font-semibold">{category.toLocaleUpperCase()}</p>

            {categories[category].items.map(item => <Link
                className="flex items-center border-b-2 p-2 hover:bg-slate-200"
                to={`${item.id}/edit`}
                key={item.id}>
                <div className={`flex-1 ${!item.is_active ? 'line-through text-gray-700' : ''}`}>
                    <p className='text-lg'>{item.name}</p>
                    <p className='text-sm text-gray-800'>{item.is_count_enabled ? `Total Count: ${item.total_count}.` : ''}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </Link>)}
        </div>)}
        {!loading && Object.keys(categories).length === 0 && <p className='text-center text-gray-500'>No Steri Items found.</p>}
    </div>
}

export default SteriItemListScreen;
