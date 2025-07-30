import { Footer } from '@/components/docs/footer';
import { DocsSidebar } from '@/components/docs/sidebar';
import { TopBar } from '@/components/docs/top-bar';
import { TableOfContent } from '@/components/md/table-of-content';
import { useUIStore } from '@/stores/ui';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const showFooter = useUIStore((state) => state.showFooter);
  const showToc = useUIStore((state) => state.showToc);
  return (
    <div className="relative w-full bg-background">
      {/* Top Bar */}
      <TopBar />
      {/* Main docs content */}
      <div className="relative mx-auto min-h-screen max-w-screen md:flex md:flex-row">
        {/* Left Sidebar - Sections Navigation */}
        <DocsSidebar />
        {/* article */}
        {children}
        {/* Right Sidebar - Table of Contents of current markdown doc*/}
        {showToc && <TableOfContent className="w-full" />}
      </div>
      {showFooter && <Footer />}
    </div>
  );
}
