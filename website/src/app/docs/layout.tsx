import { useState } from 'react';

import { Footer } from '@/components/docs/footer';
import { DocsSidebar } from '@/components/docs/sidebar';
import { TopBar } from '@/components/docs/top-bar';
import { TableOfContent } from '@/components/md/table-of-content';

interface LayoutProps {
  children: React.ReactNode;
  isArticle?: boolean;
  loading?: boolean;
}

export default function Layout({
  children,
  isArticle = true,
  loading = false,
}: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="relative w-full bg-background">
      {/* Top Bar */}
      <TopBar menuOpen={menuOpen} menuOnClickAction={setMenuOpen} />
      {/* Main docs content */}
      <div className="relative mx-auto min-h-screen max-w-screen md:flex md:flex-row">
        {/* Left Sidebar - Sections Navigation */}
        <DocsSidebar
          loading={loading}
          menuOpen={menuOpen}
          onClickAction={setMenuOpen}
        />
        {/* article */}
        {children}
        {/* Right Sidebar - Table of Contents of current markdown doc*/}
        {isArticle && (
          <aside className="relative order-last ml-0 hidden shrink-0 grow-0 basis-0 md:basis-56 lg:block xl:basis-64">
            <nav className="sticky top-32 max-h-[calc(100vh-theme(spacing.64))] w-56 overflow-visible">
              <TableOfContent className="w-full" />
            </nav>
          </aside>
        )}
      </div>
      <Footer />
    </div>
  );
}
