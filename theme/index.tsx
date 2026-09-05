import { Layout as BasicLayout } from "@rspress/core/theme-original";
import { FooterColumns } from "./FooterColumns";
import { OutlinePromo } from "./components/OutlinePromo";
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
  <BasicLayout afterOutline={<OutlinePromo />} bottom={<FooterColumns />} />
);

export * from "@rspress/core/theme-original";
export { EditLink } from "./components/EditLink";
export { Sidebar } from "./components/Sidebar";
export { Layout };
