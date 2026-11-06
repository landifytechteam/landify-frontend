import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { navForRole } from "../../data/navigation";
import useAuth from "../../context/useAuth";

/**
 * The frame around every dashboard page: sidebar on the left, header on top,
 * and the current page (React Router's <Outlet />) in the middle.
 *
 * `role` picks the menu from navForRole. `badges` holds live counts for menu
 * items, e.g. { moderation: 8 }. TODO: load these from the backend.
 */
export function DashboardLayout({ role, badges, footerLabel }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = navForRole[role] ?? navForRole[user?.role];

  if (!nav) return <p className="p-8 text-body">No dashboard is set up for this role yet.</p>;

  return (
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
        <Topbar nav={nav} onMenuClick={() => setMenuOpen(true)} hasNotifications />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Outlet />
        </main>

        <footer className="flex flex-col gap-1 border-t border-line px-4 py-5 text-xs text-body sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <span>LANDIFY / {footerLabel ?? nav.workspace.name}</span>
        </footer>
      </div>
    </div>
  );
}