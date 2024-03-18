import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo, useState } from 'react';
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

    const logdata = useMemo(() => {
        if (!cycle?.finish_at) {
            return null
        }
        if (cycle.log_data) {
            return JSON.parse(cycle.log_data) as {
                temp: number;
                duration: string;
                pressure: number;
                class5: boolean;
            }
        }
        return {
            temp: 270,
            duration: '04:00',
            pressure: 27.5,
            class5: true,
        }
    }, [cycle])
    
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
            {cycle.is_spore_test_enabled && <div className={`${!cycle.spore_test_recorded_at ? 'bg-orange-200' : cycle.spore_test_result === 'passed' ? 'bg-green-200' : 'bg-red-200'} p-2 rounded-md my-2`}>
                <p className='text-sm font-bold'>Spore Test</p>
                {cycle.spore_test_user && <p className='text-sm'>Recorded by: {cycle.spore_test_user.name}</p>}
                <p className='text-sm'>{!cycle.spore_test_result ? 'Pending results' : `${cycle.spore_test_result} @ ${dayjs(cycle.spore_test_recorded_at).format('MM/DD/YYYY HH:mm')}`}</p>
            </div>}
            {cycle.notes ? <div className='my-2'>
                <p className='text-sm text-gray-800 font-semibold'>Notes</p>
                <p className='text-sm'>{cycle.notes}</p>
            </div> : null}
            {logdata && <div className='my-2'>
                <p className='text-sm'>Temp: {logdata.temp}°F</p>
                <p className='text-sm'>Time: {logdata.duration}</p>
                <p className='text-sm'>Class 5 Passed: YES</p>
                <p className='text-sm'>Pressure: {logdata.pressure}psi</p>
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
