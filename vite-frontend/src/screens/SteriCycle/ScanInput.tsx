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
    const [steri_label_id, setSteriLabelId] = useState<string | undefined>()

    useScanner({
        is_scanning: !is_finished,
        onScan: (data) => {
            if (data.type === QRType.SteriLabel) {
                setSteriLabelId(data.id.toString())
                submit()
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
    }

    if (is_finished) {
        return null
    }

    return (
        <div className='flex items-center space-x-2 max-w-md'>
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
    )
}

export default ScanInput