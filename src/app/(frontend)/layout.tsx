'use client';

import FrontendLayout from '@/components/admin/FrontendLayout';
import { AuthGuard } from '@/components/auth';

interface FrontendLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: FrontendLayoutProps) {
  return (
    <AuthGuard allowedRoles={['USER', 'SUPER_ADMIN']}>
      <FrontendLayout>{children}</FrontendLayout>
    </AuthGuard>
  );
}