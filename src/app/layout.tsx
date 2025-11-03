import type { Metadata, Viewport } from 'next';
import { Figtree as FontBody } from 'next/font/google';

import { Provider } from '@/components/ui/provider';
import { Layout } from '@/lib/layout';

const fontBody = FontBody({
  subsets: ['latin'],
  variable: '--font-body',
});

type RootLayoutProps = {
  children: React.ReactNode;
};

const APP_NAME = 'POMS';

export const metadata: Metadata = {
  title: APP_NAME,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning className={fontBody.className}>
      <body>
        <Provider>
          <Layout>{children}</Layout>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
