import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button } from '../../components/ui/button';

const schema = yup.object({
    admin_password: yup.string()
        .required('Please enter the admin password.'),
}).required();

export type AdminPasswordFormSchema = yup.InferType<typeof schema>

function AdminPasswordForm({
    submit,
}: {
    submit: (password: string) => boolean
}) {
    const form = useForm<AdminPasswordFormSchema>({
        resolver: yupResolver(schema),
        defaultValues: {
            admin_password: '',
        }
    })

    const onSubmit: SubmitHandler<AdminPasswordFormSchema> = (data) => {
        if (!submit(data.admin_password)) {
            form.setError('admin_password', { message: 'Invalid password.' })
        }
        // form.reset()
    }

    return (
        <div className='py-16 flex flex-col justify-center items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <h1 className='text-4xl font-bold mb-2'>Locked</h1>
            <p className='text-gray-700 mb-6'>Please enter the admin password to unlock settings.</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg w-full">
                    <FormField
                        control={form.control}
                        name='admin_password'
                        render={({ field }) => {
                            return (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Admin Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" type='password'  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }} />
                    <Button
                        className='w-full'
                        size='lg'
                        type='submit'>
                        Unlock
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default AdminPasswordForm