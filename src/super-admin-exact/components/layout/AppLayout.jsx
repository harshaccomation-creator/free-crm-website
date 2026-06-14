import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#08111f] text-white">
      <Sidebar />
      <div className="ml-[330px] min-h-screen">
        <Topbar />
        <main className="p-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
