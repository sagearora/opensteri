import { useEffect } from 'react';
import { resolveQr } from './qr-service';
import { QRType } from '../constants';

export type useScannerProps = {
    is_scanning?: boolean;
    onScan: (data: {
        type: QRType,
        id: number | string
    }) => void;
}
function useScanner({
    is_scanning,
    onScan,
}: useScannerProps) {
    useEffect(() => {
        if (!is_scanning) {
            return;
        }
        let code = "";
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                const data = resolveQr(code)
                console.log(code)
                if (data) {
                    onScan(data)
                }
                code = "";
            } else if (event.key === 'Shift') { // skip over shift key

            } else {
                code += event.key; //while this is not an 'enter' it stores the every key            
            }
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [is_scanning, onScan])

    return {
        is_scanning
    }
}

export default useScanner