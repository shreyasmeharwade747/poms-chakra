'use client';

import {
  Box,
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerRoot,
  Flex,
} from '@chakra-ui/react';
import { useState } from 'react';

import { FrontendHeader } from '@/components/admin/FrontendHeader';
import { FrontendSidebar } from '@/components/admin/FrontendSidebar';

interface FrontendLayoutProps {
  children: React.ReactNode;
}

export default function FrontendLayout({ children }: FrontendLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Desktop Sidebar */}
      <Box display={{ base: 'none', lg: 'block' }} w="64" flexShrink={0}>
        <FrontendSidebar />
      </Box>

      {/* Mobile Drawer */}
      <DrawerRoot
        open={isMobileMenuOpen}
        onOpenChange={(e) => setIsMobileMenuOpen(e.open)}
        placement="start"
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerBody p="0">
            <FrontendSidebar />
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>

      {/* Main Content Area */}
      <Flex direction="column" flex="1" overflow="hidden">
        <FrontendHeader onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable Content */}
        <Box flex="1" overflow="auto" bg="bg.subtle">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
