import { useNavigate } from "react-router-dom";
import { ListUsersDocument, useCreateUserMutation } from "../../../__generated__/graphql";
import BackButton from "../../../components/BackButton";
import { createErrorToast } from "../../../lib/createErrorToast";
import UserForm, { UserFormSchema } from "./UserForm";

function UserCreateScreen() {
    const navigate = useNavigate();
    const [execute, { loading }] = useCreateUserMutation({
        refetchQueries: [{
            query: ListUsersDocument,
        }]
    })

    const onSave = async (v: UserFormSchema) => {
        try {
            await execute({
                variables: {
                    object: {
                        ...v,
                    }
                }
            })
            navigate('/settings/users')
        } catch (e) {
            createErrorToast(e)
        }
    }



    return <div className='my-6 mx-auto container'>
        <div className='mb-4 flex items-center'>
            <BackButton href='/settings/users' />
            <p className='ml-2 font-bold'>Add User</p>
        </div>
        <UserForm
            loading={loading}
            onSave={onSave}
        />
    </div>
}

export default UserCreateScreen;
