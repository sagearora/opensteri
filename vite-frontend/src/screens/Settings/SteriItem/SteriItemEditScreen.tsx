import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../components/BackButton";
import NotFoundItem from "../../../components/NotFoundItem";

import { useGetSteriItemQuery, useUpdateSteriItemMutation } from "../../../__generated__/graphql";
import { createErrorToast } from "../../../lib/createErrorToast";
import LoadingScreen from "../../LoadingScreen";
import SteriItemForm, { SteriItemFormSchema } from "./SteriItemForm";

function SteriItemEditScreen() {
    const navigate = useNavigate();
    const item_id = +(useParams().steri_item_id as string)
    const {
        loading,
        data,
    } = useGetSteriItemQuery({
        variables: {
            id: item_id,
        }
    })
    const [execute, {loading: updating}] = useUpdateSteriItemMutation()

    if (loading) {
        return <LoadingScreen />
    }
    const steri_item = data?.steri_item_by_pk;

    if (!steri_item) {
        return <NotFoundItem title='Sorry, steri item was not found' />
    }

    const onSave = async (v: SteriItemFormSchema) => {
        try {
            await execute({
                variables: {
                    id: steri_item.id,
                    set: v,
                }
            })
            navigate('/settings/steri-items')
        } catch (e) {
            createErrorToast(e)
        }
    }



    return <div className='py-6 container'>
        <BackButton href='/settings/steri-items' />
        <div className='mt-2 mb-4'>
            <p className='text-sm text-gray-500'>Edit Steri Item</p>
            <p className='font-bold'>{steri_item.name}</p>
        </div>
        <SteriItemForm
            steri_item={steri_item}
            loading={updating}
            onSave={onSave}
        />
    </div>
}

export default SteriItemEditScreen;
