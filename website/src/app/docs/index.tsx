import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import { MDXViewer } from '@/components/md/mdx-viewer';
import {
  getSlugFromPath,
  resolveDocFromSlug,
  type ResolvedDoc,
} from '@/lib/docs/resolver';
import { cn } from '@/lib/utils';
import Layout from './layout';

export default function DocsPage() {
  const location = useLocation();
  const [doc, setDoc] = useState<ResolvedDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isArticle = doc?.type === 'mdx';

  useEffect(() => {
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
      } catch (err) {
        setError('Failed to load document');
        console.error('Error loading doc:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDoc();
  }, [location.pathname]);

  // Handle hash fragment scrolling
  useEffect(() => {
    if (!loading && location.hash) {
      const scrollToElement = () => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
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
    <Layout isArticle={isArticle} loading={loading}>
      {/* Main Content */}
      <main
        className={cn(
          'relative min-h-[calc(100vh-theme(spacing.12))] w-full overflow-x-hidden px-1 md:px-6',
          loading &&
            'relative before:fixed before:inset-0 before:-translate-x-full before:animate-loading before:bg-gradient-to-r before:from-transparent before:via-foreground/10 before:to-transparent md:before:-translate-x-full',
        )}
      >
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
