import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Appointment } from '../../connector/interfaces';
import { cn } from '../../lib/utils';

const RowHeight = 48
const MinutesPerRow = 15
const RowsPerHour = 60 / MinutesPerRow


interface DayScheduleProps {
    events: Appointment[];
    selectEvent: (event: Appointment) => void;
}

const generateTimeSlots = (start: Date, end: Date): string[] => {
    const startHour = +dayjs(start).format('HH')
    const endHour = +dayjs(end).format('HH')
    const slots: string[] = [];
    for (let hour = startHour; hour <= endHour; hour++) {
        const time = dayjs(`1970-01-01T${hour.toString().padStart(2, '0')}:00:00`).format('h a');
        slots.push(time);
    }
    return slots;
};


const calculateEventPosition = (start_at: Date, startTime: Date) => {
    const start = dayjs(startTime);
    const minutesSinceStartOfDay = start.diff(start_at, 'minute');
    return (minutesSinceStartOfDay / MinutesPerRow) * RowHeight;
};

export const DaySchedule: React.FC<DayScheduleProps> = ({
    events,
    selectEvent
}) => {
    const [start, end] = useMemo(() => {
        if (events.length === 0) {
            return [new Date(), new Date()]
        }
        events.sort((a, b) => +a.start_time - +b.start_time)
        const start = dayjs(events[0]?.start_time || new Date())
            .toDate()
        const last_event = events[events.length - 1]
        const end = dayjs(last_event.end_time)
            .add(1, 'h').toDate()
        return [start, end]
    }, [events])
    const timeSlots = generateTimeSlots(start, end);

    const appts_by_cols = useMemo(() => {
        return events.reduce((all, event) => {
            const col = `${event.column || 0}`
            return {
                ...all,
                [col]: [...(all[col] || []), event]
            }
        }, {} as { [id: string]: Appointment[] })
    }, [events])

    return (
        <div className="relative w-full">
            {timeSlots.map((time) => (
                <div key={time} className='w-full flex flex-col'
                    style={{ height: RowHeight * RowsPerHour }}>
                    {new Array(RowsPerHour).fill(0).map((_, index) => (
                        <div className='border-b border-gray-200 flex items-center' key={index} style={{
                            height: RowHeight
                        }}>
                            {index === 0 && time}
                        </div>
                    ))}
                </div>
            ))}
            <div className='flex w-full space-x-2 absolute left-0 top-0'>
                <div className='w-12' />
                {Object.keys(appts_by_cols).map((col: string) => (
                    <div key={col} className='flex-1 relative'>
                        {appts_by_cols[col].map((event) => (
                            <button key={event.id}
                                onClick={() => selectEvent(event)}
                                className={cn(
                                    // event.status === Appointment_Status_Enum.Finished
                                    // ? 'hover:bg-gray-800 bg-gray-800/80 border border-gray-500 text-white'
                                    'hover:bg-blue-300 bg-blue-200/80 border border-blue-500 ',
                                    "absolute text-left flex flex-col  overflow-hidden rounded-md w-full",
                                )}
                                style={{
                                    top: calculateEventPosition(start, event.start_time),
                                    height: dayjs(event.end_time).diff(event.start_time, 'm') / MinutesPerRow * RowHeight,
                                }}>
                                <div className='bg-blue-300 px-2 py-1 w-full'>
                                    <span className="text-lg font-semibold">{event.name}</span>
                                    {event.description && <span className="font-light"> &mdash; {event.description}</span>}
                                </div>
                                <div className='text-md  px-2'>{event.tags}</div>
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            {/* <div className='flex-1 relative'>
                {timeSlots.map((time) => (
                    <div key={time} className='bg-gray-100 flex-1'>
                        {[0, 1, 2, 3].map((index) => (
                            <div style={{ height: RowHeight }}
                                key={index}
                                className='w-full border-b border-gray-200' />
                        ))}
                    </div>
                ))}
                {events.map((event, index) => (
                    <div
                        key={index}
                        onClick={() => selectEvent(event)}
                        className={cn(
                            // event.status === Appointment_Status_Enum.Finished
                            // ? 'hover:bg-gray-800 bg-gray-800/80 border border-gray-500 text-white'
                            'hover:bg-blue-300 bg-blue-200/80 border border-blue-500 ',
                            "absolute px-2 py-1  overflow-hidden rounded-md",
                        )}
                        style={{
                            top: calculateEventPosition(start, event.start_time),
                            left: (event.column || 0) * (AppointmentWidth + 10),
                            width: AppointmentWidth,
                            height: dayjs(event.end_time).diff(event.start_time, 'm') / MinutesPerRow * RowHeight,
                        }}
                    >
                        <span className="text-sm font-semibold">{event.name}</span>
                        {event.description && <span className="text-sm font-light"> &mdash; {event.description}</span>}
                    </div>
                ))}
            </div> */}
        </div>
    );
};