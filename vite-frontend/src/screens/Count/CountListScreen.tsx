import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Order_Direction, useCreateCountMutation, useGetUnfinishedCountQuery, useListCountQuery } from "../../__generated__/graphql"
import { Button } from "../../components/ui/button"
import { PageLimit } from "../../constants"
import { useUser } from "../../lib/UserProvider"
import { createErrorToast } from "../../lib/createErrorToast"
import CountListItem from "./CountListItem"
import PendingCountListItem from "./PendingCountListItem"

function CountListScreen() {
    const navigate = useNavigate()
    const { user: { id: user_id } } = useUser()
    const [createCount, { loading: creating }] = useCreateCountMutation()
    const [page] = useState(0)
    const {
        data: unfinished_count,
        refetch,
    } = useGetUnfinishedCountQuery()
    const {
        loading,
        data,
    } = useListCountQuery({
        variables: {
            offset: page * PageLimit,
            limit: PageLimit,
            order_by: [{
                column: 'id',
                direction: Order_Direction.Desc,
            }]
        },
    })

    const counts = data?.count || [];
    const unfinished = (unfinished_count?.count || [])[0]

    const create = async () => {
        try {
            const { data } = await createCount({
                variables: {
                    object: {
                        user_id,
                    }
                },
            })
            refetch()
            if (data?.insert_count_one?.id) {
                navigate(`/counts/${data.insert_count_one.id}`)
            }
        } catch (e) {
            createErrorToast(e)
        }
    }

    return (
        <div className="container my-6">
            <div className='flex items-center mb-4'>
                <p className='font-bold text-gray-500'>Counts</p>
                <div className='flex-1' />
                <Button
                    disabled={creating} variant='outline'
                    onClick={create}>
                    {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                    + Start a Count</Button>
            </div>
            {loading && <Loader2 className="mx-auto h-8 w-8 animate-spin" />}
            <div className="space-y-4">
                {unfinished && <PendingCountListItem count={unfinished} />}
                {counts.map(item => <CountListItem count={item} key={item.id} />)}
            </div>
        </div>
    )
}

export default CountListScreen