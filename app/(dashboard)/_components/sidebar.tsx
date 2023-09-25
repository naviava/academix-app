import Logo from "./logo";
import SidebarRoutes from "./sidebar-routes";

interface SidebarProps {}

export default function Sidebar({}: SidebarProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r bg-white shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex w-full flex-col">
        <SidebarRoutes />
      </div>
    </div>
  );
}
