import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Steri_Cycle_Set_Input, Steri_Cycle_Status, UserFragment } from '../../__generated__/graphql';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';

export type SteriControllerProps = {
    status: Steri_Cycle_Status;
    user: UserFragment;
    finish_at?: string|null;
    loading?: boolean;
    updateCycle: (v: Steri_Cycle_Set_Input) => void
}

function SteriController({
    status,
    user,
    finish_at,
    updateCycle,
    loading,
}: SteriControllerProps) {
    const [is_cycle_failed, setIsCycleFailed] = useState(false);
    const [notes, setNotes] = useState('');

    const start = async () => {
        return updateCycle({
            start_at: new Date().toISOString(),
            start_user_id: user.id,
            status: Steri_Cycle_Status.Running,
        });
    }

    const finish = async () => {
        return updateCycle({
            finish_at: new Date().toISOString(),
            finish_user_id: user.id,
            status: is_cycle_failed ? Steri_Cycle_Status.Failed : Steri_Cycle_Status.Finished,
            notes,
        });
    }

    const undoFinish = async () => {
        return updateCycle({
            finish_at: null,
            finish_user_id: null,
            status: Steri_Cycle_Status.Running
        });
    }

    if (status === Steri_Cycle_Status.Loading) {
        return <div className='bg-slate-100 p-4 rounded-md shadow-lg mb-8'>
            <Button className='w-full'
                size='lg' disabled={loading} onClick={() => start()}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Start Cycle</Button>
        </div>
    }

    if (status === Steri_Cycle_Status.Running) {
        return <div className='bg-slate-100 p-4 rounded-md shadow-lg my-8'>
            <p className='text-lg font-bold mb-2'>Finish Cycle</p>
            <div className='my-2 py-2 flex items-center'>
                <div className='flex-1'>
                    <p className='text-md font-bold'>Did the cycle fail?</p>
                </div>
                <Switch
                    checked={is_cycle_failed}
                    onCheckedChange={(checked) => setIsCycleFailed(checked)}
                    className={`${is_cycle_failed ? 'bg-orange-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                    <span className="sr-only">Spore Growth</span>
                    <span
                        className={`${is_cycle_failed ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white`}
                    />
                </Switch>
            </div>
            <textarea
                placeholder='(Optional) Type any notes here like cycle failures or other issues...'
                value={notes}
                rows={4}
                onChange={v => setNotes(v.target.value)}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
            <Button className='w-full'
                size='lg' color='primary'
                disabled={loading} onClick={() => finish()}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Finish Cycle</Button>
        </div>
    }

    return <div className='my-8'>
        <p className={`text-lg font-bold ${status === Steri_Cycle_Status.Failed ? 'bg-red-500' : 'bg-green-600'} text-white px-2 w-fit rounded-lg mb-1`}>{
            status === Steri_Cycle_Status.Finished ? 'Passed' : 'Failed'} {dayjs(finish_at).format('YYYY-MM-DD HH:mm')}</p>
        {+new Date() - +new Date(finish_at || '') < 24 * 60 * 60 * 1000 ? <div>
            <p className='text-sm text-red-500 mb-2'>Made an error in recording your results?
                Change results up to 24 hours after finishing the cycle.</p>
            <Button
                onClick={undoFinish}
            >Change Results</Button>
        </div> : null}
    </div>
}

export default SteriController