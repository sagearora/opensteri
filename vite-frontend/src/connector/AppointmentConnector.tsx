import { ReactElement } from "react"
import { Connector } from "./Connector"
import { ListAppointmentsFn } from "./ListAppointmentsFn"
import CurveProvider from "./curve/CurveProvider"
import CurveCalendar from "./curve/CurveCalendar"

function AppointmentConnector({
    connector,
    children,
}: {
    connector: Connector
    children: (v: {
        listAppointments: ListAppointmentsFn
    }) => ReactElement | ReactElement[]
}) {
    switch (connector) {
        case Connector.curve:
            return <CurveProvider>
                <CurveCalendar>{p => children(p)}</CurveCalendar>
            </CurveProvider>
    }

    return (
        <div>Invalid connector</div>
    )
}

export default AppointmentConnector