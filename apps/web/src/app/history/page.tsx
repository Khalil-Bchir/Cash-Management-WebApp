import { HistoryOverview } from '@/components/component/history-overview';
import { Navbar } from '@/components/layout/NavBar';
import ProtectedRoute from '@/views/private-route';

export default function Home() {
  return (
    <div>
      <ProtectedRoute>
        <div className="flex flex-grow items-center justify-center py-10">
          <HistoryOverview />
        </div>
      </ProtectedRoute>
    </div>
  );
}
