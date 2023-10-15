import { findByIds, getDeviceList } from 'usb';

function checkPrinters() {
    const device = findByIds(6495, 1)
    if (device) {
        console.log(device.portNumbers, device.deviceDescriptor)
    }
}

export default checkPrinters;