import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { SteriLabelFragment, Steri_Cycle_Set_Input, Steri_Label_Event_Type, useGetSteriCycleQuery, useInsertSteriLabelEventMutation, useUpdateSteriCycleMutation } from '../../__generated__/graphql';
import BackButton from '../../components/BackButton';
import NotFoundItem from '../../components/NotFoundItem';
import SteriLabel from '../../components/SteriLabel/SteriLabel';
import { toast } from '../../components/ui/use-toast';
import { QRType } from '../../constants';
import { useUser } from '../../lib/UserProvider';
import { createErrorToast } from '../../lib/createErrorToast';
import useBeep from '../../lib/use-beep';
import LoadingScreen from '../LoadingScreen';
import ScanInput from './ScanInput';
import SteriController from './SteriController';


dayjs.extend(relativeTime)

function SteriCycleScreen() {
    const { user } = useUser();
    const cycle_id = +(useParams().cycle_id || '');
    const [insertSteriLabelEvent] = useInsertSteriLabelEventMutation()
    const [executeMutation, status] = useUpdateSteriCycleMutation();
    const [loading_steri_cycle_item, setLoadingSteriCycleItem] = useState<{ [id: number]: boolean }>({})
    const playBeep = useBeep()

    const {
        data,
        loading,
        error,
        refetch,
    } = useGetSteriCycleQuery({
        variables: {
            id: cycle_id,
        }
    })

    const cycle = data?.steri_cycle_by_pk;

    const onScan = async (data: {
        type: QRType;
        id: number | string;
    }) => {
        if (!cycle) {
            return;
        }
        if (data?.type === QRType.SteriLabel) {
            const { id } = data;
            // add this label to the load.
            try {
                const { data } = await insertSteriLabelEvent({
                    variables: {
                        objects: [{
                            type: Steri_Label_Event_Type.AddSteriItem,
                            steri_label_id: +id,
                            user_id: user.id,
                            data: JSON.stringify({
                                steri_cycle_id: cycle_id,
                            })
                        }]
                    }
                })
                const item = (data?.insert_steri_label_event?.returning || [])[0]

                if (!item) {
                    toast({
                        title: `Failed to add item`,
                        variant: 'destructive'
                    })
                    playBeep(720)
                    return;
                }
                refetch()
                toast({
                    title: `Added ${item.steri_item.name} to #${cycle_id}`,
                });
                playBeep(860)
            } catch (e) {
                createErrorToast(e)
            }
        }
    }


    if (loading) {
        return <LoadingScreen />
    }

    if (!cycle) {
        return <NotFoundItem title='Sorry, this steri cycle was not found' />
    }

    const removeSteriCycleItem = async (steri_label: SteriLabelFragment) => {
        setLoadingSteriCycleItem(l => ({
            ...l,
            [steri_label.id]: true,
        }))
        try {
            const { data } = await insertSteriLabelEvent({
                variables: {
                    objects: [{
                        type: Steri_Label_Event_Type.RemoveSteriItem,
                        data: '',
                        steri_label_id: steri_label.id,
                        user_id: user.id,
                    }]
                }
            })
            const item = (data?.insert_steri_label_event?.returning || [])[0]
            if (!item) {
                toast({
                    title: `Failed to remove item`,
                    variant: 'destructive'
                })
                return;
            }
            refetch()
            toast({
                title: `Removed ${item.steri_item.name}`,
            });
        } catch (e) {
            createErrorToast(e)
        } finally {
            setLoadingSteriCycleItem(l => ({
                ...l,
                [steri_label.id]: false,
            }))
        }
    }
    const updateCycle = async (v: Steri_Cycle_Set_Input) => {
        try {
            await executeMutation({
                variables: {
                    id: cycle.id,
                    set: v,
                }
            });
        } catch (e) {
            createErrorToast(e)
        }
    }



    return (
        <div className='my-6 mx-auto container'>
            <BackButton href='/cycles' />
            {JSON.stringify(error)}
            <div className='mt-2 flex items-start border-b-2 pb-2'>
                <div className='flex-1'>
                    <p className='text-sm text-gray-500'>{cycle.id} - {cycle.steri?.name}</p>
                    <p className='font-bold'>Cycle #: {cycle.cycle_number}</p>
                    <p className='text-sm'>Start: {cycle.start_at ? `${dayjs(cycle.start_at).format('MM/DD/YYYY HH:mm')} - ${cycle.start_user?.name}` : 'Not Started'}</p>
                    <p className='text-sm'>Finish: {cycle.finish_at ? `${dayjs(cycle.finish_at).format('MM/DD/YYYY HH:mm')} - ${cycle.finish_user?.name}` : 'Not finished'}</p>
                </div>
                <Link to='edit'>Edit</Link>
            </div>
            {cycle.is_spore_test_enabled && <div className={`${!cycle.spore_test_recorded_at ? 'bg-orange-200' : cycle.spore_test_result === 'passed' ? 'bg-green-200' : 'bg-red-200'} p-2 rounded-xl my-2`}>
                <p className='text-sm font-bold'>Spore Test</p>
                {cycle.spore_test_user && <p className='text-sm'>Recorded by: {cycle.spore_test_user.name}</p>}
                <p className='text-sm'>{!cycle.spore_test_result ? 'Pending results' : `${cycle.spore_test_result} @ ${dayjs(cycle.spore_test_recorded_at).format('MM/DD/YYYY HH:mm')}`}</p>
            </div>}
            {cycle.notes ? <div className='my-2'>
                <p className='text-sm text-gray-800 font-semibold'>Notes</p>
                <p className='text-sm'>{cycle.notes}</p>
            </div> : null}

            {cycle.status === 'loading' && <div className='my-4 flex flex-col items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                </svg>
                {cycle.steri_labels.length > 0 && <>
                    <p className='text-5xl font-bold text-green-600'>{cycle.steri_labels.length} Items</p>
                    <p className='text-lg'>Last Added: <span className='font-bold text-green-600'>
                        {cycle.steri_labels[0]?.steri_item?.name}</span> {dayjs(cycle.steri_labels[0]?.loaded_at).fromNow()}</p>
                </>}
                <h2 className='text-md font-semibold text-gray-600'>Use the handheld scanner to scan all items going into the sterilizer.</h2>
            </div>}

            {(cycle.steri_labels || []).length > 0 ? <SteriController
                status={cycle.status}
                user={user}
                finish_at={cycle.finish_at}
                updateCycle={updateCycle}
                loading={status.loading}
            /> : null}


            <ScanInput is_finished={Boolean(cycle.finish_at)} onScan={onScan} />

            {/* <SteriLogViewer log_data={cycle.log_data} /> */}

            <div className='py-4'>
                
                {(cycle.steri_labels || []).length > 0 && <p className='text-lg font-bold'>Content</p>}
                <div className='grid grid-cols-2 gap-4'>
                    {
                        (cycle.steri_labels || []).map((item) =>
                            <SteriLabel
                                key={item.id}
                                item={item}
                                remove={!cycle.finish_at ? () => removeSteriCycleItem(item) : undefined}
                                loading={loading_steri_cycle_item[item.id]}
                            />)
                    }
                </div>
            </div>
        </div >
    )
}

export default SteriCycleScreen
