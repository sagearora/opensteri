import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2, X } from 'lucide-react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { User_Insert_Input } from '../../__generated__/graphql';
import { Button } from '../ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { toast } from '../ui/use-toast';
import { generateRandomPin } from '../../lib/generateRandomPin';

const schema = yup.object({
    users: yup.array().of(yup.object({
        name: yup.string().required('Please enter a name'),
        pin: yup.number()
            .min(1000, 'Pin cannot start with a 0')
            .max(9999, 'Must be a 4 digit number')
            .required('Please enter a 4 digit number'),
        is_spore_tester: yup.boolean().required(),
        is_active: yup.boolean().required(),
    }))
        .min(1, 'Please add at least one team member')
        .required('Users are required')
}).required();

export type UserSetupFormSchema = yup.InferType<typeof schema>

function UserSetupForm({
    submit,
    loading,
}: {
    submit: (data: User_Insert_Input[]) => void
    loading?: boolean
}) {
    const form = useForm<UserSetupFormSchema>({
        resolver: yupResolver(schema),
        defaultValues: {
            users: [{
                name: '',
                pin: generateRandomPin(),
                is_spore_tester: true,
                is_active: true,
            }]
        }
    })
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "users"
    });
    const onSubmit: SubmitHandler<UserSetupFormSchema> = (data) => submit(data.users)

    const add = () => {
        append({
            name: '',
            pin: generateRandomPin(),
            is_spore_tester: true,
            is_active: true,
        })
    }

    const _remove = (index: number) => {
        if (fields.length === 1) {
            toast({
                title: 'At least one team member is required.',
                variant: 'destructive'
            })
            return
        }
        remove(index)
    }

    return (
        <div className='py-16 flex flex-col justify-center items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>

            <h1 className='text-4xl font-bold mb-2'>Team Setup</h1>
            <p className='text-gray-700 mb-6'>Add all team members to OpenSteri.</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg w-full">

                    {fields.map((_, index) => (
                        <div className='space-y-2 w-full bg-slate-50 rounded-md border relative shadow-md my-2 p-4'>
                            <Button
                                type='button' variant='ghost' onClick={() => _remove(index)} size='icon' className='absolute right-0 top-0'>
                                <X className='w-4 h-4 text-red-500' />
                            </Button>
                            <div className='grid grid-cols-2 gap-2'>
                                <FormField
                                    control={form.control}
                                    name={`users.${index}.name`}
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
                                    name={`users.${index}.pin`}
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="flex flex-col" >
                                                <FormLabel>Pin # (Must be 4 digits)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. 1111" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }} />
                            </div>
                            <FormField
                                control={form.control}
                                name={`users.${index}.is_spore_tester`}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between">
                                        <div className="space-y-0.5">
                                            <FormLabel>
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
                        </div>
                    ))}
                    <Button type='button' className='w-full'
                        onClick={add} variant='outline'>+ Add Team Member</Button>
                    <Button
                        disabled={loading}
                        className='w-full'
                        size='lg'
                        type='submit'>
                        {loading && <Loader2 className='w-4 h-4 animate-spin' />}
                        Next
                    </Button>
                </form>
            </Form>
        </div >
    )
}

export default UserSetupForm