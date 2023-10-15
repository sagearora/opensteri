import proxyFetch from "./proxy-fetch"
import { CurveAppointment, Clinic, UserInfo } from "./curveheroTypes"

export const CurveHeroCalls = (base_url: string) => ({
    getClinicInfo: async() => {
        const res = await proxyFetch(`https://${base_url}/cheetah/clinic`)
        const data = await res.json()
        if (data && data.objects && data.objects[0]) {
            return data.objects[0] as Clinic
        }
    },
    getUserInfo: async () => {
        const res = await proxyFetch(`https://${base_url}/cheetah/userinfo`, {
            method: 'GET',
        })
        if (res.status === 200) {
            return (await res.json()) as UserInfo
        }
        return null
    },
    listAppointments: async (date: string) => {
        const res = await proxyFetch(`https://${base_url}/cheetah/calendar_event?date=${date}`, {
            method: 'GET',
        })
        if (res.status === 200) {
            return (await res.json()) as CurveAppointment[]
        }
        return []
    }
})

export type CurveHeroApi = ReturnType<typeof CurveHeroCalls>