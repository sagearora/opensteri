import { useRef, useState } from 'react';
import AuthCode, { AuthCodeRef } from 'react-auth-code-input';
import Div100vh from 'react-div-100vh';
import { UserFragment, useGetUserByPinLazyQuery } from '../__generated__/graphql';
import Header from '../components/Layout/Header';
import { Alert } from '../components/ui/alert';
import { toast } from '../components/ui/use-toast';

export type NoUserScreenProps = {
    setUser: (user: UserFragment) => void;
}

const ExpectedCodeLength = 4


function NoUserScreen({
    setUser,
}: NoUserScreenProps) {
    const auth_code_ref = useRef<AuthCodeRef>(null)
    const [error, setError] = useState('');
    const [query, { loading }] = useGetUserByPinLazyQuery()

    const handleOnChange = async (res: string) => {
        if (res.length === ExpectedCodeLength) {
            try {
                const result = await query({
                    variables: {
                        pin: +res,
                    }
                });
                const user = result?.data?.user_by_pin;
                if (!user) {
                    setError('Wrong Pin');
                    return
                }
                setUser(user);
            } catch (e) {
                toast({
                    title: 'Error',
                    description: (e as { message?: string })?.message,
                    variant: 'destructive',
                })
            } finally {
                if (auth_code_ref.current) {
                    auth_code_ref.current.clear()
                }
            }
        }
    };


    return (
        <Div100vh>
            <Header />
            <div className='flex-1 flex flex-col items-center pt-24'>
                <p className="text-2xl mb-4 font-bold text-gray-500">
                    Login with your PIN.
                </p>

                <div className='flex justify-center'>
                    <AuthCode
                        autoFocus
                        disabled={loading}
                        ref={auth_code_ref}
                        length={ExpectedCodeLength}
                        containerClassName='auth-code'
                        allowedCharacters='numeric'
                        onChange={handleOnChange} />
                </div>
                {error && <Alert
                    variant='destructive'
                    className='max-w-sm flex justify-center'>{error}</Alert>}
            </div>
        </Div100vh>
    )
}

export default NoUserScreen