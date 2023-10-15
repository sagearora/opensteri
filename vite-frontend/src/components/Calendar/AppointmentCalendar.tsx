import dayjs from 'dayjs'
import { Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { ListAppointmentsFn } from '../../connector/ListAppointmentsFn'
import { Appointment } from '../../connector/interfaces'
import { Dialog } from '../ui/dialog'
import AppointmentScanner from './AppointmentScanner'
import { DaySchedule } from './TimeSlot'

function AppointmentCalendar({
    listAppointments
}: {
    listAppointments: ListAppointmentsFn
}) {
    const [loading, setLoading] = useState<boolean>(false)
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [date, setDate] = useState<string>(dayjs().subtract(1, 'day').startOf('day').toISOString())
    const [view_appointment, setViewAppointment] = useState<Appointment>()

    const loadAppointments = useCallback(async () => {
        setLoading(true)
        const response = await listAppointments(date)
        setAppointments(response.items)
        setLoading(false)
    }, [date, listAppointments])

    useEffect(() => {
        loadAppointments()
    }, [date, loadAppointments])


    const setToToday = () => {
        setDate(dayjs().startOf('d').toDate().toUTCString())
    }

    const goPrevDay = () => {
        setDate(d => dayjs(d).startOf('d').subtract(1, 'd').toDate().toUTCString())
    }

    const goNextDay = () => {
        setDate(d => dayjs(d).startOf('d').add(1, 'd').add(1, 'm').toDate().toUTCString())
    }

    const selectEvent = (event: Appointment) => {
        setViewAppointment(event)
    }

    return (
        <Dialog
            open={Boolean(view_appointment)}
            // onOpenChange={() => setViewAppointment(undefined)}
        >
            <div>
                <div className="flex items-center py-4">
                    <button onClick={goPrevDay} className="p-2 mx-2 bg-slate-200 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <div className="flex-1 flex justify-center items-center">
                        <p className='text-md font-bold'>{dayjs(date).format('MMM DD, YYYY')}</p>
                        <button
                            onClick={setToToday}
                            className="px-2 py-1 mx-2  bg-slate-200 rounded-xl">Today</button>
                    </div>
                    <button onClick={goNextDay} className="p-2 mx-2  bg-slate-200 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
                {loading && <Loader2 />}
                <DaySchedule
                    events={appointments}
                    selectEvent={selectEvent}
                />
                {view_appointment && <AppointmentScanner
                    appointment={view_appointment}
                    onClose={() => setViewAppointment(undefined)}
                />}
            </div>
        </Dialog>
    )
}

export default AppointmentCalendar