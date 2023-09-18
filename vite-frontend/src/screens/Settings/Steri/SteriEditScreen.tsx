import { useNavigate, useParams } from "react-router-dom";
import { useGetSterilizerQuery, useUpdateSterilizerMutation } from "../../../__generated__/graphql";
import BackButton from "../../../components/BackButton";
import { createErrorToast } from "../../../lib/createErrorToast";
import LoadingScreen from "../../LoadingScreen";
import NotFoundScreen from "../../NotFoundScreen";
import SteriForm, { SteriFormSchema } from "./SteriForm";

function SteriEditScreen() {
    const navigate = useNavigate();
    const steri_id = +(useParams().steri_id as string)
    const {
        loading,
        data,
    } = useGetSterilizerQuery({
        variables: {
            id: steri_id,
        }
    })
    const [execute, { loading: updating }] = useUpdateSterilizerMutation()

    if (loading) {
        return <LoadingScreen />
    }

    const steri = data?.steri_by_pk;

    if (!steri) {
        return <NotFoundScreen />
    }

    const onSave = async (v: SteriFormSchema) => {
        try {
            await execute({
                variables: {
                    id: steri.id,
                    set: v,
                }
            })
            navigate('/settings/steri')
        } catch (e) {
            createErrorToast(e)
        }
    }



    return <div className='py-6 container'>
        <BackButton href='/settings/steri' />
        <div className='mt-2 mb-4'>
            <p className='text-sm text-gray-500'>Edit Sterilizer</p>
            <p className='font-bold'>{steri.name}</p>
        </div>
        <SteriForm
            steri={steri}
            loading={updating}
            onSave={onSave}
        />
    </div>
}

export default SteriEditScreen;
