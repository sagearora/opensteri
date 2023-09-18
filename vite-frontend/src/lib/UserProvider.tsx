import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useIdleTimer } from 'react-idle-timer';
import { UserFragment } from "../__generated__/graphql";
import { AlertDialogFooter, AlertDialogHeader } from "../components/ui/alert-dialog";
import NoUserScreen from "./NoUserScreen";

export interface UserCtx {
    user: UserFragment;
    resetInactiveTimer: () => void;
    endSession: () => void;
}

const UserContext = createContext<UserCtx>({} as UserCtx);

export type ProvideUserProps = {
    children?: React.ReactNode;
    adminRequired?: boolean;
}

const ExpiryMilliSeconds = 60 * 10 * 1000 // 10 minutes

export const ProvideUser = ({
    children,
    adminRequired,
}: ProvideUserProps) => {
    const [user, _setUser] = useState<UserFragment | undefined>();
    const [show_dialog, setShowDialog] = useState(false)
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
        if (adminRequired && !saved.user.is_admin) {
            return
        }
        _setUser(saved.user)
    }, [adminRequired])

    const setUser = (user?: UserFragment) => {
        if (!!user && adminRequired && !user.is_admin) {
            setShowDialog(true)
            return;
        }
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
        <AlertDialog open={show_dialog} onOpenChange={() => setShowDialog(false)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Admin Required</AlertDialogTitle>
                    <AlertDialogDescription>
                        Only an admin user can access this section of the app.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction>Okay</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            {children}
        </AlertDialog>
    </UserContext.Provider> : <NoUserScreen setUser={setUser} />
}

export const useUser = () => {
    return useContext(UserContext);
}