import { useMemo } from 'react'
import { Button } from './ui/button'

export interface PaginationProps {
    current: number
    total: number
    pageSize: number
    setPage: (page: number) => void
}

function Pagination({
    current,
    total,
    pageSize,
    setPage
}: PaginationProps) {
    const pages = useMemo(() => {
        const totalNumberOfPages = Math.ceil(total / pageSize);
        const pageButtons = [];

        for (let i = 0; i < totalNumberOfPages; i++) {
            // Always add the first page, the current page, the last page, and their immediate neighbors
            if (i === 0 || i === totalNumberOfPages - 1 || i === current - 1 || i === current || i === current + 1) {
                pageButtons.push(
                    <Button key={i}
                        onClick={() => setPage(i)}
                        variant={current === i ? 'default' : 'ghost'}>
                        {i + 1}
                    </Button>
                );
                // Add ellipsis when there is a gap in the sequence
            } else if (i === current - 2 || i === current + 2) {
                pageButtons.push(<span key={i}>...</span>);
            }
        }

        return pageButtons;
    }, [total, pageSize, setPage, current])

    const prev = () => {
        setPage(Math.max(0, current - 1))
    }

    const next = () => {
        setPage(Math.min(total/pageSize, current + 1))
    }

    return (
        <div className='flex items-center gap-2'>
            <Button variant='ghost' size='icon' onClick={prev}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </Button>
            {pages}
            <Button variant='ghost' size='icon' onClick={next}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </Button>
        </div>
    )
}

export default Pagination