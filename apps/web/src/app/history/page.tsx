import { HistoryOverview } from '@/components/component/history-overview';
import { Navbar } from '@/components/layout/NavBar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-grow items-center justify-center py-10">
        <HistoryOverview />
      </div>
    </div>
  );
}
