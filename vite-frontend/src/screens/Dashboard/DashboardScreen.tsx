import AppointmentCalendar from '../../components/Calendar/AppointmentCalendar'
import AppointmentConnector from '../../connector/AppointmentConnector'
import { Connector } from '../../connector/Connector'
import SporeTestWidget from './SporeTestWidget'

function DashboardScreen() {
  return (
    <div className="container relative">
      <SporeTestWidget />
      <AppointmentConnector
        connector={Connector.curve}>{props => <AppointmentCalendar {...props} />}
      </AppointmentConnector>
    </div>
  )
}

export default DashboardScreen