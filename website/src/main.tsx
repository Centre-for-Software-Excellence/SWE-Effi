import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import Docs from '@/app/docs';
import { ThemeProvider } from '@/components/common/theme-provider';

import '@/styles/index.css';

const router = createBrowserRouter(
  [
    {
      path: '/*',
      element: <Docs />,
    },
  ],
  {
    basename: '/SWE-Effi',
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
