import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../components/BackButton";
import NotFoundItem from "../../../components/NotFoundItem";
import UserForm, { UserFormSchema } from "./UserForm";
import { useGetUserQuery, useUpdateUserMutation } from "../../../__generated__/graphql";
import LoadingScreen from "../../LoadingScreen";
import { createErrorToast } from "../../../lib/createErrorToast";

function UserEditScreen() {
    const navigate = useNavigate();
    const user_id = +(useParams().user_id as string)
    const {
        loading,
        data,
    } = useGetUserQuery({
        variables: {
            id: user_id,
        }
    })
    const [execute, { loading: updating }] = useUpdateUserMutation()
    if (loading) {
        return <LoadingScreen />
    }
    const user = data?.user_by_pk;

    if (!user) {
        return <NotFoundItem
            title='Sorry user not found'
        />
    }

    const onSave = async (v: UserFormSchema) => {
        try {
            await execute({
                variables: {
                    id: user.id,
                    set: v,
                }
            })
            navigate('/settings/users')
        } catch (e) {
            createErrorToast(e)
        }
    }



    return <div className='my-6 mx-auto container'>
        <BackButton href='/settings/users' />

        <div className='mb-4 mt-2'>
            <p className='text-sm text-gray-500'>Edit User</p>
            <p className='font-bold'>{user.name}</p>
        </div>
        <UserForm
            user={user}
            loading={updating}
            onSave={onSave}
        />
    </div>
}

export default UserEditScreen;
