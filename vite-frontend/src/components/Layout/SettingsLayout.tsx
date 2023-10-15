import Div100vh from 'react-div-100vh';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';

const SettingsLayout = () => {

  return (
    <Div100vh>
      <div className='h-full flex flex-col overflow-hidden'>
        <Header />
        <div className='flex-1 overflow-y-auto'>
          <Outlet />
        </div>
        <Navbar />
      </div>
    </Div100vh>
  );
}

export default SettingsLayout;
