import { ReactElement, createContext } from "react"
import { ClinicFragment, Clinic_Set_Input, User_Insert_Input, useGetClinicQuery, useInsertUsersMutation, useUpdateClinicMutation } from "../__generated__/graphql"
import ClinicSetupForm from "../components/Clinic/ClinicSetupForm"
import UserSetupForm from "../components/Clinic/UserSetupForm"
import LoadingScreen from "../screens/LoadingScreen"
import { createErrorToast } from "./createErrorToast"

export type ClinicCtx = {
  clinic: ClinicFragment
  updateClinic: (set: Clinic_Set_Input) => void
}

export const ClinicContext = createContext<ClinicCtx>({} as ClinicCtx)

function ClinicProvider({
  children
}: {
  children: ReactElement | ReactElement[]
}) {
  const { data, refetch, loading } = useGetClinicQuery()
  const [update, { loading: updating }] = useUpdateClinicMutation()
  const [insertUsers, { loading: inserting_users }] = useInsertUsersMutation()
  const clinic = data?.clinic

  if (loading) {
    return <LoadingScreen />
  }

  const updateClinic = async (data: Clinic_Set_Input) => {
    try {
      await update({
        variables: {
          set: data,
        }
      })
      refetch()
    } catch (e) {
      createErrorToast(e)
    }
  }

  const createUsers = async (users: User_Insert_Input[]) => {
    try {
      await insertUsers({
        variables: {
          objects: users,
        }
      })
      refetch()
    } catch (e) {
      createErrorToast(e)
    }
  }

  if (!clinic) {
    return <ClinicSetupForm
      submit={updateClinic}
      loading={updating}
    />
  }

  if (!clinic.user
    || clinic.user.filter(u => u.is_active)
      .length === 0) {
    return <UserSetupForm submit={createUsers} loading={inserting_users} />
  }

  return (
    <ClinicContext.Provider value={{
      clinic,
      updateClinic
    }}>
      {children}
    </ClinicContext.Provider>
  )
}

export default ClinicProvider