import { Link } from '@rspress/core/theme-original';

interface FooterItem {
  text: string;
  link: string;
  external?: boolean;
}

const columns: { title: string; items: FooterItem[] }[] = [
  {
    title: '关于',
    items: [
      { text: '关于我们', link: 'https://www.halo.run/about', external: true },
      { text: '应用市场', link: 'https://www.halo.run/store', external: true },
      {
        text: 'GitHub 组织',
        link: 'https://github.com/halo-dev',
        external: true,
      },
      {
        text: 'Gitee 组织',
        link: 'https://gitee.com/halo-dev',
        external: true,
      },
      {
        text: 'GitCode 仓库',
        link: 'https://gitcode.com/feizhiyun/halo',
        external: true,
      },
      { text: '版本发布', link: 'https://releases.halo.run', external: true },
      {
        text: 'Server Status',
        link: 'https://status.halo.run',
        external: true,
      },
    ],
  },
  {
    title: '文档',
    items: [
      { text: '安装指南', link: '/guide/install/' },
      { text: '用户指南', link: '/guide/use/' },
      { text: '开发者指南', link: '/developer-guide/' },
      { text: '参与贡献', link: '/guide/contribution/' },
      { text: '应用文档', link: 'https://www.halo.run/docs', external: true },
      {
        text: '知识库',
        link: 'https://www.halo.run/categories/kb',
        external: true,
      },
    ],
  },
  {
    title: '社区',
    items: [
      { text: '官方论坛', link: 'https://bbs.halo.run', external: true },
      {
        text: '官方资讯群',
        link: 'https://www.halo.run/upload/store-resources/autoHalonews.jpg',
        external: true,
      },
      {
        text: 'GitHub Issues',
        link: 'https://github.com/halo-dev/halo/issues',
        external: true,
      },
      {
        text: 'GitHub Discussions',
        link: 'https://github.com/halo-dev/halo/discussions',
        external: true,
      },
      {
        text: 'Telegram Channel',
        link: 'https://t.me/halo_dev',
        external: true,
      },
      { text: 'Telegram Group', link: 'https://t.me/HaloBlog', external: true },
    ],
  },
  {
    title: '友情链接',
    items: [
      {
        text: 'FIT2CLOUD 飞致云',
        link: 'https://www.fit2cloud.com/',
        external: true,
      },
      { text: '凌霞软件', link: 'https://www.lxware.cn/', external: true },
      {
        text: '1Panel - 开源 Linux 面板(中国站)',
        link: 'https://1panel.cn/',
        external: true,
      },
      {
        text: '1Panel - VPS Control Panel (International)',
        link: 'https://1panel.pro/',
        external: true,
      },
      {
        text: 'JumpServer - 开源堡垒机(中国站)',
        link: 'https://www.jumpserver.org/',
        external: true,
      },
      {
        text: 'JumpServer - Open-Source PAM (International)',
        link: 'https://www.jumpserver.com/',
        external: true,
      },
      {
        text: 'MaxKB AI 知识库问答系统',
        link: 'https://maxkb.cn',
        external: true,
      },
    ],
  },
];

function FooterLink({ item }: { item: FooterItem }) {
  if (item.external) {
    return (
      <a href={item.link} target="_blank" rel="noreferrer">
        {item.text}
      </a>
    );
  }
  return <Link href={item.link}>{item.text}</Link>;
}

export function FooterColumns() {
  return (
    <footer className="site-footer">
      <div className="site-footer__columns">
        {columns.map((col) => (
          <div key={col.title} className="site-footer__column">
            <h4>{col.title}</h4>
            <ul>
              {col.items.map((item) => (
                <li key={item.text}>
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="site-footer__copyright">
        ©2026 Halo All Rights Reserved 凌霞(深圳)软件有限公司
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
          粤ICP备2023013692号
        </a>
      </div>
    </footer>
  );
}
