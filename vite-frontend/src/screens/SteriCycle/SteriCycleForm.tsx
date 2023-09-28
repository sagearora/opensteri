
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from "yup";
import { SteriCycleFragment } from '../../__generated__/graphql';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { SteriPicker } from './SteriPicker';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Loader2 } from 'lucide-react';

const schema = yup.object({
    cycle_number: yup.number().required('Please enter the steri cycle number'),
    steri_id: yup.object().shape({
        id: yup.number(),
        name: yup.string(),
    }).required('Please select a sterilizer'),
    is_spore_test_enabled: yup.boolean().required()
}).required();


export type SteriCycleFormSchema = yup.InferType<typeof schema>;

function SteriCycleForm({
    cycle,
    loading,
    onSave,
}: {
    cycle?: SteriCycleFragment;
    loading?: boolean;
    onSave: (d: SteriCycleFormSchema) => Promise<void>;
}) {
    const form = useForm<SteriCycleFormSchema>({
        resolver: yupResolver(schema),
        defaultValues: {
            cycle_number: cycle?.cycle_number || undefined,
            steri_id: cycle? {
                id: cycle.steri_id,
                name: cycle.steri.name,
            } : undefined,
            is_spore_test_enabled: cycle ? cycle.is_spore_test_enabled : false,
        }
    });

    const onSubmit: SubmitHandler<SteriCycleFormSchema> = onSave

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name='steri_id'
                    render={field => <SteriPicker {...field} />} />

                <FormField
                    control={form.control}
                    name='cycle_number'
                    render={({ field }) => {
                        return (
                            <FormItem className="flex flex-col">
                                <FormLabel>Cycle Number #</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 1101" type='number' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }} />
                <FormField
                    control={form.control}
                    name="is_spore_test_enabled"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Cycle has a spore test
                                </FormLabel>
                                <FormDescription>
                                    This should be enabled for the first cycle of the day!
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button
                    disabled={loading}
                    type='submit'>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {cycle ? 'Save Changes' : 'Create Cycle'}
                </Button>
            </form>
        </Form>
    )
}

export default SteriCycleForm