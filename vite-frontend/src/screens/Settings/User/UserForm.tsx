import { yupResolver } from '@hookform/resolvers/yup'
import { Loader2 } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from "yup"
import { UserFragment } from '../../../__generated__/graphql'
import { Button } from '../../../components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form'
import { Input } from '../../../components/ui/input'
import { Switch } from '../../../components/ui/switch'
import { generateRandomPin } from '../../../lib/generateRandomPin'

const schema = yup.object({
    name: yup.string().required('Please enter a name'),
    pin: yup.number()
        .min(1000, 'PIN must not start with 0')
        .max(9999, 'Must be a 4 digit number')
        .required('Please enter a 4 digit number'),
    is_active: yup.boolean().required(),
    is_spore_tester: yup.boolean().required(),
}).required();

export type UserFormSchema = yup.InferType<typeof schema>

function UserForm({
    user,
    loading,
    onSave,
}: {
    user?: UserFragment;
    loading?: boolean
    onSave: (v: UserFormSchema) => Promise<void>;
}) {
    const form = useForm<UserFormSchema>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: user?.name || '',
            pin: user?.pin || generateRandomPin(),
            is_spore_tester: user?.is_spore_tester || false,
            is_active: user ? user.is_active : true,
        }
    })

    const onSubmit: SubmitHandler<UserFormSchema> = onSave

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => {
                        return (
                            <FormItem className="flex flex-col">
                                <FormLabel>Full name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Ron Weasley" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }} />
                <FormField
                    control={form.control}
                    name='pin'
                    render={({ field }) => {
                        return (
                            <FormItem className="flex flex-col">
                                <FormLabel>Pin # (Must be 4 digits)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 1111" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }} />

                <FormField
                    control={form.control}
                    name="is_spore_tester"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Spore Test Recorder
                                </FormLabel>
                                <FormDescription>
                                    Can this user record spore test results?
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

                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    User is active
                                </FormLabel>
                                <FormDescription>
                                    Slide to activate or deactivate the user.
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
                    {user ? 'Save Changes' : 'Create User'}
                </Button>
            </form>
        </Form>
    )
}

export default UserForm