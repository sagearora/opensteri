import { useMemo } from "react"
import { PrinterSteriItemFragment } from "../../__generated__/graphql"

function CategoryItemList({
    items,
    addItem,
}: {
    items: PrinterSteriItemFragment[]
    addItem: (item: PrinterSteriItemFragment) => void
}) {
    const _items = useMemo(() => items.sort((a, b) => a.name < b.name ? -1 : 1), [items])
    return (
        <div className='w-full grid grid-cols-3 gap-4 items-start'>
            {_items.map(item => <button
                key={item.id}
                onClick={() => addItem(item)}
                className='relative p-4 bg-slate-100 h-full rounded-md overflow-hidden'
            >{item.name}
            </button>)}</div>
    )
}

export default CategoryItemList