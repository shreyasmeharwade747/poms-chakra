'use client';

import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';


type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box as="main" minHeight="100dvh">
      {children}
    </Box>
  );
};
