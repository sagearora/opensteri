
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useListUsersQuery } from "../../../__generated__/graphql";
import BackButton from "../../../components/BackButton";
import { Badge } from "../../../components/ui/badge";

function UserListScreen() {
    const {
        loading,
        data,
    } = useListUsersQuery()

    const users = data?.user || []

    return <div className='my-6 mx-auto container'>
        <div className='flex items-center mb-4'>
            <BackButton href='/settings' />
            <p className='ml-2 font-bold text-gray-500'>Users</p>
            <div className='flex-1' />
            <Link
                to='create'>
                + Create User
            </Link>
        </div>
        {loading && <Loader2 />}
        {users.map(user => <Link
            className="flex items-center border-b-2 p-2 hover:bg-slate-50 space-x-2"
            to={`${user.id}/edit`}
            key={user.id}
        >
            <div className="flex-1">
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-md">{user.is_admin && <Badge>Admin</Badge>} {user.is_spore_tester ? <Badge>Spore Tester</Badge> : ''}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>)}
        {!loading && users.length === 0 && <p className='text-center text-gray-500'>No users found</p>}

    </div>
}

export default UserListScreen;
