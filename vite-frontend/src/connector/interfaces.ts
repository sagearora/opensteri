export type Appointment = {
    id: string;
    start_time: Date;
    end_time: Date;
    name: string
    description?: string;
    column: number;
    tags?: string;
}