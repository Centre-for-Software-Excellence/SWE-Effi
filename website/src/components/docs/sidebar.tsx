import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { getSidebarUIConfig } from '@/config/ui';
import { getDocsStructure, type DocSection } from '@/lib/docs/structure';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui';
import { UnderlineText } from '../common/ui/underline-text';

interface CollapsibleSectionProps {
  section: DocSection;
  isOpen: boolean;
  onToggle: () => void;
  loading?: boolean;
  onSectionClick: () => void;
}

function CollapsibleSection({
  section,
  isOpen,
  onToggle,
  loading = false,
  onSectionClick,
}: CollapsibleSectionProps) {
  const location = useLocation();
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded px-2 py-1 text-sm font-medium text-foreground transition-all duration-300 hover:bg-accent"
      >
        <span>{section.title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 animate-fade-in-top space-y-1">
          {section.items.map((item) => {
            const isActive =
              location.pathname === item.path && item.path !== '/';
            return (
              <Link
                onClick={onSectionClick}
                key={item.slug}
                to={item.path}
                className={cn(
                  'relative block px-2 py-1 pl-4 text-sm transition-all duration-300',
                  isActive
                    ? 'bg-accent text-foreground md:bg-transparent'
                    : 'text-muted-foreground hover:text-accent-foreground',
                )}
              >
                <span
                  className={cn(
                    'inset-0 -right-[9px] -z-10 hidden transition-opacity duration-300 md:absolute md:block md:bg-[repeating-linear-gradient(to_left,var(--border),var(--border),var(--border),transparent)]',
                    isActive && !loading ? 'opacity-100' : 'opacity-0',
                  )}
                  aria-hidden
                >
                  <span className="absolute inset-px -z-10 bg-background" />
                  <span className="absolute inset-px -z-10 bg-gradient-to-l from-accent/70 via-accent/50 to-transparent" />
                </span>
                {item.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DocsSidebar() {
  const docsStructure = getDocsStructure();
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(docsStructure.map((section) => section.slug)),
  );
  const ui = getSidebarUIConfig();
  const navigate = useNavigate();

  const bottomLinks = ui.mobileBottomLinks.filter((link) => !link.disabled);
  const toggleSection = (sectionSlug: string) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionSlug)) {
        newSet.delete(sectionSlug);
      } else {
        newSet.add(sectionSlug);
      }
      return newSet;
    });
  };
  const location = useLocation();
  const showSidebar = useUIStore((state) => state.showSidebar);
  const loading = useUIStore((state) => state.loading);
  const menuOpen = useUIStore((state) => state.menuOpen);
  const setMenuOpen = useUIStore((state) => state.setMenuOpen);

  return showSidebar ? (
    <aside
      className={cn(
        'sticky top-12 hidden h-[calc(100vh-theme(spacing.12))] overflow-x-hidden overflow-y-auto border-border px-2 py-4 md:flex md:w-70 md:shrink-0 md:flex-col',
        menuOpen
          ? 'fixed left-0 z-99 flex h-[calc(100vh-theme(spacing.12))] w-full flex-col justify-between overflow-y-auto bg-background'
          : 'hidden',
      )}
    >
      <nav className="space-y-2 px-2 md:px-0">
        <Link
          onClick={() => {
            if (loading) return;
            setMenuOpen(false);
          }}
          key={'index'}
          to={'/'}
          className={cn(
            'relative block px-2 py-1 pl-4 text-sm transition-all duration-300',

            location.pathname === '/'
              ? 'bg-accent text-foreground md:bg-transparent'
              : 'text-muted-foreground hover:text-accent-foreground',
          )}
        >
          <span
            className={cn(
              'inset-0 -right-[9px] -z-10 hidden transition-opacity duration-300 md:absolute md:block md:bg-[repeating-linear-gradient(to_left,var(--border),var(--border),var(--border),transparent)]',
              location.pathname === '/' && !loading
                ? 'opacity-100'
                : 'opacity-0',
            )}
            aria-hidden
          >
            <span className="absolute inset-px -z-10 bg-background" />
            <span className="absolute inset-px -z-10 bg-gradient-to-l from-accent/70 via-accent/50 to-transparent" />
          </span>
          {ui.indexTitle}
        </Link>
        {docsStructure.map((section) => (
          <CollapsibleSection
            key={section.slug}
            section={section}
            isOpen={openSections.has(section.slug)}
            onToggle={() => {
              toggleSection(section.slug);
            }}
            onSectionClick={() => {
              if (loading) return;
              setMenuOpen(false);
            }}
            loading={loading}
          />
        ))}
      </nav>

      <div className="mt-8 flex w-full flex-col items-center space-y-2 self-end md:hidden">
        {bottomLinks?.map((link, idx) => (
          <div
            key={link.title + idx}
            onClick={() => {
              setTimeout(() => {
                setMenuOpen(false);
              }, 0);
              navigate(link.href);
            }}
          >
            <UnderlineText
              gradient={true}
              position={'middle'}
              lineStyle="thin"
              className="cursor-pointer text-sm font-normal text-muted-foreground no-underline"
            >
              {link.title}
            </UnderlineText>
          </div>
        ))}
      </div>
    </aside>
  ) : (
    <aside
      className={cn(
        menuOpen
          ? 'fixed top-12 left-0 z-99 flex h-[calc(100vh-theme(spacing.12))] w-full flex-col justify-between overflow-x-hidden overflow-y-auto bg-background px-2 py-4'
          : 'hidden',
      )}
    >
      <div className="mt-8 flex w-full flex-col items-center space-y-2 self-end md:hidden">
        {bottomLinks?.map((link, idx) => (
          <div
            key={link.title + idx}
            onClick={() => {
              setTimeout(() => {
                setMenuOpen(false);
              }, 0);
              navigate(link.href);
            }}
          >
            <UnderlineText
              gradient={true}
              position={'middle'}
              lineStyle="thin"
              className="cursor-pointer text-sm font-normal text-muted-foreground no-underline"
            >
              {link.title}
            </UnderlineText>
          </div>
        ))}
      </div>
    </aside>
  );
}
