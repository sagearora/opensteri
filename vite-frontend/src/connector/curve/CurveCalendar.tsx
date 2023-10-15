import dayjs from "dayjs"
import { ListAppointmentsFn } from "../ListAppointmentsFn"
import { Appointment } from "../interfaces"
import { useCurve } from "./useCurve"

function CurveCalendar({ children }: {
    children: (v: {
        listAppointments: ListAppointmentsFn
    }) => React.ReactElement | React.ReactElement[]
}) {
    const { curveHeroApi } = useCurve()

    const listAppointments = async (date: string): Promise<{
        items: Appointment[],
        total_ops: number
    }> => {
        const result = await curveHeroApi?.listAppointments(date)
        const op_ids = Object.keys((result || []).reduce((all, item) => ({
            ...all,
            [item.operatory_id]: true,
        }), {}))
        return {
            items: (result || []).filter(r => !!r.patient_id
                && ['2', '4', '6'].indexOf(r.appointment_status_id) === -1)
                .map(r => ({
                    id: r.id,
                    name: r.patient.full_name,
                    description: r.description,
                    tags: r.appointment_tag_names.map(t => t.name).join(', '),
                    start_time: new Date(r.starttime_at),
                    end_time: dayjs(r.starttime_at).add(+r.length, 'minute').toDate(),
                    status: r.appointment_status_id,
                    column: op_ids.indexOf(r.operatory_id),
                })),
            total_ops: op_ids.length,
        }
    }

    return children({ listAppointments })
}

export default CurveCalendar