import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-dark bg-grid page-shell">
      <div className="ambient-orb left-[-10rem] top-[-8rem] h-72 w-72 bg-mf-pink/12" />
      <div className="ambient-orb bottom-[-12rem] right-[-10rem] h-80 w-80 bg-gs-blue-mid/12" />
      <Navbar />
      <main className="relative max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
