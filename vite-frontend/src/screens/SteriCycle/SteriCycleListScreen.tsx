import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Order_Direction, useListSteriCyclesQuery } from '../../__generated__/graphql';
import { PageLimit } from '../../constants';
import { SteriCycleListItem } from './SteriCycleListItem';
import { Button } from '../../components/ui/button';

function SteriCycleListScreen() {
    //Todo: Allow page changes in the future.
    const [page] = useState(0)
    const {
        loading,
        data,
    } = useListSteriCyclesQuery({
        variables: {
            offset: page * PageLimit,
            limit: PageLimit,
            order_by: [{
                column: 'id',
                direction: Order_Direction.Desc,
            }]
        },
    })

    const cycles = data?.steri_cycle || [];


    return (
        <div className='my-6 container'>
            <div className='flex items-center mb-4'>
                <p className='font-bold text-gray-500'>Cycles</p>
                <div className='flex-1' />
                <Link to='/cycles/create'>
                    <Button variant='outline'>+ Start a Cycle
                    </Button>
                </Link>
            </div>
            {loading && <Loader2 className="mx-auto h-8 w-8 animate-spin" />}
            {cycles.map(cycle => <SteriCycleListItem
                cycle={cycle}
                key={cycle.id}
            />)}
        </div>
    )
}

export default SteriCycleListScreen