import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../../lib/UserProvider';

export type UserGuardProps = {
  adminRequired?: boolean;
}

const UserGuard = ({
  adminRequired,
}: UserGuardProps) => {
  const { user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!!adminRequired && !user.is_admin) {
      navigate('/')
    }
  }, [adminRequired, navigate, user.is_admin])

  return (<Outlet />);
}

export default UserGuard;
