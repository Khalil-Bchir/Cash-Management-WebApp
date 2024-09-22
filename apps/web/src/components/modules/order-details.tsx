// 'use client'

// import { useEffect, useState } from 'react'
// import { useAppDispatch, useAppSelector } from '@/services/hooks'; // Adjust this path as needed
// import { getOrderById } from '@/services/orderSlice'; // Adjust this path to your order slice
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// interface OrderProduct {
//   id: string
//   productId: string
//   quantity: number
// }

// interface Order {
//   id: string
//   clientId: string
//   userId: string
//   totalAmount: number
//   restToPay: number
//   orderProducts: OrderProduct[]
// }

// export function OrderDetails({ orderId }: { orderId: string }) {
//   const dispatch = useAppDispatch();
//   // const order = useAppSelector((state) => state.order.orders[orderId]); // Updated to access the correct slice
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         await dispatch(getOrderById(orderId));
//       } catch (err) {
//         setError('Failed to fetch order');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [dispatch, orderId]);

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>
//   }

//   if (error) {
//     return <div className="text-red-500 text-center">{error}</div>
//   }

//   if (!order) {
//     return <div className="text-center">No order found</div>
//   }

//   return (
//     <div className="container mx-auto p-4 space-y-6">
//       <h1 className="text-2xl font-bold">Order Details</h1>
//       <Card>
//         <CardHeader>
//           <CardTitle>Order Information</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label>Order ID</Label>
//               <div className="font-medium">{order.id}</div>
//             </div>
//             <div>
//               <Label>Client ID</Label>
//               <div className="font-medium">{order.clientId}</div>
//             </div>
//             <div>
//               <Label>User ID</Label>
//               <div className="font-medium">{order.userId}</div>
//             </div>
//             <div>
//               <Label>Total Amount</Label>
//               <div className="font-medium">${order.totalAmount.toFixed(2)}</div>
//             </div>
//             <div>
//               <Label>Remaining to Pay</Label>
//               <div className="font-medium text-red-500">${order.restToPay.toFixed(2)}</div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Order Products</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Product ID</TableHead>
//                 <TableHead>Quantity</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {order.orderProducts.map((product: OrderProduct) => (
//                 <TableRow key={product.id}>
//                   <TableCell>{product.productId}</TableCell>
//                   <TableCell>{product.quantity}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Make a Payment</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <Label htmlFor="amount">Amount</Label>
//             <Input
//               id="amount"
//               type="number"
//               placeholder="Enter amount to pay"
//               defaultValue={order.restToPay}
//             />
//           </div>
//           <div>
//             <Label htmlFor="method">Payment Method</Label>
//             <Select defaultValue="credit-card">
//               <SelectTrigger id="method">
//                 <SelectValue placeholder="Select payment method" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="credit-card">Credit Card</SelectItem>
//                 <SelectItem value="paypal">PayPal</SelectItem>
//                 <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <Button className="w-full">Make Payment</Button>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
