import { Order_By } from "../__generated__/resolver-types"

export interface ListArgs {
    limit?: number | null
    offset?: number | null
    order_by?: Order_By[] | null
}
