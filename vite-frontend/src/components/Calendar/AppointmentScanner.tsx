import dayjs from 'dayjs';
import { Loader2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SteriLabelFragment, Steri_Label_Event_Type, useInsertSteriLabelEventMutation, useListAppointmentSteriLabelsQuery } from '../../__generated__/graphql';
import { Appointment } from '../../connector/interfaces';
import { DefaultExpiryMonths, QRType } from '../../constants';
import { useUser } from '../../lib/UserProvider';
import { createErrorToast } from '../../lib/createErrorToast';
import useBeep from '../../lib/use-beep';
import useScanner from '../../lib/use-scanner';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';

function AppointmentScanner({
    appointment,
    onClose
}: {
    appointment: Appointment
    onClose: () => void
}) {
    const { user } = useUser();
    const playBleep = useBeep();
    const { data, loading, refetch } = useListAppointmentSteriLabelsQuery({
        variables: {
            appointment_id: appointment.id
        }
    })
    const [insertEvent] = useInsertSteriLabelEventMutation()
    const [loading_label, setLoadingLabel] = useState<{ [id: number]: boolean }>({});

    const items = data?.steri_label || []

    const onScan = async (data: {
        type: QRType;
        id: string | number;
    }) => {
        if (!user || !appointment) {
            return;
        }
        if (data?.type === QRType.SteriLabel) {
            const { id } = data;
            // add this label to the appointment.
            try {
                const { data } = await insertEvent({
                    variables: {
                        objects: [{
                            type: Steri_Label_Event_Type.CheckoutSteriItem,
                            steri_label_id: +id,
                            user_id: user.id,
                            data: JSON.stringify({
                                appointment_id: appointment.id,
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
                    title: `Added ${items[0].steri_item.name} to ${appointment.name}`,
                });
            } catch (e) {
                createErrorToast(e)
            }
        }
    }

    useScanner({
        is_scanning: !!user,
        onScan: onScan
    })

    const not_printed = useMemo(() => {
        return items.filter(i => !i.next_label_id || i.next_label_id === 1)
    }, [items])

    if (!appointment) {
        return null
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
                        type: Steri_Label_Event_Type.UndoCheckout,
                        data: '',
                        user_id: user.id,
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


    const completeAppointment = async () => {
        if (not_printed.length === 0) {
            return
        }
       printReplacement(not_printed)
    }

    const printReplacement = async (items: SteriLabelFragment[]) => {
        try {
            const { data } = await insertEvent({
                variables: {
                    objects: items.map(item => ({
                        type: Steri_Label_Event_Type.PrintReplacement,
                        steri_label_id: item.id,
                        user_id: user.id,
                        data: JSON.stringify({
                            expiry_at: dayjs().add(DefaultExpiryMonths, 'months').toISOString()
                        })
                    })),
                }
            })
            const labels = data?.insert_steri_label_event?.returning || []
            if (labels.length !== items.length) {
                toast({
                    title: 'Failed to print all labels',
                    variant: 'destructive'
                })
                return;
            }
            refetch()
            toast({
                title: `Sent ${items.length} labels to printer`,
            });
        } catch (e) {
            createErrorToast(e)
        }
    }


    return (
        <div
            className='fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] h-[80vh] flex flex-col
            gap-4 border bg-background p-2 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full'>
            <div className='px-2 py-2 border-b text-center relative'>
                <div className='font-semibold text-md'>{appointment.name}</div>
                <button autoFocus={false} tabIndex={-1} className='text-lg text-gray-800 absolute right-2 top-2'
                    onClick={onClose}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className='px-2 flex flex-col items-center py-2'>
                <svg xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                </svg>
                {items.length > 0 && <>
                    <p className='text-5xl font-bold text-green-600'>{items.length} Items</p>
                    <p className='text-lg'>Last Added: <span className='font-bold text-green-600'>
                        {items[0]?.steri_item?.name}</span> {dayjs(items[0]?.checkout_at).fromNow()}</p>
                </>}
                <h2 className='text-md text-center font-semibold text-gray-600'>Use the handheld scanner to scan all items going into the patient's chart.</h2>
            </div>
            {items.length > 0 && <div className='px-4'>
                <Button
                    type='button'
                    tabIndex={-1}
                    disabled={not_printed.length === 0}
                    onClick={completeAppointment}
                    size='lg'
                    className='w-full'
                    color='primary'>
                    Send All To Printer ({not_printed.length})
                </Button>
            </div>}
            <div className='flex-1 overflow-y-auto'>
                <div className='px-4 py-2 space-y-2 flex-1 overflow-y-auto'>
                    {loading && <Loader2 className='h-4 w-4 animate-spin' />}
                    {items.map((item) => <div key={item.id} className='border-b flex items-center space-x-2 py-2'>
                        <div className='flex-1 text-left'>
                            <p className='text-xs'>#{item.id} - {item.steri_item.category}</p>
                            <p className='text-md font-semibold'>{item.steri_item.name}</p>
                            <p className='text-sm text-gray-600'>{item.clinic_user.name} &middot; {dayjs(item.checkout_at).fromNow()}</p>
                        </div>
                        <Button variant={item.next_label_id ? 'outline' : 'default'} size='icon'
                            disabled={!!item.next_label_id && item.next_label_id !== 1}
                            onClick={() => printReplacement([item])}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                            </svg>
                        </Button>
                        <Button color='danger'
                            tabIndex={-1}
                            size='icon'
                            onClick={() => removeLabel(item)} variant='destructive'>
                            {loading_label[item.id] && <Loader2 className='h-4 w-4 animate-spin' />} <X className='h-4 w-4' /></Button>
                    </div>)}
                </div>
            </div>
        </div >
    )
}

export default AppointmentScanner