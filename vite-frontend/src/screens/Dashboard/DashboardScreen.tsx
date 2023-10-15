import AppointmentCalendar from '../../components/Calendar/AppointmentCalendar'
import AppointmentConnector from '../../connector/AppointmentConnector'
import { useClinic } from '../../lib/useClinic'
import SporeTestWidget from './SporeTestWidget'

function DashboardScreen() {
  const { clinic } = useClinic()
  return (
    <div className="container relative">
      <SporeTestWidget />
      <AppointmentConnector
        connector={clinic.connector}>{props => <AppointmentCalendar {...props} />}
      </AppointmentConnector>
    </div>
  )
}

export default DashboardScreen