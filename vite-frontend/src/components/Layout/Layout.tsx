import Div100vh from 'react-div-100vh';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../../lib/UserProvider';
import Header from './Header';
import Navbar from './Navbar';

const Layout = () => {
  const navigate = useNavigate()

  const {
    user,
    endSession
  } = useUser()

  const endSessionRoute = () => {
    navigate('/')
    endSession();
  }

  return (
    <Div100vh>
      <div className='h-full flex flex-col overflow-hidden'>
        <Header 
          user={user}
          endSession={endSessionRoute}
        />
        <div className='flex-1 overflow-y-auto'>
          <Outlet />
        </div>
        <Navbar />
      </div>
    </Div100vh>
  );
}

export default Layout;
