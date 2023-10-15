import { Loader2 } from 'lucide-react'
import React, { ReactElement, createContext, useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/ui/button'
import SetupForm from './SetupForm'
import { CurveBaseUrlKey } from './constants'
import { CurveHeroApi, CurveHeroCalls } from './curveheroCalls'
import { UserInfo } from './curveheroTypes'

export type CurveContextProps = {
  subdomain: string
  user: UserInfo
  logout: () => void
  curveHeroApi: CurveHeroApi
}

export const RootContext = createContext<CurveContextProps>({} as CurveContextProps)

function CurveProvider({
  children,
}: {
  children: ReactElement | ReactElement[]
}) {
  const [is_extension_installed, setIsExtensionInstalled] = useState(false)
  const [loading_subdomain, setLoadingSubdomain] = useState(true)
  const [subdomain, _setSubdomain] = useState('')
  const [loading_user, setLoadingUser] = React.useState(false)
  const [user, setUser] = React.useState<UserInfo | undefined>(undefined)
  const curveheroApi = useMemo(() => !subdomain
    ? null
    : CurveHeroCalls(`${subdomain}.curvehero.com`), [subdomain])


  //check if chrome extension is installed
  useEffect(() => {
    const listener = (event: MessageEvent<{ type: string }>) => {
      console.log(event)
      const result = event.data
      if (result && result.type === 'curvemax_installed') {
        setIsExtensionInstalled(true)
      }
    }
    window.addEventListener('message', listener)
    window.postMessage({ type: 'is_curvemax_installed' }, '*')
    return () => window.removeEventListener('message', listener)
  }, [])

  const setSubdomain = (subdomain: string) => {
    _setSubdomain(subdomain)
    localStorage.setItem(CurveBaseUrlKey, subdomain)
  }

  useEffect(() => {
    _setSubdomain(localStorage.getItem(CurveBaseUrlKey) || '')
    setLoadingSubdomain(false)
  }, [is_extension_installed])

  useEffect(() => {
    if (!subdomain) {
      return
    }
    window.postMessage({
      type: 'set_subdomain',
      value: subdomain,
    })
  }, [subdomain])

  useEffect(() => {
    if (!curveheroApi) {
      return
    }
    (async () => {
      try {
        setLoadingUser(true)
        const data = await curveheroApi.getUserInfo()
        if (!data) {
          return;
        }
        setUser(data)
      } finally {
        setLoadingUser(false)
      }
    })();
  }, [curveheroApi])


  if (!is_extension_installed) {
    return <div className='w-full py-8 bg-gradient-to-br flex justify-center flex-col items-center'>
      Missing CurveMax Extension
    </div>
  }

  if (loading_subdomain || loading_user) {
    return <div className='py-16 flex items-center justify-center'><Loader2 className='h-4 w-4 animate-spin' /></div>
  }

  if (!curveheroApi) {
    return <SetupForm
      submit={setSubdomain}
    />
  }

  const login = () => {
    window.postMessage({
      type: 'login',
    }, '*')
  }

  const logout = () => {
    console.log('logout')
  }


  if (!user) {
    return <div className='flex flex-col items-center justify-center min-h-screen space-y-4'>
      <div className='text-4xl font-bold'>
        Welcome back
      </div>
      <div>Looks like your session expired</div>
      <Button onClick={login}>Login</Button>
    </div>
  }


  return (
    <RootContext.Provider value={{
      subdomain: subdomain,
      curveHeroApi: curveheroApi,
      user,
      logout,
    }}>
        {children}
    </RootContext.Provider>
  )
}


export default CurveProvider