import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout() {
  return (
    <div className="sf-admin-root min-h-screen bg-[#08111f] text-white">
      <Sidebar />
      <div className="ml-[240px] min-h-screen">
        <Topbar />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
