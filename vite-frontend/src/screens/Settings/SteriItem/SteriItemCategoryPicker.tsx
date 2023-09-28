import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ControllerFieldState, ControllerRenderProps, FieldPath, FieldValues, UseFormStateReturn } from 'react-hook-form';
import { useListSteriItemCategoriesQuery } from '../../../__generated__/graphql';
import { Button } from '../../../components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { FormControl, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';

export const SteriItemCategoryPicker = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues>
    = FieldPath<TFieldValues>>({
        field,
    }: {
        field: ControllerRenderProps<TFieldValues, TName>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<TFieldValues>;
    }) => {
    const { loading, data } = useListSteriItemCategoriesQuery({
        fetchPolicy: 'network-only'
    })
    const categories = (data?.steri_item_category || [])
    const [show_add, setShowAdd] = useState(false)

    const select = (value: string) => () => {
        field.onChange(value)
    }

    if (show_add) {
        return <FormItem className="flex flex-col">
            <FormLabel>Category name</FormLabel>
            <FormControl>
                <Input placeholder="e.g. Restorative" {...field} />
            </FormControl>
            <FormMessage />
        </FormItem>
    }

    return <FormItem className='flex flex-col'>
        <FormLabel>Select a category</FormLabel>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {field.value || 'Select Category'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {categories.map(({ name }) => <DropdownMenuCheckboxItem
                    checked={field.value === name}
                    onClick={select(name)}
                    key={name}>{name}</DropdownMenuCheckboxItem>)}
                <DropdownMenuCheckboxItem
                    checked={false}
                    onClick={() => setShowAdd(true)}>Add Category</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <FormMessage />
    </FormItem>
}