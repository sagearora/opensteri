import { ReactElement } from "react"
import { Clinic_Connector } from "../__generated__/graphql"
import { ListAppointmentsFn } from "./ListAppointmentsFn"
import CurveCalendar from "./curve/CurveCalendar"
import CurveProvider from "./curve/CurveProvider"

function AppointmentConnector({
    connector,
    children,
}: {
    connector: Clinic_Connector
    children: (v: {
        listAppointments: ListAppointmentsFn
    }) => ReactElement | ReactElement[]
}) {
    switch (connector) {
        case Clinic_Connector.CurveDental:
            return <CurveProvider>
                <CurveCalendar>{p => children(p)}</CurveCalendar>
            </CurveProvider>
        default:
            return <div className="py-16 text-center">
                <h2 className="text-xl mb-2 font-bold">Unsupported Practice Management Software</h2>
                <div>We are looking to add more practice management software integrations into Open Steri. Contact us at dev@aroradental.com to integrate yours.</div>
            </div>
    }
}

export default AppointmentConnector