import dayjs from 'dayjs'
import { useMemo } from 'react'
import { CountListItemFragment } from '../../__generated__/graphql'
import { cn } from '../../lib/utils'
import CountItem from './CountItem'

function CountListItem({
    count,
}: {
    count: CountListItemFragment
}) {
    const has_failed = useMemo(() => (count.final_count || [])?.findIndex(
        item => item.total_count > (item.total_scanned || 0)
    ) > -1, [count.final_count])
    return (
        <div className={cn('block p-4 rounded-md bg-green-100 space-y-2', has_failed && 'bg-red-100')}>
            <div>
                <div className='flex items-center space-x-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                    </svg>
                    <div className={cn(
                        "text-lg font-bold text-green-700",
                        has_failed && "text-red-700",
                    )}>{dayjs(count.created_at).format('MMM D, YYYY @ h:mm a')}</div>
                </div>
                <div className='text-sm font-light'>Created by {count.user.name}</div>
            </div>
            {(count.final_count || []).map(item => (
                <CountItem key={item.id} item={item} total_scanned={item.total_scanned || 0} />
            ))}
        </div>
    )
}

export default CountListItem