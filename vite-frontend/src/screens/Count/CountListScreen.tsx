import { Loader2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Order_Direction, useCreateCountMutation, useListCountQuery } from "../../__generated__/graphql"
import { Button } from "../../components/ui/button"
import { PageLimit } from "../../constants"
import { useUser } from "../../lib/UserProvider"
import { createErrorToast } from "../../lib/createErrorToast"
import CountListItem from "./CountListItem"

function CountListScreen() {
    const navigate = useNavigate()
    const { user: { id: user_id } } = useUser()
    const [createCount, { loading: creating }] = useCreateCountMutation()
    const [page] = useState(0)
    const {
        loading,
        data,
        refetch,
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
            {counts.map(item => <Link to={`/counts/${item.id}`}
                key={item.id} className="block bg-slate-100 p-4 hover:bg-slate-200 rounded-md my-2">
                <CountListItem count={item} />
            </Link>)}
        </div>
    )
}

export default CountListScreen