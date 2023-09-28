import { useNavigate } from "react-router-dom";
import { ListSettingsSteriItemsDocument, useCreateSteriItemMutation } from "../../../__generated__/graphql";
import BackButton from "../../../components/BackButton";
import { createErrorToast } from "../../../lib/createErrorToast";
import SteriItemForm, { SteriItemFormSchema } from "./SteriItemForm";

function SteriItemCreateScreen() {
    const navigate = useNavigate();
    const [execute] = useCreateSteriItemMutation({
        refetchQueries: [{
            query: ListSettingsSteriItemsDocument,
        }]
    })

    const onSave = async (v: SteriItemFormSchema) => {
        try {
            await execute({
                variables: {
                    object: v,
                }
            })
            navigate('/settings/steri-items')
        } catch(e) {
            createErrorToast(e)
        }
    }



    return <div className='py-6 mx-auto container'>
        <div className='mb-4 flex items-center'>
            <BackButton href='/settings/steri-items' />
            <p className='ml-2 font-bold'>Create Steri Item</p>
        </div>
        <SteriItemForm
            onSave={onSave}
        />
    </div>
}

export default SteriItemCreateScreen;
