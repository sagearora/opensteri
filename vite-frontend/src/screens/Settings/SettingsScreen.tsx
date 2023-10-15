import { Link, useNavigate } from "react-router-dom";
import packageJson from '../../../package.json';
import BackButton from "../../components/BackButton";
import { Button } from "../../components/ui/button";
import { KeyAdminUnlockUntil } from "../../constants";

function SettingsScreen() {
    const navigate = useNavigate()
    const lockAdmin = () => {
        localStorage.setItem(KeyAdminUnlockUntil, '0')
        navigate('/')
    }
    return <div className='py-8 container'>
        <div className="mb-8">
            <BackButton
                href="/"
            />
        </div>
        <Link className='flex items-center hover:bg-slate-100 p-2 border-b-2' to='steri'>
            <p className='text-sm flex-1'>
                Manage Sterilizers
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>
        <Link className='flex items-center hover:bg-slate-100 p-2 border-b-2' to='steri-items'>
            <p className='text-sm flex-1'>
                Manage Steri Items & Counts
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>
        <Link className='flex items-center hover:bg-slate-100 p-2 border-b-2' to='users'>
            <p className='text-sm flex-1'>
                Manage Users
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>
        <Link className='flex items-center hover:bg-slate-100 p-2 border-b-2' to='labels'>
            <p className='text-sm flex-1'>
                Label History
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>
        <Link className='flex items-center hover:bg-slate-100 p-2 border-b-2' to='tasks'>
            <p className='text-sm flex-1'>
                Task Templates
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>
        <Button className="w-full my-2" onClick={lockAdmin}>Lock Admin Settings</Button>
        <div className='flex p-2 justify-between mt-16'>
            <p>Built with ❤️ <strong>ARORA</strong>DENTAL &copy; {new Date().getFullYear()}</p>
            <p>v{packageJson.version}</p>
        </div>
    </div>
}

export default SettingsScreen;
