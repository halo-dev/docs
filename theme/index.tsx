import { Layout as BasicLayout } from "@rspress/core/theme-original";
import { FooterColumns } from "./FooterColumns";
import { SidebarPromo } from "./components/SidebarPromo";
import "./override.scss";
import MingcuteArrowToUpLine from "~icons/mingcute/arrow-to-up-line";
import MingcuteEdit3Line from "~icons/mingcute/edit-3-line";
import MingcuteMoonStarsLine from "~icons/mingcute/moon-stars-line";
import MingcuteSunLine from "~icons/mingcute/sun-line";

export {
  MingcuteArrowToUpLine as IconScrollToTop,
  MingcuteEdit3Line as IconEdit,
  MingcuteMoonStarsLine as IconMoon,
  MingcuteSunLine as IconSun,
};

const Layout = () => (
  <BasicLayout afterSidebar={<SidebarPromo />} bottom={<FooterColumns />} />
);

export * from "@rspress/core/theme-original";
export { EditLink } from "./components/EditLink";
export { Sidebar } from "./components/Sidebar";
export { Layout };
