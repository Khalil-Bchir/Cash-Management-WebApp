'use client';

import { ProductList } from '@/components/modules/product-list';
import ProtectedRoute from '@/views/private-route';

export default function Home() {
  return (
    <div>
      <ProtectedRoute>
        <div>
          <ProductList />
        </div>
      </ProtectedRoute>
    </div>
  );
}
