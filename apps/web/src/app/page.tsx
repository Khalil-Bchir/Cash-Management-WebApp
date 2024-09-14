import { CashierOverview } from '@/components/component/cashier-overview';
import ProtectedRoute from '@/views/private-route';

export default function Home() {
  return (
    <div>
      <ProtectedRoute>
        <div>
          <CashierOverview />
        </div>
      </ProtectedRoute>
    </div>
  );
}
