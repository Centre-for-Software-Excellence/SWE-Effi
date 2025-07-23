export type Link = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
};

interface SidebarUIConfig {
  indexTitle: string;
  mobileBottomLinks: Link[];
}

interface TopbarUIConfig {
  title: string;
  searchEnabled: boolean;
  links: Link[];
}

interface FooterUIConfig {
  title: string;
  subtitle: string;
  rights: string;
  links: Link[];
}

const mainLinks = [
  // {
  //   title: 'Home',
  //   href: '/',
  // },
  // {
  //   title: 'Research',
  //   href: '/docs/research',
  // },
  // {
  //   title: 'Blog',
  //   href: '/docs/blog',
  // },
];

const getSidebarUIConfig = (): SidebarUIConfig => ({
  indexTitle: 'Leaderboard',
  mobileBottomLinks: mainLinks,
});

const getTopbarUIConfig = (): TopbarUIConfig => ({
  title: 'SWE Effi',
  searchEnabled: false,
  links: mainLinks,
});

const getFooterUIConfig = (): FooterUIConfig => ({
  title: 'Huawei',
  subtitle: 'SWE Effi',
  rights: '© 2025 All rights reserved.',
  links: [
    {
      href: 'https://github.com/Centre-for-Software-Excellence/SWE-Effi',
      title: 'Github',
    },
    {
      href: '#',
      title: 'Paper',
      disabled: true,
    },
    {
      href: '#',
      title: 'Contact',
      disabled: true,
    },
  ],
});

export { getSidebarUIConfig, getTopbarUIConfig, getFooterUIConfig };
