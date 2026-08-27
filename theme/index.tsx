import { Layout as BasicLayout } from '@rspress/core/theme-original';
import { FooterColumns } from './FooterColumns';
import './override.css';
import MingcuteMoonStarsLine from '~icons/mingcute/moon-stars-line';
import MingcuteSunLine from '~icons/mingcute/sun-line'

export { MingcuteMoonStarsLine as IconMoon, MingcuteSunLine as IconSun };

const Layout = () => <BasicLayout bottom={<FooterColumns />} />;

export * from '@rspress/core/theme-original';
export { Layout };
