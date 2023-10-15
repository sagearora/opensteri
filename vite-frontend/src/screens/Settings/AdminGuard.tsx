import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { KeyAdminUnlockUntil } from '../../constants';
import { useClinic } from '../../lib/useClinic';
import AdminPasswordForm from './AdminPasswordForm';
import dayjs from 'dayjs';

export type AdminGuardProps = {
  adminRequired?: boolean;
}

const AdminGuard = ({
  adminRequired,
}: AdminGuardProps) => {
  const { clinic } = useClinic()
  const navigate = useNavigate()
  const [admin_unlocked_until, setAdminUnlockedUntil] = useState(+(localStorage.getItem(KeyAdminUnlockUntil) || '0'))

  useEffect(() => {
    // if (!!adminRequired) {
    //   navigate('/')
    // }
  }, [adminRequired, navigate, admin_unlocked_until])

  if (admin_unlocked_until > +new Date()) {
    return <Outlet />
  }

  return <AdminPasswordForm 
    submit={(password) => {
      if (password === clinic.admin_password) {
        const valid_until = +dayjs().add(10, 'minutes')
        setAdminUnlockedUntil(valid_until)
        localStorage.setItem(KeyAdminUnlockUntil, valid_until.toString())
        return true
      }
      return false
    }}
  />
}

export default AdminGuard;
