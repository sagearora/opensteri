import { useNavigate, useParams } from 'react-router';
import { useGetSteriCycleQuery, useUpdateSteriCycleMutation } from '../../__generated__/graphql';
import BackButton from '../../components/BackButton';
import { createErrorToast } from '../../lib/createErrorToast';
import LoadingScreen from '../LoadingScreen';
import SteriCycleForm, { SteriCycleFormSchema } from './SteriCycleForm';

function SteriCycleEditScreen() {
    const cycle_id = +(useParams().cycle_id as string);
    const navigate = useNavigate();
    const {
        data,
        loading,
    } = useGetSteriCycleQuery({
        variables: {
            id: cycle_id,
        } 
    })

    const [executeMutation, status] = useUpdateSteriCycleMutation();


    if (loading) {
        return <LoadingScreen />
    }

    const cycle = data?.steri_cycle_by_pk

    if (!cycle) {
        return <p>Sorry cycle not found.</p>
    }

    const onSave = async (set: SteriCycleFormSchema) => {
        try {
            await executeMutation({
                variables: {
                    id: cycle.id,
                    set: {
                        steri_id: Number(set.steri_id.id),
                        cycle_number: Number(set.cycle_number),
                        is_spore_test_enabled: set.is_spore_test_enabled,
                    },
                }
            });
            navigate(`/cycles/${cycle.id}`)
        } catch (e) {
            createErrorToast(e)
        }
    }

    return (
        <div className='my-6 mx-auto container'>
            <BackButton href={`/cycles/${cycle.id}`} />
            <div className='mt-2 flex items-center mb-4'>
                <div className='flex-1'>
                    <p className='text-gray-500'>Edit Cycle</p>
                    <p className='font-bold'>{cycle.id} - {cycle.steri?.name}</p>
                </div>
            </div>
            <SteriCycleForm
                cycle={cycle}
                loading={status.loading}
                onSave={onSave}
            />
        </div >
    )
}

export default SteriCycleEditScreen