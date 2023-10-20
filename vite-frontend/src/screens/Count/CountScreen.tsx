import dayjs from "dayjs"
import { Loader2, X } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { SteriLabelFragment, Steri_Label_Event_Type, useGetCountQuery, useInsertSteriLabelEventMutation } from "../../__generated__/graphql"
import NotFoundItem from "../../components/NotFoundItem"
import { Button } from "../../components/ui/button"
import { toast } from "../../components/ui/use-toast"
import { QRType } from "../../constants"
import { useUser } from "../../lib/UserProvider"
import { createErrorToast } from "../../lib/createErrorToast"
import useBeep from "../../lib/use-beep"
import LoadingScreen from "../LoadingScreen"
import ScanInput from "../SteriCycle/ScanInput"
import CountListItem from "./CountListItem"

export default function CountScreen() {
    const { user: { id: user_id } } = useUser()
    const playBleep = useBeep();
    const count_id = +(useParams().count_id as string)
    const [insertEvent] = useInsertSteriLabelEventMutation()
    const { data, loading, refetch } = useGetCountQuery({
        variables: {
            id: count_id
        }
    })
    const [loading_label, setLoadingLabel] = useState<{ [id: number]: boolean }>({});


    const count = data?.count_by_pk


    if (loading) {
        return <LoadingScreen />
    }

    if (!count) {
        return <NotFoundItem title="Count not found" />
    }

    const onScan = async ({ type, id }: { type: QRType, id: number | string }) => {
        if (type === QRType.SteriLabel) {
            try {
                const { data } = await insertEvent({
                    variables: {
                        objects: [{
                            type: Steri_Label_Event_Type.CountSteriItem,
                            steri_label_id: +id,
                            user_id,
                            data: JSON.stringify({
                                count_id: count.id,
                            })
                        }],
                    }
                })
                const items = data?.insert_steri_label_event?.returning || []
                if (items.length === 0) {
                    playBleep(720)
                    toast({
                        title: 'Failed to add item',
                        variant: 'destructive'
                    })
                    return;
                }
                playBleep(860)
                refetch()
                toast({
                    title: `Added ${items[0].steri_item.name} to count`,
                });
            } catch (e) {
                createErrorToast(e)
            }
        }
    }

    const removeLabel = async (steri_label: SteriLabelFragment) => {
        setLoadingLabel(l => ({
            ...l,
            [steri_label.id]: true,
        }))
        try {
            await insertEvent({
                variables: {
                    objects: [{
                        steri_label_id: steri_label.id,
                        type: Steri_Label_Event_Type.UndoCount,
                        data: '',
                        user_id,
                    }]
                }
            })
            refetch()

        } catch (e) {
            createErrorToast(e)
        } finally {
            setLoadingLabel(l => ({
                ...l,
                [steri_label.id]: false,
            }))
        }
    }

    return (
        <div className="container my-6">
            <CountListItem 
                count={count}
            />
            <ScanInput
                is_finished={false}
                onScan={onScan}
                title='Use the handheld scanner to count all items'
            />
            <div className='flex-1 overflow-y-auto'>
                <div className='px-4 py-2 space-y-2 flex-1 overflow-y-auto'>
                    {loading && <Loader2 className='h-4 w-4 animate-spin' />}
                    {count.steri_labels.map((item) => <div key={item.id} className='border-b flex items-center space-x-2 py-2'>
                        <div className='flex-1 text-left'>
                            <p className='text-xs'>#{item.id} - {item.steri_item.category}</p>
                            <p className='text-md font-semibold'>{item.steri_item.name}</p>
                            <p className='text-sm text-gray-600'>{item.clinic_user.name} &middot; {dayjs(item.checkout_at).fromNow()}</p>
                        </div>
                        <Button color='danger'
                            tabIndex={-1}
                            size='icon'
                            onClick={() => removeLabel(item)} variant='destructive'>
                            {loading_label[item.id] && <Loader2 className='h-4 w-4 animate-spin' />} <X className='h-4 w-4' /></Button>
                    </div>)}
                </div>
            </div>
        </div>
    )
}

