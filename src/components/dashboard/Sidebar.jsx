import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, LogOut, ShieldCheck, X } from "lucide-react";
import { Logo } from "../ui/Logo";

/**
 * Dark green sidebar. Everything role-specific comes from `nav`
 * (one entry of navForRole), so the same component serves every role.
 * On small screens it slides in as a drawer; `open` / `onClose` control that.
 */
export function Sidebar({ nav, badges = {}, user, onLogout, open, onClose }) {
  const WorkspaceIcon = nav.workspace.icon;

  return (
    <>
      {/* Dimmed backdrop behind the drawer on mobile */}
      <div
        className={`fixed inset-0 z-30 bg-ink/40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-66 flex-col overflow-y-auto bg-brand-700 px-4 py-6 text-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <Logo tone="light" />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-white/15 px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/70">
            {nav.workspace.eyebrow}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
            <WorkspaceIcon className="h-4 w-4 text-gold-500" aria-hidden />
            {nav.workspace.name}
          </p>
        </div>

        <nav className="mt-6 space-y-1" aria-label="Main">
          {nav.items.map((item) => (
            <SidebarLink key={item.to} item={item} count={badges[item.badgeKey]} onNavigate={onClose} />
          ))}
        </nav>

        {nav.note && (
          <div className="mt-8 rounded-lg border border-white/15 px-4 py-4">
            <ShieldCheck className="h-5 w-5 text-gold-500" aria-hidden />
            <p className="mt-3 text-sm font-semibold">{nav.note.title}</p>
            <p className="mt-1.5 text-xs leading-5 text-white/75">{nav.note.body}</p>
          </div>
        )}

        <UserMenu user={user} title={nav.userTitle} onLogout={onLogout} />
      </aside>
    </>
  );
}

function SidebarLink({ item, count, onNavigate }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm transition-colors ${
          isActive
            ? "border-gold-500 bg-white/10 font-semibold text-white"
            : "border-transparent text-white/80 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={1.6} aria-hidden />
      <span className="flex-1">{item.label}</span>
      {count > 0 && (
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-gold-500/90 px-1.5 text-xs font-semibold text-brand-900">
          {count}
        </span>
      )}
    </NavLink>
  );
}

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

/** Avatar + name at the bottom, opening a small menu with Log out. */
function UserMenu({ user, title, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const name = user?.fullName || user?.name || "Your account";

  // Close the menu when clicking anywhere outside it
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={menuRef} className="relative mt-auto pt-6">
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 rounded-md bg-white py-1 text-sm text-ink shadow-lg">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-canvas"
          >
            <LogOut className="h-4 w-4 text-body" aria-hidden />
            Log out
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-white/5"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f6ecc9] text-sm font-semibold text-brand-900">
          {initialsOf(name) || "?"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{name}</span>
          <span className="block truncate text-xs text-white/70">{title}</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-white/70 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
    </div>
  );
}