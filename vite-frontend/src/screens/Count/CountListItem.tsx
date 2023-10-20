import { useMemo } from 'react'
import { CountFragment } from '../../__generated__/graphql'
import dayjs from 'dayjs'
import CountItem from './CountItem'

function CountListItem({
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
        <>
            <div className="text-lg font-semibold mb-2">Count By: {count.user.name} &middot; {dayjs(count.created_at).format('MMM D, YYYY @ h:mm a')}</div>
            {count.countable_items.map(item => (
                <CountItem key={item.id} item={item} total_scanned={item_count[item.id] || 0} />
            ))}
        </>
    )
}

export default CountListItem