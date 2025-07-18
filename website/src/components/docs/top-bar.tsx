import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/common/ui/button';
import { UnderlineLink } from '@/components/common/underline-link';
import { getTopbarUIConfig } from '@/config/ui';
import { cn } from '@/lib/utils';
import { SearchComponent } from './search';

export const TopBar = ({
  menuOpen,
  menuOnClickAction,
}: {
  menuOpen: boolean;
  menuOnClickAction: (open: boolean) => void;
}) => {
  const ui = getTopbarUIConfig();
  const topbarLinks = ui.links.filter((link) => !link.disabled);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border bg-background/95 pr-4 backdrop-blur transition-transform duration-300 ease-in-out supports-[backdrop-filter]:bg-background/60 md:border-none',
      )}
    >
      {/* fake sidebar border, here for easy layer*/}
      <span
        className={cn(
          'fixed top-0 bottom-0 left-70 hidden h-screen w-px animate-expand-y bg-[linear-gradient(to_top,transparent_0%,var(--border)_5%,var(--border)_95%,transparent_100%)] transition-all duration-300 ease-in-out md:block',
        )}
        aria-hidden
      />
      {/* fake topbar border */}
      <span
        className="absolute inset-x-0 bottom-0 hidden h-px animate-expand-x bg-[linear-gradient(to_right,transparent_0%,var(--border)_10%,var(--border)_90%,transparent_100%)] md:block"
        aria-hidden
      />
      <div className="flex h-12 w-full items-center justify-between text-sm md:text-lg">
        <div className="md:justify-none relative flex flex-1 items-center justify-between gap-2 px-2 md:flex-none">
          <Link
            to="/SWE-Effi/"
            className="group relative block transition-all duration-300"
          >
            <div className="h-full bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-600 bg-clip-text py-2 text-xl font-bold tracking-tight text-transparent md:w-70 md:text-2xl dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-400">
              {ui.title}
            </div>
          </Link>
        </div>
        {/* Mobile Menu Toggle */}
        {ui.searchEnabled && <SearchComponent className="md:hidden" />}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => menuOnClickAction(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="hidden items-center space-x-1 md:flex md:space-x-4">
          {topbarLinks?.map((link, idx) => (
            <UnderlineLink
              key={link.title + idx}
              href={link.href}
              gradient
              position="middle"
            >
              {link.title}
            </UnderlineLink>
          ))}
          {ui.searchEnabled && <SearchComponent />}
        </div>
      </div>
    </header>
  );
};
