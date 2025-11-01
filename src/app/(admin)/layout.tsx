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

import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AuthGuard } from '@/components/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <AuthGuard allowedRoles={['SUPER_ADMIN']}>
      <Flex h="100vh" overflow="hidden">
        {/* Desktop Sidebar */}
        <Box display={{ base: 'none', lg: 'block' }} w="64" flexShrink={0}>
          <AdminSidebar />
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
              <AdminSidebar />
            </DrawerBody>
          </DrawerContent>
        </DrawerRoot>

        {/* Main Content Area */}
        <Flex direction="column" flex="1" overflow="hidden">
          <AdminHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
          
          {/* Scrollable Content */}
          <Box flex="1" overflow="auto" bg="bg.subtle">
            {children}
          </Box>
        </Flex>
      </Flex>
    </AuthGuard>
  );
}