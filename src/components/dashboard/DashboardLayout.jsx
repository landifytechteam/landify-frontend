import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { navForRole } from "../../data/navigation";
import useAuth from "../../context/useAuth";
import { ToastProvider } from "./Toast";
import { LoadingState } from "./ui";

export function DashboardLayout({ role, badges, footerLabel, onSearch }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = navForRole[role];

  if (!nav) return <p className="p-8 text-body">No dashboard is set up for this role yet.</p>;

  return (
    <ToastProvider>
    <div className="min-h-screen bg-canvas">
      <Sidebar
        nav={nav}
        badges={badges}
        user={user}
        onLogout={logout}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex min-h-screen flex-col lg:pl-66">
        <Topbar nav={nav} onMenuClick={() => setMenuOpen(true)} onSearch={onSearch} hasNotifications />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {/* Own Suspense so only this area shows a spinner while a page loads;
              the sidebar and topbar stay on screen instead of flashing. */}
          <Suspense fallback={<LoadingState />}>
            <Outlet />
          </Suspense>
        </main>

        <footer className="flex flex-col gap-1 border-t border-line px-4 py-5 text-xs text-body sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <span>LANDIFY / {footerLabel ?? nav.workspace.name}</span>
        </footer>
      </div>
    </div>
    </ToastProvider>
  );
}