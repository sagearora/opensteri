import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from "yup";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { toast } from '../../components/ui/use-toast';
import { useUser } from '../../lib/UserProvider';
import { createErrorToast } from '../../lib/createErrorToast';
import { Steri_Label_Event_Type, useInsertSteriLabelEventMutation } from '../../__generated__/graphql';
import { SteriItemPicker } from './SteriItemPicker';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Loader2 } from 'lucide-react';

const schema = yup.object({
    steri_label_id: yup.string().required('Please enter a label ID'),
    steri_item_id: yup.number().required('Please select the new steri item'),
}).required();

type ReprintFields = yup.InferType<typeof schema>

function ChangeLabel() {
    const { user } = useUser()
    const [insert, { loading: inserting }] = useInsertSteriLabelEventMutation()
    const form = useForm<ReprintFields>({
        resolver: yupResolver(schema),
        defaultValues: {
            steri_label_id: '',
            steri_item_id: undefined,
        }
    });

    const onSubmit: SubmitHandler<ReprintFields> = async (values) => {
        try {
            const { data } = await insert({
                variables: {
                    objects: [{
                        type: Steri_Label_Event_Type.UpdateSteriItemId,
                        steri_label_id: +values.steri_label_id,
                        user_id: user.id,
                        data: JSON.stringify({
                            steri_item_id: +values.steri_item_id,
                        }),
                        force_reprint: true,
                    }],
                }
            })
            const label = (data?.insert_steri_label_event?.returning || [])[0]
            if (!label || label.steri_item.id !== +values.steri_item_id) {
                toast({
                    title: 'Failed to update',
                    description: 'Sorry could not change the label item. Contact admin for support',
                    variant: 'destructive',
                })
                return;
            }
            toast({
                title: 'Label item changed. Check printer'
            })
            form.reset()
        } catch (e) {
            createErrorToast(e)
        }
    }

    return (
        <div className='py-6 border-b-2'>
            <p className='font-bold text-lg'>Change label</p>
            <p className='mb-2'>Use this tool if you need to change the label item. This should be used infrequently</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name='steri_label_id'
                        render={({ field }) => {
                            return (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Steri Item Id</FormLabel>
                                    <FormControl>
                                        <Input type='number' placeholder="e.g. 1234"  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }} />

                    <FormField
                        control={form.control}
                        name='steri_item_id'
                        render={field => <SteriItemPicker {...field} />}
                    />

                    <Button
                        disabled={inserting}
                        variant='outline'
                        type='submit'>
                        {inserting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                        </svg>
                        Change Label & Re-Print
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default ChangeLabel