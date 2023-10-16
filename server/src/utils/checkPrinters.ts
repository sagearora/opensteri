import { InEndpoint, OutEndpoint, findByIds, getDeviceList } from 'usb';

const PRINTER_VENDOR_ID = 6495;
const PRINTER_PRODUCT_ID = 1;


async function checkPrinters() {
    // return new Promise((res) => {
    //     const device = findByIds(PRINTER_VENDOR_ID, PRINTER_PRODUCT_ID)
    //     console.log('called')
    //     if (device) {
    //         device.open()
    //         const i = device.interface(0)
    //         // Check if the kernel driver is active
    //         if (i.isKernelDriverActive()) {
    //             try {
    //                 i.detachKernelDriver();
    //             } catch (error) {
    //                 console.error('Error detaching kernel driver:', error);
    //                 device.close()
    //                 res(false)
    //                 return
    //             }
    //         }
    //         i.claim()
    //         const out_endpoint = i.endpoints.find(e => e.direction === 'out') as OutEndpoint | undefined
    //         const in_endpoint = i.endpoints.find(e => e.direction === 'in') as InEndpoint | undefined

    //         if (!out_endpoint || !in_endpoint) {
    //             i.release(true, () => {
    //                 device.close()
    //                 res(false)
    //             })
    //             return
    //         }

    //         const check_cmd = `^XSET,IMMEDIATE,1\n~S,CHECK`
    //         const buffer_data = Buffer.from(check_cmd, 'utf-8')

    //         in_endpoint.on('data', (d) => {
    //             console.log(d)
    //         })
    //         in_endpoint.startPoll(3, 100, (err) => {
    //             console.error(err)
    //             // out_endpoint.transfer(buffer_data, (error) => {
    //             //     if (error) {
    //             //         console.error('Transfer failed', error)
    //             //         i.release(true, () => {
    //             //             device.close()
    //             //             res(false)
    //             //         })
    //             //         return
    //             //     }
    //             //     console.log('Data sent to printer')
    //             //     // in_endpoint.transfer(4, (error, data) => {
    //             //     //     if (error) {
    //             //     //         console.error('Error receiving data:', error);
    //             //     //         res(false)
    //             //     //     } else if (data) {
    //             //     //         console.log('Data received from the printer:', data.toString('utf-8'));
    //             //     //     }
    //             //     //     console.log('no data came back')
    //             //     //     i.release(true, (err) => {
    //             //     //         if (err) {
    //             //     //             console.error('Error release the interface')
    //             //     //         }
    //             //     //         device.close()
    //             //     //     })
    //             //     // })
    //             // })
    //         })


    //     }
    // })
}


const device = findByIds(PRINTER_VENDOR_ID, PRINTER_PRODUCT_ID);

if (!device) {
    console.error('Device not found!');
    process.exit(1);
}

device.open();

// Assuming interface 0 and using endpoint 1 for data in
const ifc = device.interface(0);
const endpoint = ifc.endpoints.find(e => e.direction === 'in') as InEndpoint;
const out_endpoint = ifc.endpoints.find(e => e.direction === 'out') as OutEndpoint;

if (!endpoint) {
    throw new Error('no in endpoint')
}

if (!out_endpoint) {
    throw new Error('no out endpoint')
}

ifc.claim();

// endpoint.startPoll(1, 64); // Start polling with 1 transfer of 64 bytes
// console.log('polling')

// endpoint.on('data', (data) => {
//     console.log('Received data:', data);
// });

// endpoint.on('error', (error) => {
//     console.error('Endpoint error:', error);
//     endpoint.stopPoll(() => {
//         console.log('Stopped polling due to error.');
//         ifc.release(true, () => {
//             device.close();
//         });
//     });
// });

setTimeout(() => {
    out_endpoint.transfer(Buffer.from('^XSET,IMMEDIATE,1\n~S,CHECK', 'utf-8'), (err, data) => {
        if (err) console.error(err)
        console.log(data)
        endpoint.transfer(data, (err, d) => {
            if (err) console.error(err)
            console.log(d)
        })
        // out_endpoint.transfer(Buffer.from('~S,CHECK'), (err, data) => {
        //     if (err) console.error(err)
        //     console.log(data)
        // })
    })
}, 1000)


export default checkPrinters;