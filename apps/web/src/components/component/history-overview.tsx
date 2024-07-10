'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { commands as fakeHistory } from '@/data/fakeHistory';
// Assuming your fake history data is imported like this
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Archive, CalendarDays, Pencil, Search } from 'lucide-react';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { SelectSingleEventHandler } from 'react-day-picker';

export function HistoryOverview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCommand, setSelectedCommand] = useState<any>(null);
  const [commands, setCommands] = useState(fakeHistory); // Initialize commands state with fakeHistory
  const productsPerPage = 7; // Number of commands per page

  useEffect(() => {
    // Add any additional logic you might need on state change
  }, [commands]);

  const filteredCommands = useMemo(() => {
    let filtered = commands.filter((command) => command.archive === false); // Filter out archived commands

    if (selectedDate) {
      filtered = filtered.filter((command) => command.date === selectedDate);
    }

    if (searchTerm) {
      filtered = filtered.filter((command) => {
        const clientName = command.clientName ? command.clientName.toLowerCase() : '';
        const clientPhone = command.clientPhone ? command.clientPhone : '';
        const includesSearchTerm =
          clientName.includes(searchTerm.toLowerCase()) ||
          clientPhone.includes(searchTerm) ||
          command.products.some((product: any) =>
            product.productName
              ? product.productName.toLowerCase().includes(searchTerm.toLowerCase())
              : false,
          );
        return includesSearchTerm;
      });
    }

    return filtered;
  }, [searchTerm, selectedDate, commands]); // Add `commands` as a dependency

  const pageCount = useMemo(
    () => Math.ceil(filteredCommands.length / productsPerPage),
    [filteredCommands.length, productsPerPage],
  );

  const paginatedCommands = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredCommands.slice(startIndex, startIndex + productsPerPage);
  }, [filteredCommands, currentPage, productsPerPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDateSelect: SelectSingleEventHandler = (day: Date | undefined) => {
    if (day) {
      setSelectedDate(format(day, 'yyyy-MM-dd', { locale: fr }));
    } else {
      setSelectedDate(null);
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
            className="w-full md:w-auto"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">
                <CalendarDays />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                locale={fr}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Numéro de ticket</TableHead>
              <TableHead>Nom du client</TableHead>
              <TableHead>Téléphone du client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCommands.map((command, index) => (
              <TableRow key={index}>
                <TableCell>{command.id}</TableCell>
                <TableCell>{command.ticketNumber}</TableCell>
                <TableCell>{command.clientName}</TableCell>
                <TableCell>{command.clientPhone}</TableCell>
                <TableCell>{command.date}</TableCell>
                <TableCell className="flex gap-2">
                  <Sheet>
                    <SheetTrigger onClick={() => setSelectedCommand(command)}>
                      <Button size="icon" className="p-3">
                        <Pencil />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] p-6 sm:w-[540px]">
                      <SheetHeader className="mb-6">
                        <SheetTitle className="text-2xl font-bold">
                          Détails de la commande
                        </SheetTitle>
                        <SheetDescription className="text-muted-foreground">
                          Informations détaillées sur la commande sélectionnée.
                        </SheetDescription>
                      </SheetHeader>
                      {selectedCommand && (
                        <div className="space-y-6">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-row items-center justify-between">
                              <Label className="block text-sm font-bold">Numéro de ticket:</Label>
                              <p className="mt-1 ">{selectedCommand.ticketNumber}</p>
                            </div>
                            <Separator />
                            <div className="flex flex-row items-center justify-between">
                              <Label className="block text-sm font-bold">ID:</Label>
                              <p className="mt-1 ">{selectedCommand.id}</p>
                            </div>
                            <Separator />
                            <div className="flex flex-row items-center justify-between">
                              <Label className="block text-sm font-bold">Nom du client:</Label>
                              <p className="mt-1 ">{selectedCommand.clientName}</p>
                            </div>
                            <div className="flex flex-row items-center justify-between">
                              <Label className="block text-sm font-bold">
                                Téléphone du client:
                              </Label>
                              <p className="mt-1 ">{selectedCommand.clientPhone}</p>
                            </div>
                            <Separator />
                            <div className="flex flex-row items-center justify-between">
                              <Label className="block text-sm font-bold">Date:</Label>
                              <p className="mt-1 ">{selectedCommand.date}</p>
                            </div>
                            <Separator />
                            <div>
                              <Label className="block text-sm font-bold">Produits:</Label>
                              {selectedCommand.products.map((product: any, i: number) => (
                                <div key={i} className="flex flex-row items-center justify-between">
                                  <p className="mt-1 ">{product.productName}</p>
                                  <p className="mt-1 ">{product.details}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </SheetContent>
                  </Sheet>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="p-3"
                    onClick={() => {
                      const updatedCommands = commands.map((cmd) =>
                        cmd.id === command.id ? { ...cmd, archive: true } : cmd,
                      );
                      // Update the state with new commands
                      setCommands(updatedCommands); // Assuming you have a state to manage commands
                      console.log('Updated commands:', updatedCommands); // Add this line to log the updated commands
                    }}
                  >
                    <Archive />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(currentPage - 1)}
              //disabled={currentPage === 1}
            />
          </PaginationItem>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                onClick={() => handlePageChange(pageNumber)}
                isActive={pageNumber === currentPage}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => handlePageChange(currentPage + 1)}
              //disabled={currentPage === pageCount}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
