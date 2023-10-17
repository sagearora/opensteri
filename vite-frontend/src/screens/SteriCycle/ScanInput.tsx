import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { QRType } from '../../constants';
import useScanner from '../../lib/use-scanner';

function ScanInput({
    is_finished,
    onScan,
}: {
    is_finished: boolean;
    onScan: (data: {
        type: QRType;
        id: number | string;
    }) => void
}) {
    const [steri_label_id, setSteriLabelId] = useState<string>('')

    useScanner({
        is_scanning: !is_finished,
        onScan: (data) => {
            if (data.type === QRType.SteriLabel) {
                const id = parseInt(data.id.toString(), 10);
                if (isNaN(id)) {
                    return;
                }
                onScan({
                    type: QRType.SteriLabel,
                    id,
                })
            }
        }
    })

    const submit = () => {
        if (!steri_label_id) {
            return;
        }
        const id = parseInt(steri_label_id, 10);
        if (isNaN(id)) {
            return;
        }
        onScan({
            type: QRType.SteriLabel,
            id,
        })
        setSteriLabelId('')
    }

    if (is_finished) {
        return null
    }

    return (
        <div>
            {!is_finished && <div className='my-6 mx-auto container flex flex-col items-center'>
                <svg xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                </svg>

                <h1 className='text-center mb-2 font-bold text-md'>Use the handheld scanner to scan all items going into the sterilizer.</h1>
            </div>}
            <div className='flex items-center space-x-2 max-w-md mx-auto'>
                <Input
                    placeholder='Enter Steri Label ID'
                    value={steri_label_id}
                    onChange={e => setSteriLabelId(e.target.value)}
                    className='flex-1'
                />
                <Button onClick={submit}>
                    Add Item
                </Button>
            </div>
        </div>
    )
}

export default ScanInput