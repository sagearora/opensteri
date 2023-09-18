import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup"
import { SteriFragment } from '../../../__generated__/graphql';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from '../../../components/ui/input';
import { Switch } from '../../../components/ui/switch';
import { Button } from '../../../components/ui/button';
import { Loader2 } from 'lucide-react';

const schema = yup.object({
    name: yup.string().required('Please enter a name'),
    serial: yup.string().required('Please enter a serial number'),
    is_active: yup.boolean().required(),
}).required();

export type SteriFormSchema = yup.InferType<typeof schema>

function SteriForm({
    steri,
    loading,
    onSave,
}: {
    steri?: SteriFragment;
    onSave: (v: SteriFormSchema) => Promise<void>
    loading?: boolean
}) {
    const form = useForm<SteriFormSchema>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: steri?.name || '',
            serial: steri?.serial || '',
            is_active: steri ? steri.is_active : true,
        }
    })

    const onSubmit: SubmitHandler<SteriFormSchema> = onSave

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => {
                        return (
                            <FormItem className="flex flex-col">
                                <FormLabel>Steri name (e.g. Top Sterilizer or Lexa 1)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Sterilizer 1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }} />
                <FormField
                    control={form.control}
                    name='serial'
                    render={({ field }) => {
                        return (
                            <FormItem className="flex flex-col">
                                <FormLabel>Serial #</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. S/N 12345678" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }} />

                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Sterilizer is active
                                </FormLabel>
                                <FormDescription>
                                    Slide to activate or deactivate the sterilizer.
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
                    {steri ? 'Save Changes' : 'Create Sterilizer'}
                </Button>
            </form>
        </Form>
    )
}

export default SteriForm
