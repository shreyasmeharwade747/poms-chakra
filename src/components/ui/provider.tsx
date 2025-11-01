'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';

import {customTheme} from '@/lib/styles/theme';

import { ColorModeProvider } from './color-mode';

export function Provider(props: React.PropsWithChildren) {
  return (
    <SessionProvider>
      <ChakraProvider value={customTheme}>
        <ColorModeProvider>{props.children}</ColorModeProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}
