import { CashierOverview } from '@/components/component/cashier-overview';
import { Navbar } from '@/components/layout/NavBar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div>
        <CashierOverview />
      </div>
    </div>
  );
}
