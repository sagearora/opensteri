import { createContext, useContext, useEffect, useState } from "react";
import { useIdleTimer } from 'react-idle-timer';
import { Outlet } from "react-router-dom";
import { UserFragment } from "../__generated__/graphql";
import NoUserScreen from "./NoUserScreen";

export interface UserCtx {
    user: UserFragment;
    resetInactiveTimer: () => void;
    endSession: () => void;
}

const UserContext = createContext<UserCtx>({} as UserCtx);

const ExpiryMilliSeconds = 60 * 10 * 1000 // 10 minutes

export const UserProvider = () => {
    const [user, _setUser] = useState<UserFragment | undefined>();
    const onIdle = () => {
        setUser(undefined)
    }
    const timer = useIdleTimer({
        onIdle,
        timeout: ExpiryMilliSeconds,
    })
    useEffect(() => {
        const saved_user = localStorage.getItem('user')
        const saved = saved_user ? JSON.parse(saved_user) as {
            user: UserFragment
        } : undefined
        if (!saved || !saved.user) {
            return
        }
        _setUser(saved.user)
    }, [])

    const setUser = (user?: UserFragment) => {
        _setUser(user);
        localStorage.setItem('user', JSON.stringify(user ? {
            user
        } : {}))
    }


    return user ? <UserContext.Provider value={{
        user,
        resetInactiveTimer: () => timer.reset(),
        endSession: () => setUser(undefined)
    }}>
       <Outlet />
    </UserContext.Provider> : <NoUserScreen setUser={setUser} />
}

export const useUser = () => {
    return useContext(UserContext);
}