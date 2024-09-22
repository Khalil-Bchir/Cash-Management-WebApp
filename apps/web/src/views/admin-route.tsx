// ProtectedRoute.tsx
'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

// ProtectedRoute.tsx

const AdminRoute: React.FC<{ children: React.ReactNode; isAdmin: boolean }> = ({
  children,
  isAdmin,
}) => {
  const router = useRouter();

  React.useEffect(() => {
    if (!isAdmin) {
      router.push('/unauthorized');
    }
  }, [isAdmin, router]);

  return <>{isAdmin ? children : null}</>;
};

export default AdminRoute;
