import dayjs from 'dayjs';
import { Loader2 } from "lucide-react";
import { useMemo, useState } from 'react';
import { DotLoader } from 'react-spinners';
import { PrinterSteriItemFragment, useCreateLabelsMutation, useListPrinterSteriItemsQuery } from '../../__generated__/graphql';
import { Button } from '../../components/ui/button';
import { toast } from "../../components/ui/use-toast";
import { DefaultExpiryMonths } from "../../constants";
import { useUser } from '../../lib/UserProvider';

function PrinterScreen() {
    const { user } = useUser()
    const {
        data,
        loading,
    } = useListPrinterSteriItemsQuery()
    const [insertLabels, { loading: inserting }] = useCreateLabelsMutation()
    const [to_print, setToPrint] = useState<{ [id: number]: number }>({})
    const [selected_category, setSelectedCategory] = useState<{
        name: string;
        items: PrinterSteriItemFragment[]
    }>();
    const items = useMemo(() => (data?.steri_item || []), [data]);

    const total_printable_items = useMemo(() => {
        return Object.keys(to_print).reduce((count, key) => count + to_print[+key] || 0, 0)
    }, [to_print])

    const categories = useMemo(() => {
        return items
            .reduce((all, item) => ({
                ...all,
                [item.category.toLowerCase()]: {
                    name: item.category,
                    items: all[item.category.toLowerCase()] ? [
                        ...all[item.category.toLowerCase()].items,
                        item,
                    ] : [item],
                }
            }), {} as {
                [id: string]: {
                    name: string;
                    items: PrinterSteriItemFragment[]
                }
            })
    }, [items])

    const addItem = (item: PrinterSteriItemFragment) => {
        setToPrint(p => ({
            ...p,
            [item.id]: (p[item.id] || 0) + 1,
        }))
    }

    const removeItem = (item: PrinterSteriItemFragment) => {
        setToPrint(p => ({
            ...p,
            [item.id]: Math.max(0, (p[item.id] || 0) - 1),
        }))
    }

    const createLabels = async () => {
        try {
            const objects: {
                steri_item_id: number;
                clinic_user_id: number;
                expiry_at: string;
                skip_print: boolean;
            }[] = [];
            items
                .filter(item => to_print[item.id] > 0)
                .forEach(item => {
                    for (let i = 0; i < to_print[item.id]; i++) {
                        objects.push({
                            steri_item_id: item.id,
                            clinic_user_id: user.id,
                            expiry_at: dayjs().add(DefaultExpiryMonths, 'months').toISOString(),
                            skip_print: false,
                        })
                    }
                })
            const { data } = await insertLabels({
                variables: {
                    objects,
                }
            })
            const labels = data?.insert_steri_label?.returning || []
            if (labels.length > 0) {
                setToPrint({})
                toast({
                    title: `Printed ${labels.length} labels`,
                })
            }
        } catch (e) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: (e as { message: string })?.message,
            })
        }
    }

    return (
        <div className='h-full flex item-stretch overflow-hidden'>
            {loading ? <DotLoader /> : null}
            <div className='w-1/4 border-r-2 shadow-lg p-4 overflow-y-auto'>
                <p className='text-md font-bold mb-2'>Categories</p>
                {Object.keys(categories).map(category => <button
                    className={`p-4 w-full mb-4 rounded-xl ${selected_category?.name === category ? 'bg-green-100 hover:bg-green-200' : 'bg-slate-200 hover:bg-slate-300'}`}
                    onClick={() => setSelectedCategory(categories[category])}
                    key={category}>{category}</button>)}
                {/* {user.is_admin && <Link to='/settings/steri-items'>
                        <div className='text-blue-800 py-2 text-center'>Edit Items</div>
                    </Link>} */}
            </div>
            <div className='flex-1 relative'>
                <div className='p-4'>
                    <p className='text-md font-bold mb-2'>{selected_category?.name || 'Pick a category'}</p>
                    {selected_category ? <div className='w-full grid grid-cols-3 gap-4 items-start'>
                        {selected_category.items.map(item => <button
                            key={item.id}
                            onClick={() => addItem(item)}
                            className='relative p-4 bg-slate-100 h-full rounded-xl overflow-hidden'
                        >{item.name}
                        </button>)}</div> : null}
                </div>
            </div>
            <div className='w-1/4 p-4 border-l-2 flex flex-col justify-center items-stretch overflow-hidden'>
                <div className='w-full pb-2'>
                    <Button
                        color='primary'
                        className='w-full'
                        size='lg'
                        onClick={() => createLabels()}
                        disabled={total_printable_items === 0 || inserting}>
                        {!!inserting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Print Labels <span className='font-bold ml-1'>({total_printable_items})</span></Button>
                </div>
                <div className='overflow-y-auto flex-1'>
                    {items.filter(item => to_print[item.id] > 0).map(item => <button
                        key={item.id}
                        onClick={() => removeItem(item)}
                        className='relative w-full my-2 p-2 bg-slate-100 block rounded-xl overflow-hidden'
                    ><span className='absolute left-0 top-0 w-8 flex items-center justify-center
                text-3xl font-bold h-full bg-red-500'>-</span>{item.name}<span className='absolute right-0 top-0 w-8 flex items-center justify-center
                text-xl font-bold h-full bg-green-200'>{to_print[item.id]}</span></button>)}
                </div>
            </div>
        </div>
    )
}

export default PrinterScreen