import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { SporeTestSteriCycleFragment, Spore_Test_Status, Steri_Cycle_Set_Input, UserFragment } from '../../__generated__/graphql';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { toast } from '../../components/ui/use-toast';
import { cn } from '../../lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';

const Spore_Test_Wait_Time_Minutes = 60 * 60 * 24;

function SporeTestItem({
    cycle,
    user,
    updateCycle,
}: {
    cycle: SporeTestSteriCycleFragment
    user: UserFragment;
    updateCycle: (cycle_id: number, v: Steri_Cycle_Set_Input) => Promise<boolean>
}) {
    const is_past_24_hours = useMemo(
        () => dayjs().diff(dayjs(cycle.start_at), 'minute') >= Spore_Test_Wait_Time_Minutes,
        [cycle.start_at]
    )
    const [did_spore_grow_sterilized, setDidSporeGrowSterilized] = useState(false);
    const [did_spore_grow_control, setDidSporeGrowControl] = useState(false);
    const [show_failed_dialog, setShowFailedDialog] = useState(false);

    const setResult = async () => {
        const result = !!did_spore_grow_control && !did_spore_grow_sterilized;
        if (!result) {
            setShowFailedDialog(true)
        } else {
            update(Spore_Test_Status.Passed)
        }
    }

    const recordFailure = async () => {
        await update(Spore_Test_Status.Failed)
        setShowFailedDialog(false)
    }

    const update = async (result: Spore_Test_Status) => {
        if (await updateCycle(cycle.id, {
            spore_test_user_id: user.id,
            spore_test_recorded_at: new Date().toISOString(),
            spore_test_result: result,
        })) {
            toast({
                title: `Succesfully recorded spore test result.`,
            })
        }
    }


    return (
        <div className={cn(
            'p-4',
            !is_past_24_hours ? 'opacity-30' : 'opacity-100',
        )}>
            <p className='text-lg font-bold'>#{cycle.cycle_number} ({cycle.steri?.name})</p>
            <p className='text-sm'>{cycle.start_at ? `${dayjs(cycle.start_at).format('MM/DD/YYYY HH:mm')}` : 'Not started'}</p>
            <p className='text-md font-bold'>Record Results {cycle.spore_test_recorded_at}</p>
            <div className='my-1 py-1 flex items-center space-x-2'>
                <div className='flex-1'>
                    <p className='text-md'>Did Spore Grow In the Sterilized Vial?</p>
                </div>
                <Switch
                    checked={did_spore_grow_sterilized}
                    onCheckedChange={setDidSporeGrowSterilized}
                    className={`${did_spore_grow_sterilized ? 'bg-orange-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                    <span className="sr-only">Spore Growth</span>
                    <span
                        className={`${did_spore_grow_sterilized ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white`}
                    />
                </Switch>
            </div>
            <div className='my-1 py-1 flex items-center space-x-2'>
                <div className='flex-1'>
                    <p className='text-md'>Did Spore Grow In the Control Vial?</p>
                </div>
                <Switch
                    checked={did_spore_grow_control}
                    onCheckedChange={setDidSporeGrowControl}
                    className={`${did_spore_grow_control ? 'bg-orange-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                    <span className="sr-only">Control Growth</span>
                    <span
                        className={`${did_spore_grow_control ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white`}
                    />
                </Switch>
            </div>
            <AlertDialog open={show_failed_dialog} onOpenChange={() => setShowFailedDialog(false)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Failed Spore Test?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to mark this as a failed spore test. Please confirm to continue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction  onClick={recordFailure}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Button
                className='w-full'
                disabled={!is_past_24_hours}
                onClick={() => setResult()}>Record Result</Button>
        </div>
    )
}

export default SporeTestItem