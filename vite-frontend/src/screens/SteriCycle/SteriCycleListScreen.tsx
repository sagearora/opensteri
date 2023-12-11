import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Order_Direction, SteriFragment, useGetSteriCycleCountQuery, useListSteriCyclesQuery, useListSterilizersQuery } from '../../__generated__/graphql';
import Pagination from '../../components/Pagination';
import { Button } from '../../components/ui/button';
import { PageLimit } from '../../constants';
import { SteriCycleListItem } from './SteriCycleListItem';

function SteriCycleListScreen() {
    //Todo: Allow page changes in the future.
    const [steri_id, setSteriId] = useState<null | number>(null)
    const [page, setPage] = useState(0)
    const {
        loading,
        data,
    } = useListSteriCyclesQuery({
        variables: {
            steri_id,
            offset: page * PageLimit,
            limit: PageLimit,
            order_by: [{
                column: 'id',
                direction: Order_Direction.Desc,
            }]
        },
    })
    const { data: steri } = useListSterilizersQuery()
    const { data: count } = useGetSteriCycleCountQuery({
        variables: {
            steri_id,
        }
    })

    const sterilizers = useMemo(() => {
        return (steri?.steri || []).reduce((obj, item) => ({
            ...obj,
            [item.id]: item,
        }), {}) as {[id: number]: SteriFragment}
    }, [steri])

    const cycles = data?.steri_cycle || [];


    return (
        <div className='my-6 container'>
            <div className='flex items-center mb-4'>
                <p className='font-bold text-gray-500'>{count?.steri_cycle_count} Cycles</p>
                <div className='flex-1' />
                <Link to='/cycles/create'>
                    <Button variant='outline'>+ Start a Cycle
                    </Button>
                </Link>
            </div>
            {loading && <Loader2 className="mx-auto h-8 w-8 animate-spin" />}
            <div className='flex'>
                <Button
                    size='sm'
                    onClick={() => setSteriId(null)}
                    variant={steri_id !== null ? 'outline' : 'default'}>All</Button>
                {(steri?.steri || []).map(sterilizer => <Button
                    size='sm'
                    onClick={() => setSteriId(sterilizer.id)}
                    key={sterilizer.id}
                    variant={steri_id === sterilizer.id ? 'default' : 'outline'}>{sterilizer.name}</Button>)}
            </div>
            {cycles.map(cycle => <SteriCycleListItem
                cycle={cycle}
                key={cycle.id}
                steri={sterilizers[cycle.steri_id]}
            />)}
            <div className='w-fit mx-auto py-6'>
                <Pagination
                    total={count?.steri_cycle_count || 0}
                    current={page}
                    pageSize={PageLimit}
                    setPage={setPage}
                />
            </div>
        </div>
    )
}

export default SteriCycleListScreen