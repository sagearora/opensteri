import { Link } from "react-router-dom";
import BackButton from "../../../components/BackButton";
import { useListSterilizersQuery } from "../../../__generated__/graphql";
import { Loader2 } from "lucide-react";


function SteriListScreen() {
    const { loading, data } = useListSterilizersQuery()

    const steris = data?.steri || [];

    return <div className='py-6 container'>
        <div className='flex items-center mb-4'>
            <BackButton href='/settings' />
            <p className='ml-2 font-bold text-gray-500'>Sterilizers</p>
            <div className='flex-1' />
            <Link
                to='create'
            >+ Add Sterilizer</Link>
        </div>
        {loading && <Loader2 />}
        {steris.map(steri => <Link
            className="flex items-center border-b-2 p-2 hover:bg-slate-200"
            to={`${steri.id}/edit`}
            key={steri.id}
        >
            <p className={`flex-1 ${!steri.is_active ? 'line-through text-gray-700' : ''}`}>{steri.name} - {steri.serial}</p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </Link>)}
        {!loading && steris.length === 0 && <p className='text-center text-gray-500'>No sterilizers found.</p>}

    </div>
}

export default SteriListScreen;
