import dayjs from "dayjs"
import { Loader2, X } from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { GetUnfinishedCountDocument, SteriLabelFragment, Steri_Label_Event_Type, useFinishCountMutation, useGetCountQuery, useInsertSteriLabelEventMutation } from "../../__generated__/graphql"
import NotFoundItem from "../../components/NotFoundItem"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog"
import { Button } from "../../components/ui/button"
import { toast } from "../../components/ui/use-toast"
import { QRType } from "../../constants"
import { useUser } from "../../lib/UserProvider"
import { createErrorToast } from "../../lib/createErrorToast"
import useBeep from "../../lib/use-beep"
import LoadingScreen from "../LoadingScreen"
import ScanInput from "../SteriCycle/ScanInput"
import CountListItem from "./CountListItem"
import PendingCountListItem from "./PendingCountListItem"

export default function CountScreen() {
    const navigate = useNavigate()
    const { user: { id: user_id } } = useUser()
    const playBleep = useBeep();
    const count_id = +(useParams().count_id as string)
    const [insertEvent] = useInsertSteriLabelEventMutation()
    const [finishCount, { loading: finishing }] = useFinishCountMutation({
        refetchQueries: [{
            query: GetUnfinishedCountDocument
        }]
    })
    const { data, loading, refetch } = useGetCountQuery({
        variables: {
            id: count_id
        },
        pollInterval: 2000,
    })
    const [loading_label, setLoadingLabel] = useState<{ [id: number]: boolean }>({});
    const [show_failed_dialog, setShowFailedDialog] = useState(false);


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
                const failures = data?.insert_steri_label_event?.failures || []

                if (failures.length > 0) {
                    playBleep(720)
                    toast({
                        title: 'Failed to add item',
                        description: `${failures.map(item => `ID: ${item.id}: ${item.reason}`).join('\n')}`,
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

    const finish = async (skip_check?: boolean) => {
        try {
            if (!skip_check) {
                const total_scanned = (count?.steri_labels || []).reduce((obj, item) => ({
                    ...obj,
                    [item.steri_item_id]: (obj[item.steri_item_id] || 0) + 1
                }), {} as { [id: number]: number })
                if (count.countable_items.findIndex(i => i.total_count > total_scanned[i.id]) > -1) {
                    setShowFailedDialog(true)
                    return;
                }

            }
            const { data } = await finishCount({
                variables: {
                    id: count.id
                }
            })
            if (data?.finish_count?.is_locked_at) {
                toast({
                    title: 'Count finished'
                })
                navigate('/counts')
            }
        } catch (e) {
            createErrorToast(e)
        }
    }

    return (
        <div className="container my-6 space-y-6">
            {count.is_locked_at ? <CountListItem
                count={count}
            /> : <PendingCountListItem
                count={count}
            />}

            <AlertDialog open={show_failed_dialog} onOpenChange={() => setShowFailedDialog(false)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Failed Count?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Looks like not everything was counted. Are you sure you want to mark this count complete!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => finish(true)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className='bg-slate-100 p-4 rounded-md shadow-lg mb-8'>
                <Button className='w-full'
                    size='lg' disabled={finishing || !!count.is_locked_at} onClick={() => finish()}>
                    {finishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {count.is_locked_at ? 'Count Complete' : 'Finish Count'}</Button>
            </div>

            {!count.is_locked_at && <>
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
            </>}
        </div>
    )
}

