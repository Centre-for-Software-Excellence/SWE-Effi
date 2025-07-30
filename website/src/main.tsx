import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { ThemeProvider } from '@/components/common/theme-provider';

import '@/styles/index.css';

import { Loading } from './components/common/ui/loading';

const Docs = lazy(() => import('@/app/docs'));

const router = createBrowserRouter(
  [
    {
      path: '/*',
      element: (
        <Suspense fallback={<Loading size="screen" />}>
          <Docs />
        </Suspense>
      ),
    },
  ],
  {
    basename: '/SWE-Effi/',
  },
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);

router.navigate(window.location.href.split('?currentRoute=')[1]);
