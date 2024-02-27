import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const schema = yup.object({
    is_cycle_failed: yup.boolean(),
    temp: yup.number().required('Please provide exposure temp'),
    duration: yup.string().required('Please provide exposure time'),
    pressure: yup.number().required('Please provide exposure pressure'),
    notes: yup.string(),
}).required();

export type FinishCycleSchema = yup.InferType<typeof schema>

function FinishCycle({
    loading,
    onSave,
}: {
    onSave: (v: FinishCycleSchema) => Promise<void>
    loading?: boolean
}) {
    const form = useForm<FinishCycleSchema>({
        resolver: yupResolver(schema),
        defaultValues: {
            is_cycle_failed: false,
            temp: undefined,
            duration: '',
            pressure: undefined,
            notes: '',
        }
    })

    const onSubmit: SubmitHandler<FinishCycleSchema> = onSave

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className='max-w-md space-y-4 mx-auto'>
                    <FormField
                        control={form.control}
                        name='is_cycle_failed'
                        render={({ field }) => {
                            return (
                                <FormItem className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Did the cycle fail?
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }} />
                    <FormField
                        control={form.control}
                        name='temp'
                        render={({ field }) => {
                            return (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Exposure Temperature (°F)</FormLabel>
                                    <FormControl>
                                        <Input type='number' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }} />
                    <FormField
                        control={form.control}
                        name='duration'
                        render={({ field }) => {
                            return (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Exposure Time (mm:ss)</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }} />
                    <FormField
                        control={form.control}
                        name='pressure'
                        render={({ field }) => {
                            return (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Exposure pressure (psi)</FormLabel>
                                    <FormControl>
                                        <Input type='number' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }} />

                    <FormField
                        control={form.control}
                        name='notes'
                        render={({ field }) => {
                            return (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }} />
                </div>

                <Button
                    className='w-full'
                    size='lg'
                    type='submit'>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Finish Cycle
                </Button>
            </form>
        </Form>
    )
}

export default FinishCycle
