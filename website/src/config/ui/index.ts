export type Link = {
  title: string;
  href: string;
  disabled?: boolean;
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

const getSidebarUIConfig = (): SidebarUIConfig => ({
  indexTitle: 'Leaderboard',
  // sections are generated from lib/structure.ts so not defined here
  mobileBottomLinks: [
    {
      title: 'Home',
      href: '#',
      disabled: true,
    },
    {
      title: 'Research',
      href: '#',
      disabled: true,
    },
    {
      title: 'News',
      href: '#',
      disabled: true,
    },
    {
      title: 'Blogs',
      href: '#',
      disabled: true,
    },
  ],
});

const getTopbarUIConfig = (): TopbarUIConfig => ({
  title: 'SWE Lens',
  searchEnabled: true,
  links: [
    {
      title: 'Home',
      href: '#',
      disabled: true,
    },
    {
      title: 'Research',
      href: '#',
      disabled: true,
    },
    {
      title: 'News',
      href: '#',
      disabled: true,
    },
    {
      title: 'Blog',
      href: '#',
      disabled: true,
    },
  ],
});

const getFooterUIConfig = (): FooterUIConfig => ({
  title: 'Huawei',
  subtitle: 'SWE Lens',
  rights: '© 2025 All rights reserved.',
  links: [
    {
      href: 'https://github.com/Center-for-Software-Excellence/SWE-Lens',
      title: 'Github',
      disabled: false,
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
