'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Box, Spinner, Center, Text, VStack } from '@chakra-ui/react';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('SUPER_ADMIN' | 'USER')[];
  requireAuth?: boolean;
}

export const AuthGuard = ({ 
  children, 
  allowedRoles,
  requireAuth = true 
}: AuthGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't check auth on login page
    if (pathname === '/login') return;

    // If authentication is required and user is not authenticated
    if (requireAuth && status === 'unauthenticated') {
      console.log('AuthGuard: No session, redirecting to login');
      router.push('/login');
      return;
    }

    // If specific roles are required, check user role
    if (session?.user && allowedRoles && allowedRoles.length > 0) {
      const userRole = (session.user as any).role;
      
      if (!allowedRoles.includes(userRole)) {
        console.log('AuthGuard: Unauthorized role', userRole, 'Required:', allowedRoles);
        
        // Redirect based on user role
        if (userRole === 'USER') {
          router.push('/dashboard');
        } else if (userRole === 'SUPER_ADMIN') {
          router.push('/admin');
        } else {
          router.push('/login');
        }
      }
    }
  }, [session, status, router, pathname, allowedRoles, requireAuth]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <Center h="100vh" w="100vw">
        <VStack gap="4">
          <Spinner size="xl" color="#ed5d43" />
          <Text color="fg.muted">Verifying authentication...</Text>
        </VStack>
      </Center>
    );
  }

  // If authentication is required but user is not authenticated, show nothing
  // (will redirect in useEffect)
  if (requireAuth && status === 'unauthenticated') {
    return (
      <Center h="100vh" w="100vw">
        <VStack gap="4">
          <Spinner size="xl" color="#ed5d43" />
          <Text color="fg.muted">Redirecting to login...</Text>
        </VStack>
      </Center>
    );
  }

  // If role check fails, show nothing (will redirect in useEffect)
  if (session?.user && allowedRoles && allowedRoles.length > 0) {
    const userRole = (session.user as any).role;
    if (!allowedRoles.includes(userRole)) {
      return (
        <Center h="100vh" w="100vw">
          <VStack gap="4">
            <Spinner size="xl" color="#ed5d43" />
            <Text color="fg.muted">Redirecting...</Text>
          </VStack>
        </Center>
      );
    }
  }

  // User is authenticated and authorized, show the protected content
  return <>{children}</>;
};
