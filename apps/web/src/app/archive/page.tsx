import { ArchiveOverview } from '@/components/component/archive-overview';
import { Navbar } from '@/components/layout/NavBar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-grow items-center justify-center py-10">
        <ArchiveOverview />
      </div>
    </div>
  );
}
