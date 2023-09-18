import { useNavigate } from "react-router-dom";
import { ListSterilizersDocument, useCreateSterilizerMutation } from "../../../__generated__/graphql";
import BackButton from "../../../components/BackButton";
import { createErrorToast } from "../../../lib/createErrorToast";
import SteriForm, { SteriFormSchema } from "./SteriForm";

function SteriCreateScreen() {
    const navigate = useNavigate();
    const [execute, { loading }] = useCreateSterilizerMutation({
        refetchQueries: [{
            query: ListSterilizersDocument,
        }]
    })

    const onSave = async (v: SteriFormSchema) => {
        try {
            await execute({
                variables: {
                    object: {
                        ...v,
                    }
                }
            })
            navigate('/settings/steri')
        } catch (e) {
            createErrorToast(e)
        }
    }



    return <div className='my-6 mx-auto container'>
        <div className='mb-4 flex items-center'>
            <BackButton href='/settings/steri' />
            <p className='ml-2 font-bold'>Create Sterilizer</p>
        </div>
        <SteriForm
            onSave={onSave}
            loading={loading}
        />
    </div>
}

export default SteriCreateScreen;
