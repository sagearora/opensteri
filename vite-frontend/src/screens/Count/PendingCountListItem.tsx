import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CountFragment } from '../../__generated__/graphql'
import CountItem from './CountItem'

function PendingCountListItem({
    count,
}: {
    count: CountFragment
}) {
    const item_count = useMemo(() => {
        return (count?.steri_labels || []).reduce((obj, item) => ({
            ...obj,
            [item.steri_item_id]: (obj[item.steri_item_id] || 0) + 1
        }), {} as { [id: number]: number })
    }, [count])

    return (
        <Link to={`/counts/${count.id}`}
            className="block bg-orange-50 p-4 hover:bg-orange-100 rounded-md
            space-y-2">
            <div>
                <div className="text-lg font-bold text-orange-700">Pending: {dayjs(count.created_at).format('MMM D, YYYY @ h:mm a')}</div>
                <div className='text-sm font-light'>Created by {count.user.name}</div>
            </div>
            {count.countable_items.map(item => (
                <CountItem key={item.id} item={item} total_scanned={item_count[item.id] || 0} />
            ))}
        </Link>
    )
}

export default PendingCountListItem