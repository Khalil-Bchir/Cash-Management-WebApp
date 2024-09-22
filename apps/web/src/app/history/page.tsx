import { HistoryOverview } from '@/components/modules/history-overview';
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
