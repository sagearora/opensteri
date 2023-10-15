import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { createErrorToast } from '../../lib/createErrorToast';
import extractSubdomain from './extractSubdomain';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

// Define the regex pattern
const domainPattern = /^https?:\/\/([\w-]+)\.curvehero\.com$/;

// Define the yup schema
const domainSchema = yup.string().matches(
    domainPattern,
    'Invalid domain. e.g. http://my-practice.curvehero.com'
).test(
    'extract-subdomain',
    'Subdomain extraction failed.',
    (value: string | null | undefined) => {
        const match = value?.match(domainPattern);
        return !!(match && match[1]);
    }
);

const schema = yup.object({
    base_url: domainSchema.required('Please enter your CurveHero Url'),
}).required();

export type SetupFormSchema = yup.InferType<typeof schema>

function CurveSetupForm({
    submit,
}: {
    submit: (base_url: string) => void
}) {
    const form = useForm<SetupFormSchema>({
        resolver: yupResolver(schema),
        defaultValues: {
            base_url: '',
        }
    })

    const onSubmit: SubmitHandler<SetupFormSchema> = (data) => {
        const subdomain = extractSubdomain(data.base_url);
        if (!subdomain) {
            createErrorToast('Invalid subdomain.')
            return;
        }
        submit(subdomain)
    }

    return (
        <div className='py-8 flex flex-col justify-center items-center'>
            <h1 className='text-4xl font-bold mb-8'>Welcome to CurveMax</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-w-lg">
                    <FormField
                        control={form.control}
                        name='base_url'
                        render={({ field }) => {
                            return (
                                <FormItem className="flex flex-col">
                                    <FormLabel>CurveHero Url</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Your CurveHero Url. For example, https://my-practice.curvehero.com.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            );
                        }} />
                    <Button
                        className='w-full'
                        type='submit'>
                        Get Started
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default CurveSetupForm