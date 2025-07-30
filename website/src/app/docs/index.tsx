import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { Loading } from '@/components/common/ui/loading';
import { MDXViewer } from '@/components/md/mdx-viewer';
import { getSlugFromPath, resolveDocFromSlug } from '@/lib/docs/resolver';
import { cn } from '@/lib/utils';
import { useTocStore } from '@/stores/toc';
import { useUIStore } from '@/stores/ui';
import Layout from './layout';

export default function DocsPage() {
  const location = useLocation();
  const headings = useTocStore((state) => state.headings);
  const error = useUIStore((state) => state.error);
  const doc = useUIStore((state) => state.doc);
  const loading = useUIStore((state) => state.loading);
  useEffect(() => {
    const { setDoc, setShowToc, setLoading, setError, setShowFooter } =
      useUIStore.getState();
    async function loadDoc() {
      setLoading(true);
      setError(null);

      try {
        const slug = getSlugFromPath(location.pathname);
        const resolvedDoc = await resolveDocFromSlug(slug);

        if (!resolvedDoc) {
          setError('Document not found');
          return;
        }
        setDoc(resolvedDoc);
        setShowToc(resolvedDoc.type === 'mdx' && headings.length > 0);
      } catch (err) {
        setError('Failed to load document, error: ' + err);
      } finally {
        setLoading(false);
      }
    }
    loadDoc();
    setShowFooter(true);
  }, [location.pathname, headings.length]);

  // Handle hash fragment scrolling
  useEffect(() => {
    if (!loading && location.hash) {
      const scrollToElement = () => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'instant' });
          return true;
        }
        return false;
      };

      // Try immediately
      if (!scrollToElement()) {
        // If not found, retry after a short delay
        const timer = setTimeout(() => {
          scrollToElement();
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [location.hash, loading]);

  return (
    <Layout>
      {/* Main Content */}
      <main
        className={cn(
          'relative min-h-[calc(100vh-theme(spacing.12))] w-full overflow-x-hidden px-1 md:px-6',
        )}
      >
        {loading && <Loading />}
        {error && (
          <div className="flex items-center justify-center py-8">
            <div className="text-destructive">{error}</div>
          </div>
        )}
        {doc && doc.type === 'mdx' && doc.path && <MDXViewer path={doc.path} />}
        {doc && doc.type === 'tsx' && doc.module && (
          <div className="mx-auto max-w-[65ch] bg-background p-4 md:max-w-[calc(65ch+theme(spacing.56))] md:shrink-1 lg:max-w-[calc(85ch] prose-headings:mt-4">
            {(() => {
              const Component = doc.module.default || doc.module;
              return <Component />;
            })()}
          </div>
        )}
      </main>
    </Layout>
  );
}
