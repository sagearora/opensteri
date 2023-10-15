import { Appointment } from "./interfaces";

export type ListAppointmentsFn = (date: string) => Promise<{
    items: Appointment[]
    total_ops: number
}>;
