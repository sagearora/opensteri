import { Loader2 } from 'lucide-react';
import { ControllerFieldState, ControllerRenderProps, FieldPath, FieldValues, UseFormStateReturn } from 'react-hook-form';
import { SteriFragment, useListActiveSterilizersQuery } from '../../__generated__/graphql';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { FormItem, FormLabel, FormMessage } from '../../components/ui/form';

export const SteriPicker = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues>
    = FieldPath<TFieldValues>>({
        field,
    }: {
        field: ControllerRenderProps<TFieldValues, TName>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<TFieldValues>;
    }) => {
    const { loading, data } = useListActiveSterilizersQuery({
        fetchPolicy: 'network-only'
    })
    const steri_items = (data?.steri || [])

    const select = (value: SteriFragment) => () => {
        field.onChange(value)
    }

    return <FormItem className='flex flex-col'>
        <FormLabel>Select a sterilizer</FormLabel>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {field.value?.name || 'Pick a Sterilizer'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {steri_items.map((item) => <DropdownMenuCheckboxItem
                    checked={field.value?.id ===  item.id}
                    onClick={select(item)}
                    key={item.id}>{item?.name}</DropdownMenuCheckboxItem>)}

            </DropdownMenuContent>
        </DropdownMenu>
        <FormMessage />
    </FormItem>
}