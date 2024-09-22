'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import {
  getOrders,
  makePartialPayment,
  selectCurrentPage,
  selectOrders,
  selectTotalPages,
} from '@/services/orderSlice';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarDays, Pencil } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';

interface Order {
  id: string;
  client: {
    name: string;
    phone: string;
  };
  totalAmount: number;
  handedAmount: number;
  restToPay: number;
  createdAt: string;
}

export function HistoryOverview() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const totalPages = useAppSelector(selectTotalPages);
  const currentPage = useAppSelector(selectCurrentPage);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [handedAmount, setHandedAmount] = useState<number>(0);
  const [localOrders, setLocalOrders] = useState<Order[]>(orders); // Local state for orders

  const productsPerPage = 7;

  useEffect(() => {
    dispatch(
      getOrders({
        page: currentPage,
        limit: productsPerPage,
        search: searchTerm,
        date: selectedDate,
      }),
    );
  }, [dispatch, currentPage, productsPerPage, searchTerm, selectedDate]);

  useEffect(() => {
    setLocalOrders(orders); // Update local state when orders change
  }, [orders]);

  const handlePageChange = (pageNumber: number) => {
    dispatch(
      getOrders({
        page: pageNumber,
        limit: productsPerPage,
        search: searchTerm,
        date: selectedDate,
      }),
    );
  };

  const handleDateSelect = (day: Date | undefined) => {
    setSelectedDate(day ? format(day, 'yyyy-MM-dd', { locale: fr }) : undefined);
  };

  const handleUpdateOrder = () => {
    if (selectedOrder) {
      const remainingBalance = selectedOrder.restToPay;
      if (handedAmount > remainingBalance) {
        alert(`Le montant payé ne peut pas dépasser le restant à payer: ${remainingBalance}`);
        return;
      }

      const payload = {
        orderId: selectedOrder.id,
        handedAmount: handedAmount,
        restToPay: remainingBalance - handedAmount, // Update the remaining balance accordingly
      };

      dispatch(makePartialPayment(payload)).then(() => {
        // Update the local orders state immediately after dispatch
        setLocalOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrder.id
              ? {
                  ...order,
                  handedAmount: order.handedAmount + handedAmount,
                  restToPay: remainingBalance - handedAmount,
                }
              : order,
          ),
        );

        setDialogOpen(false);
        setHandedAmount(0); // Reset handed amount
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl rounded-lg border px-4 py-12 md:px-6">
      <div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold">Historique des commandes</h1>
        <div className="ml-auto flex items-center gap-4">
          <Input
            type="search"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-[200px] sm:w-[250px] md:w-[300px]"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 px-3">
                <CalendarDays className="mr-2 h-4 w-4" />
                Filtrer par date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate ? new Date(selectedDate) : undefined}
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Separator />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Montant Total</TableHead>
            <TableHead>Montant Payé</TableHead>
            <TableHead>Restant</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localOrders.length > 0 ? (
            localOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{order.client.name}</span>
                    <small>({order.client.phone})</small>
                  </div>
                </TableCell>
                <TableCell>{order.totalAmount}</TableCell>
                <TableCell>{order.handedAmount}</TableCell>
                <TableCell>{order.restToPay}</TableCell>
                <TableCell>{format(new Date(order.createdAt), 'dd-MM-yyyy')}</TableCell>
                <TableCell>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-8 px-2"
                        onClick={() => {
                          setSelectedOrder(order);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Modifier la commande</DialogTitle>
                      </DialogHeader>
                      <div className="p-4">
                        <div className="mb-4 space-y-2">
                          <Label className="block text-sm">Montant Payé</Label>
                          <Input
                            type="number"
                            value={handedAmount}
                            onChange={(e) => setHandedAmount(Number(e.target.value))}
                          />
                          {selectedOrder && (
                            <p className="text-sm text-gray-500">
                              Restant à payer: {selectedOrder.restToPay}
                            </p>
                          )}
                        </div>
                        <Button onClick={handleUpdateOrder} disabled={!selectedOrder}>
                          Mettre à jour
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Pas de commandes trouvées
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)}>
            Précédent
          </PaginationPrevious>
          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => handlePageChange(index + 1)}
                isActive={index + 1 === currentPage}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext onClick={() => handlePageChange(currentPage + 1)}>Suivant</PaginationNext>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
