// import { OrderDetails } from '@/components/modules/order-details';
import ProtectedRoute from '@/views/private-route';

export default function Home({ params }: { params: { id: string } }) {
  return (
    <div>
      <ProtectedRoute>
        <div>{/* <OrderDetails orderId={params.id} /> */}</div>
      </ProtectedRoute>
    </div>
  );
}
