import { Loader2 } from 'lucide-react';
import { Control, ControllerFieldState, ControllerRenderProps, FieldPath, FieldValues, UseFormStateReturn } from 'react-hook-form';
import { PrinterSteriItemFragment, useListPrinterSteriItemsQuery } from '../../__generated__/graphql';
import { Button } from '../../components/ui/button';
import { FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { useMemo } from 'react';

export type SteriItemCategoryPickerProps = {
    name: string;
    control: Control<FieldValues, object>;
}

export const SteriItemPicker = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues>
    = FieldPath<TFieldValues>>({
        field,
    }: {
        field: ControllerRenderProps<TFieldValues, TName>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<TFieldValues>;
    }) => {
    const { loading, data } = useListPrinterSteriItemsQuery({
        fetchPolicy: 'network-only'
    })
    const items = useMemo(() => (data?.steri_item || []), [data])

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

    const current = useMemo(() => {
        return items.find(i => i.id === field.value)
    }, [items, field.value])

    const select = (value: PrinterSteriItemFragment) => () => {
        field.onChange(value.id)
    }

    return <FormItem className='flex flex-col'>
        <FormLabel>Select a category</FormLabel>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {!current ? 'Pick the new category' : current?.name}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {Object.keys(categories)
                    .map(category => <DropdownMenuGroup key={category}>
                        <DropdownMenuLabel>{category}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {categories[category].items.map((item) => <DropdownMenuCheckboxItem
                            checked={field.value === item.id}
                            onClick={select(item)}
                            key={item.id}>{item.name}</DropdownMenuCheckboxItem>)}
                    </DropdownMenuGroup>)}

            </DropdownMenuContent>
        </DropdownMenu>
        <FormMessage />
    </FormItem>

}