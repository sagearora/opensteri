import { Loader2 } from 'lucide-react';
import { Steri_Cycle_Set_Input, usePollPendingSporeTestsQuery, useUpdateSteriCycleMutation } from '../../__generated__/graphql';
import { useUser } from '../../lib/UserProvider';
import { createErrorToast } from '../../lib/createErrorToast';
import SporeTestItem from './SporeTestItem';

function SporeTestWidget() {
  const { user } = useUser();
  const {
    data,
    loading,
  } = usePollPendingSporeTestsQuery({
    pollInterval: 5000,
  })

  const [executeMutation] = useUpdateSteriCycleMutation()
  const items = data?.pending_spore_test || []

  const updateCycle = async (cycle_id: number, v: Steri_Cycle_Set_Input) => {
    try {
      await executeMutation({
        variables: {
          id: cycle_id,
          set: v,
        }
      });
      return true;
    } catch (e) {
      createErrorToast(e)
      return false
    }
  }

  if (items.length === 0) {
    return <div>No spore tests</div>;
  }

  return (
    <div className='p-2 bg-gray-50 rounded-md'>
      <p className='text-md font-semibold text-center mb-2'>Pending Spore Tests</p>
      {loading && <Loader2 className='animate-spin mx-auto' size={32} />}
      {items.map(cycle => <SporeTestItem
        user={user}
        key={cycle.id}
        updateCycle={updateCycle}
        cycle={cycle} />)}
    </div>
  )
}

export default SporeTestWidget