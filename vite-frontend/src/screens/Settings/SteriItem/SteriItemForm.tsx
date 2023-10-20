import { yupResolver } from '@hookform/resolvers/yup'
import { Loader2 } from 'lucide-react'
import { SubmitHandler, useForm, useWatch } from 'react-hook-form'
import * as yup from "yup"
import { SteriItemFragment } from '../../../__generated__/graphql'
import { Button } from '../../../components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form'
import { Input } from '../../../components/ui/input'
import { Switch } from '../../../components/ui/switch'
import { SteriItemCategoryPicker } from './SteriItemCategoryPicker'

const schema = yup.object({
    name: yup.string().required('Please enter a name'),
    category: yup.string().required('Please enter a category (e.g. Exo, Restorative, etc.)'),
    is_active: yup.boolean().required(),
    is_count_enabled: yup.boolean().required(),
    total_count: yup.number().min(0),
}).required();

export type SteriItemFormSchema = yup.InferType<typeof schema>

function SteriItemForm({
    steri_item,
    loading,
    onSave,
}: {
    steri_item?: SteriItemFragment;
    loading?: boolean
    onSave: (v: SteriItemFormSchema) => Promise<void>;
}) {
    const form = useForm<SteriItemFormSchema>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: steri_item?.name || '',
            category: steri_item?.category || '',
            is_active: steri_item ? steri_item.is_active : true,
            is_count_enabled: steri_item ? steri_item.is_count_enabled : true,
            total_count: steri_item?.total_count || 0,
        }
    })

    const is_count_enabled = useWatch({
        control: form.control,
        name: 'is_count_enabled',
    })

    const onSubmit: SubmitHandler<SteriItemFormSchema> = onSave

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => {
                        return (
                            <FormItem className="flex flex-col">
                                <FormLabel>Steri Item Name (e.g. Elevator or Restorative Kit)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Resto Kit" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }} />
                <FormField
                    control={form.control}
                    name='category'
                    render={field => <SteriItemCategoryPicker {...field} />} />

                <FormField
                    control={form.control}
                    name="is_count_enabled"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Enable count
                                </FormLabel>
                                <FormDescription>
                                    Slide to activate or deactivate counts for this item.
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

                {is_count_enabled && <FormField
                    control={form.control}
                    name='total_count'
                    render={({ field }) => {
                        return (
                            <FormItem className="flex flex-col">
                                <FormLabel>Total count</FormLabel>
                                <FormControl>
                                    <Input type='number' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }} />}
                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Item is active
                                </FormLabel>
                                <FormDescription>
                                    Slide to activate or deactivate the item.
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
                    {steri_item ? 'Save Changes' : 'Create Item'}
                </Button>
            </form>
        </Form>
    )
}

export default SteriItemForm