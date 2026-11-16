import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { superAdminApi } from "../../context/superadmin/superAdminApi";
import { useRequest } from "../../context/superadmin/hooks";
import { RefreshBadgesContext } from "../../context/superadmin/useRefreshBadges";
import useAuth from "../../context/useAuth";

export default function SuperAdminLayout() {
  const navigate = useNavigate();
  const { data: badges, reload } = useRequest(superAdminApi.getBadgeCounts, {});
  const { logout } = useAuth();

  return (
    <RefreshBadgesContext.Provider value={reload}>
      <DashboardLayout
        role="superadmin"
        badges={badges ?? {}}
        onLogout={logout}
        onSearch={(q) => navigate(`/superadmin/properties?search=${encodeURIComponent(q)}`)}
      />
    </RefreshBadgesContext.Provider>
  );
}