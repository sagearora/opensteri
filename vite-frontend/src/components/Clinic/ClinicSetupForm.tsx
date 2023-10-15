import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button } from '../ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Clinic_Connector, Clinic_Set_Input } from '../../__generated__/graphql';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2 } from 'lucide-react';

const Connectors = [{
    name: 'Curve Dental',
    value: Clinic_Connector.CurveDental
}]

const schema = yup.object({
    name: yup.string().required('Please provide a name for the clinic'),
    admin_password: yup.string().min(6, 'Password must be longer than 6 characters')
        .required('Please create a password for the admin'),
    confirm_password: yup.string()
        .oneOf([yup.ref('admin_password')], 'Passwords must match')
        .required('Please re-enter the admin password'),
    connector: yup.string()
        .oneOf(Connectors.map(o => o.value), 'Please select your practice management software')
        .required('Please select your practice management software')
}).required();

export type ClinicSetupFormSchema = yup.InferType<typeof schema>

function ClinicSetupForm({
    submit,
    loading,
}: {
    submit: (data: Clinic_Set_Input) => void
    loading?: boolean
}) {
    const form = useForm<ClinicSetupFormSchema>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            admin_password: '',
            confirm_password: '',
        }
    })

    const onSubmit: SubmitHandler<ClinicSetupFormSchema> = (data) => submit({
        name: data.name,
        admin_password: data.admin_password,
        connector: data.connector,
    })

    return (
        <div className='py-16 flex flex-col justify-center items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className='w-16 h-16 mb-2' strokeWidth={1} stroke="currentColor" fill="none">
                <path d="M19.883.178A.5.5 0 0019.501 0h-.51C13.951-.002 9.97-.003 7.039.698c-1.575.377-2.793.946-3.723 1.739-1.004.856-1.688 1.977-2.093 3.429-.269.964-.395 2.705.136 4.437.196.64.502 1.244.91 1.799C1.053 14.007.002 16.516.002 19.501a.5.5 0 001 0c0-4.605 2.728-8.021 4.354-9.646 1.167-1.167 2.486-2.152 3.816-2.848 1.238-.648 2.421-1.005 3.331-1.005a.5.5 0 000-1c-1.084 0-2.396.387-3.794 1.12-1.418.743-2.822 1.789-4.059 3.027a17.933 17.933 0 00-1.774 2.07 4.947 4.947 0 01-.559-1.207c-.5-1.632-.316-3.204-.129-3.875C3.618 1.012 9.05.999 18.905 1.002 17.73 7.29 15.539 11.36 12.389 13.103c-2.922 1.617-5.82.735-6.931.28a5.366 5.366 0 01-.699-.35.5.5 0 00-.511.859c.272.162.552.302.832.417a9.917 9.917 0 003.679.722 8.392 8.392 0 004.115-1.053c1.609-.89 3.001-2.339 4.139-4.304 1.334-2.305 2.338-5.362 2.983-9.086a.5.5 0 00-.11-.407z"></path>
            </svg>
            <h1 className='text-4xl font-bold mb-2'>Welcome to OpenSteri</h1>
            <p className='text-gray-700 mb-6'>Instrument Sterilization Tracker For Health Clinics.</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => {
                            return (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Clinic Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Name of your clinic. e.g. Arora Dental
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            );
                        }} />
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
                                    <FormDescription>
                                        This will be used to access sensitive settings for your clinic. Must be 6 characters in length.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            );
                        }} />
                    <FormField
                        control={form.control}
                        name='confirm_password'
                        render={({ field }) => {
                            return (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" type='password' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }} />
                    <FormField
                        control={form.control}
                        name="connector"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Patient Management Software</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select One" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Connectors.map(opt =>
                                            <SelectItem key={opt.value} value={opt.value}>{opt.name}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        disabled={loading}
                        className='w-full'
                        size='lg'
                        type='submit'>
                        {loading && <Loader2 className='w-4 h-4 animate-spin' />}
                        Get Started
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default ClinicSetupForm