'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function CashierOverview(): JSX.Element {
  const [clients, setClients] = useState([
    { id: 1, name: 'John Doe', phone: '555-1234' },
    { id: 2, name: 'Jane Smith', phone: '555-5678' },
  ]);
  const [selectedClient, setSelectedClient] = useState<{
    id: number;
    name: string;
    phone: string;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('drop-off');
  const [products, setProducts] = useState([
    { id: 1, name: 'Produit A', price: 9.99 },
    { id: 2, name: 'Produit B', price: 14.99 },
    { id: 3, name: 'Produit C', price: 19.99 },
    { id: 4, name: 'Produit D', price: 24.99 },
    { id: 5, name: 'Produit E', price: 29.99 },
    { id: 6, name: 'Produit F', price: 34.99 },
    { id: 7, name: 'Produit G', price: 39.99 },
    { id: 8, name: 'Produit H', price: 44.99 },
    { id: 9, name: 'Produit I', price: 49.99 },
    { id: 10, name: 'Produit J', price: 54.99 },
    { id: 11, name: 'Produit K', price: 59.99 },
    { id: 12, name: 'Produit L', price: 64.99 },
    { id: 13, name: 'Produit M', price: 69.99 },
    { id: 14, name: 'Produit N', price: 74.99 },
    { id: 15, name: 'Produit O', price: 79.99 },
    { id: 16, name: 'Produit P', price: 84.99 },
    { id: 17, name: 'Produit Q', price: 89.99 },
    { id: 18, name: 'Produit R', price: 94.99 },
    { id: 19, name: 'Produit S', price: 99.99 },
    { id: 20, name: 'Produit T', price: 104.99 },
    { id: 21, name: 'Produit U', price: 109.99 },
    { id: 22, name: 'Produit V', price: 114.99 },
    { id: 23, name: 'Produit W', price: 119.99 },
    { id: 24, name: 'Produit X', price: 124.99 },
  ]);
  const [cart, setCart] = useState<{ id: number; name: string; price: number }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;
  const handleAddToCart = (product: { id: number; name: string; price: number }) => {
    setCart([...cart, product]);
  };
  const handleRemoveFromCart = (product: { id: number; name: string; price: number }) => {
    setCart(cart.filter((item) => item.id !== product.id));
  };
  const handleCreateClient = (name: string, phone: string) => {
    const newClient = { id: clients.length + 1, name, phone };
    setClients([...clients, newClient]);
    setSelectedClient(newClient);
  };
  const handleSelectClient = (client: { id: number; name: string; phone: string }) => {
    setSelectedClient(client);
  };
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };
  const totalAmount = cart.reduce((total, product) => total + product.price, 0);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
    // You can implement further logic for filtering clients based on the search term here
  };

  return (
    <div className="container mx-auto py-4">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-4 text-xl font-bold">Produits</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {currentProducts.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <div className="text-primary font-bold">{product.price} €</div>
                </div>
                <Button
                  variant="secondary"
                  className="mt-4 w-full"
                  onClick={() => handleAddToCart(product)}
                >
                  Ajouter au Panier
                </Button>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} />
                </PaginationItem>
                {Array.from(
                  { length: Math.ceil(products.length / productsPerPage) },
                  (_, i) => i + 1,
                ).map((pageNumber) => (
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
                  <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="mb-4 text-xl font-bold">Panier</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Votre panier est vide.</p>
          ) : (
            <ul>
              {cart.map((product) => (
                <li key={product.id} className="mb-2 flex items-center justify-between">
                  <div>
                    {product.name} - {product.price.toFixed(2)} €
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveFromCart(product)}
                  >
                    Retirer
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <Separator className="my-4" />
          <div className="flex items-center justify-between font-bold">
            <div>Total :</div>
            <div>{totalAmount.toFixed(2)} €</div>
          </div>
          <Separator className="my-4" />
          <h2 className="mb-4 text-xl font-bold">Clients</h2>

          {/* Search bar */}
          <div className="mb-4 flex items-center">
            <Input
              type="text"
              placeholder="Rechercher des clients..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="mr-2 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="h-6 w-6 text-gray-500" />
          </div>

          {/* Client list */}
          <ul>
            {clients.map((client) => (
              <li key={client.id} className="mb-2">
                <Button variant="secondary" onClick={() => handleSelectClient(client)}>
                  {client.name} - {client.phone}
                </Button>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <h2 className="mb-4 text-xl font-bold">Créer un client</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const name = (form.elements.namedItem('name') as HTMLInputElement).value;
              const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
              handleCreateClient(name, phone);
              form.reset();
            }}
          >
            <div className="mb-4">
              <Label htmlFor="name">Nom</Label>
              <Input
                type="text"
                id="name"
                name="name"
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                required
              />
            </div>
            <Button type="submit">Créer</Button>
          </form>
          <Separator className="my-4" />
          <h2 className="mb-4 text-xl font-bold">Méthode de Paiement</h2>
          <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange}>
            <div className="mb-2 flex items-center">
              <RadioGroupItem value="drop-off" id="drop-off" />
              <Label htmlFor="drop-off" className="ml-2">
                À la livraison
              </Label>
            </div>
            <div className="mb-2 flex items-center">
              <RadioGroupItem value="in-shop" id="in-shop" />
              <Label htmlFor="in-shop" className="ml-2">
                En boutique
              </Label>
            </div>
          </RadioGroup>
          <Separator className="my-4" />
          {selectedClient && <Button size="lg">Passer la Commande</Button>}
          {!selectedClient && (
            <Button disabled size="lg">
              Passer la Commande
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
