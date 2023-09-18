import { Datasources } from "../../ApolloContext"
import { Steri_Item, Steri_Label, User } from "../__generated__/resolver-types"
import fs from 'fs'
import { QRType, createQr } from "../utils/qr-service";
import dayjs from 'dayjs'

export interface PrintHandler {
    printLabels: ReturnType<typeof printLabels>,
}

function sendEzplToPrinterRaw(port: string, command: string): void {
    fs.writeFileSync(port, command, 'utf-8');
}

const PRINTER_PORT = '/dev/usb/lp0';
const printer_layout = `^Q25,3\n^W50\n^H5\n^P1\n^S2\n^AD\n^C1\n^R0\n~Q+0\n^O0\n^D0\n^E12\n~R255`

const MaxContentSize = 14;

const printLabels = () => {
    return async (datasources: Datasources, labels: Steri_Label[]) => {
        const steri_item_ids: number[] = []
        const user_ids: number[] = []
        labels.forEach(label => {
            if (steri_item_ids.indexOf(label.steri_item_id) === -1) {
                steri_item_ids.push(label.steri_item_id)
            }
            if (user_ids.indexOf(label.clinic_user_id) === -1) {
                user_ids.push(label.clinic_user_id)
            }
        })
        const steri_items = await datasources.steriItemHandler.bulkGet(steri_item_ids)
        const users = await datasources.userHandler.bulkGet(user_ids)

        const print_cmd = [
            printer_layout,
        ]

        const labelsToPrint: Steri_Label[] = labels.map(label => {
            const steri_item = steri_items.find(steri_item => steri_item.id === label.steri_item_id) as Steri_Item
            const clinic_user = users.find(user => user.id === label.clinic_user_id) as User
            const qr = createQr({
                type: QRType.SteriLabel,
                id: label.id,
            })
            print_cmd.push(`^L\nDy2-me-dd\nTh:m:s\nAA,4,9,1,1,0,0,#${label.id} - ${steri_item.category}\nAC,4,29,1,1,0,0,${steri_item.name.slice(0, MaxContentSize)}\nAC,4,59,1,1,0,0,${steri_item.name.slice(MaxContentSize, MaxContentSize * 2)}\nAC,4,100,1,1,0,0,${clinic_user.name}\nAA,4,135,1,1,0,0,Date: ${dayjs(label.created_at).format('YYYY-MM-DD HH:mm')}\nAA,4,162,1,1,0,0,Exp: ${dayjs(label.expiry_at).format('YYYY-MM-DD HH:mm')}\nW218,9,5,2,M0,8,6,${qr.length},0\n${qr}\nE`)
            return {
                ...label,
                steri_item,
                clinic_user,
            }
        })

        const command = print_cmd.join('\n')
        sendEzplToPrinterRaw(PRINTER_PORT, command)

        return labelsToPrint
    }
}

function create(): PrintHandler {
    return {
        printLabels: printLabels(),
    }
}

export default { create }