import { useNavigate } from 'react-router';
import { ListSteriCyclesDocument, useCreateSteriCycleMutation } from '../../__generated__/graphql';
import BackButton from '../../components/BackButton';
import { LargeInt, PageLimit } from '../../constants';
import { createErrorToast } from '../../lib/createErrorToast';
import SteriCycleForm, { SteriCycleFormSchema } from './SteriCycleForm';


function SteriCycleStartScreen() {
    const navigate = useNavigate();
    const [executeMutation, status] = useCreateSteriCycleMutation({
        refetchQueries: [{
            query: ListSteriCyclesDocument,
            variables: {
                cursor: LargeInt,
                limit: PageLimit,
            }
        }]
    });

    const onSave = async (cycle: SteriCycleFormSchema) => {
        try {
            const r = await executeMutation({
                variables: {
                    object: {
                        steri_id: Number(cycle.steri_id.id),
                        cycle_number: Number(cycle.cycle_number),
                        is_spore_test_enabled: cycle.is_spore_test_enabled,
                    },
                }
            });
            if (r.data?.insert_steri_cycle_one?.id) {
                navigate(`/cycles/${r.data.insert_steri_cycle_one.id}`)
            }
        } catch (e) {
            createErrorToast(e)
        }
    }

    return (
        <div className='my-6 mx-auto container'>
            <div className='flex items-center mb-4'>
                <BackButton href='/cycles' />
                <p className='ml-2 font-bold text-gray-500'>Start a Cycle</p>
                <div className='flex-1' />
            </div>
            <SteriCycleForm
                loading={status.loading}
                onSave={onSave}
            />
        </div >
    )
}

export default SteriCycleStartScreen