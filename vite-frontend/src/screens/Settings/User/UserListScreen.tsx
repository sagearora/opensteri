
import { Link } from "react-router-dom";
import BackButton from "../../../components/BackButton";
import { Button } from "../../../components/ui/button";
import { useClinic } from "../../../lib/useClinic";
import { cn } from "../../../lib/utils";

function UserListScreen() {
    const { clinic } = useClinic()

    const users = clinic.user || []

    return <div className='my-6 mx-auto container'>
        <div className='flex items-center mb-4'>
            <BackButton href='/settings' />
            <p className='ml-2 font-bold text-gray-500'>Users</p>
            <div className='flex-1' />
            <Link
                to='create'>
                <Button variant='outline'>
                    + Create User
                </Button>
            </Link>
        </div>
        {users.map(user => <Link
            className={cn(
                "flex items-center border-b-2 p-2 hover:bg-slate-50 space-x-2",
                !user.is_active && 'text-gray-700 line-through')}
            to={`${user.id}/edit`}
            key={user.id}
        >
            <div className="flex-1">
                <p className="text-base">{user.name} {user.is_spore_tester ? <span> &middot; Spore Tester</span> : null}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>)}
    </div>
}

export default UserListScreen;
