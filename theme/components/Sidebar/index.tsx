import { useSidebarDynamic } from "@rspress/core/runtime";
import { SidebarList } from "@rspress/core/theme-original";

export function Sidebar() {
  const [sidebarData, setSidebarData] = useSidebarDynamic();

  return (
    <div className="rp-sidebar-scroll rp-scrollbar">
      <SidebarList sidebarData={sidebarData} setSidebarData={setSidebarData} />
    </div>
  );
}
