import { Link } from "react-router-dom"
import { UserFragment } from "../../__generated__/graphql"
import { useClinic } from "../../lib/useClinic"
import { Button } from "../ui/button"
import PrinterStatus from "./PrinterStatus"

function Header({
    user,
    endSession,
}: {
    endSession?: () => void
    user?: UserFragment
}) {
    const { clinic } = useClinic()
    return (
        <header className='flex items-center p-4 shadow-lg border-b-2'>
            <Link to='/' className='hover:bg-slate-100 absolute left-2 rounded-full px-2 py-1'>
                <div className='flex items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className='w-5 h-5' strokeWidth={1.2} stroke="currentColor" fill="none">
                        <path d="M19.883.178A.5.5 0 0019.501 0h-.51C13.951-.002 9.97-.003 7.039.698c-1.575.377-2.793.946-3.723 1.739-1.004.856-1.688 1.977-2.093 3.429-.269.964-.395 2.705.136 4.437.196.64.502 1.244.91 1.799C1.053 14.007.002 16.516.002 19.501a.5.5 0 001 0c0-4.605 2.728-8.021 4.354-9.646 1.167-1.167 2.486-2.152 3.816-2.848 1.238-.648 2.421-1.005 3.331-1.005a.5.5 0 000-1c-1.084 0-2.396.387-3.794 1.12-1.418.743-2.822 1.789-4.059 3.027a17.933 17.933 0 00-1.774 2.07 4.947 4.947 0 01-.559-1.207c-.5-1.632-.316-3.204-.129-3.875C3.618 1.012 9.05.999 18.905 1.002 17.73 7.29 15.539 11.36 12.389 13.103c-2.922 1.617-5.82.735-6.931.28a5.366 5.366 0 01-.699-.35.5.5 0 00-.511.859c.272.162.552.302.832.417a9.917 9.917 0 003.679.722 8.392 8.392 0 004.115-1.053c1.609-.89 3.001-2.339 4.139-4.304 1.334-2.305 2.338-5.362 2.983-9.086a.5.5 0 00-.11-.407z"></path>
                    </svg>
                    <p className='ml-1 font-bold'>
                        OpenSteri
                    </p>
                </div>
            </Link>
            <div className='flex-1 text-center font-semibold'>{clinic.name}</div>
            <div className='flex items-center absolute right-2'>
                <PrinterStatus />
                <Link to='/settings' className='hover:bg-slate-100 rounded-full px-2 py-1'>
                    <div className='flex items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                        </svg>
                        <p className='ml-2 font-bold'>
                            Settings
                        </p>
                    </div>
                </Link>
                {user && <Button onClick={endSession}>{user.name} (Log Out)</Button>}
            </div>
        </header>
    )
}

export default Header