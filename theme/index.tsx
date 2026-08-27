import { Layout as BasicLayout } from '@rspress/core/theme-original';
import { FooterColumns } from './FooterColumns';
import './override.css';

const Layout = () => <BasicLayout bottom={<FooterColumns />} />;

export * from '@rspress/core/theme-original';
export { Layout };
