'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { createClient, fetchClients, selectClients } from '@/services/clientSlice';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { initializeOrder } from '@/services/orderSlice';
import { fetchProducts, selectProducts } from '@/services/productSlice';
import { Minus, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CashierOverview(): JSX.Element {
  const dispatch = useAppDispatch(); // Typed dispatch

  // Fetch products and clients from the Redux store
  const products = useAppSelector(selectProducts); // Assuming selectProducts is defined in your product slice
  const clients = useAppSelector(selectClients);

  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to handle dialog visibility
  const [handedAmount, setHandedAmount] = useState<number>(0); // Define state for handedAmount
  const [selectedClient, setSelectedClient] = useState<{
    id: string;
    name: string;
    phone: string;
  } | null>(null);
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  // Fetch clients and products when the component mounts
  useEffect(() => {
    dispatch(fetchClients({ skip: 0, take: 5 }));
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product: { id: string; name: string; price: number }) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Handle reducing quantity
  const handleReduceQuantity = (product: { id: string; name: string; price: number }) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct && existingProduct.quantity > 1) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item,
        );
      } else {
        return prevCart.filter((item) => item.id !== product.id); // Remove if quantity is 1
      }
    });
  };

  // Remove all quantities of a product
  const handleRemoveAllFromCart = (product: { id: string; name: string; price: number }) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));
  };

  const handleSelectClient = (client: { id: string; name: string; phone: string }) => {
    setSelectedClient(client);
  };

  const handleCreateClient = async (name: string, phone: string) => {
    try {
      // Assuming you have a thunk or action to create a client
      const result = await dispatch(createClient({ name, phone })).unwrap();

      // After successful creation, fetch clients again
      await dispatch(fetchClients({ skip: 0, take: 5 }));

      // Select the newly created client
      setSelectedClient(result);
    } catch (error) {
      console.error('Failed to create client:', error);
    }
  };

  const totalAmount = cart.reduce((total, product) => total + product.price * product.quantity, 0);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
  };

  const handleConfirmOrder = async () => {
    if (!selectedClient) return; // Ensure a client is selected

    // Retrieve the user ID from session storage
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const userId = user.id;

    // Construct the order payload
    const orderPayload = {
      clientId: selectedClient.id,
      userId: userId,
      handedAmount: handedAmount,
      products: cart.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
      })),
    };

    // Dispatch the initializeOrder action
    try {
      await dispatch(initializeOrder(orderPayload)).unwrap();
      // Optionally, handle post-order creation logic here (e.g., reset cart, show success message)
    } catch (error) {
      console.error('Failed to create order:', error);
    }

    // Close the dialog after creating the order
    handleCloseDialog();
  };

  // Inside your DialogContent
  <Button onClick={handleConfirmOrder} className="w-32">
    Confirmer
  </Button>;

  return (
    <div className="container mx-auto py-4">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-4 text-xl font-bold">Produits</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
            {currentProducts.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <div className="text-primary font-bold">{product.price} TND</div>
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
                    {product.name} - {product.price.toFixed(2)} € x {product.quantity}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Decrease quantity button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReduceQuantity(product)}
                    >
                      <Minus />
                    </Button>

                    {/* Increase quantity button */}
                    <Button variant="outline" size="sm" onClick={() => handleAddToCart(product)}>
                      <Plus />
                    </Button>

                    {/* Remove all quantities button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveAllFromCart(product)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Separator className="my-4" />
          <div className="flex items-center justify-between font-bold">
            <div>Total :</div>
            <div>{totalAmount.toFixed(2)} TND</div>
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
          <ul className="flex flex-1 flex-wrap items-center gap-2">
            {clients
              .filter((client) => client.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((client) => (
                <li key={client.id} className="mb-2">
                  <Button
                    variant={selectedClient?.id === client.id ? undefined : 'secondary'}
                    onClick={() => handleSelectClient(client)}
                  >
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

          {/* Adding the text between the form and the button */}
          <p className="my-2 text-center text-gray-600">
            Veuillez créer ou sélectionner un client pour pouvoir passer la commande.{' '}
          </p>

          <Separator className="my-4" />
          <div className="flex items-end justify-end">
            {!selectedClient && (
              <Button disabled size="lg">
                Passer la Commande
              </Button>
            )}
            {selectedClient && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg">Passer la Commande</Button>
                </DialogTrigger>

                <DialogContent className="max-w-lg rounded-lg bg-white p-6 shadow-lg">
                  <DialogHeader className="mb-4 border-b pb-4">
                    <DialogTitle className="text-2xl font-semibold">
                      Confirmation de la Commande
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* Client Details */}
                    <div className="mb-6">
                      <h2 className="mb-2 text-lg font-medium">Détails de la Commande</h2>
                      <div className="">
                        <div className="flex justify-between">
                          <span>
                            <strong>Nom du client:</strong>
                          </span>
                          <span>{selectedClient?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>
                            <strong>Numéro de téléphone:</strong>
                          </span>
                          <span>{selectedClient?.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order summary */}
                    <div>
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-secondary text-secondary-foreground">
                            <th className="px-4 py-2">Produit</th>
                            <th className="px-4 py-2 text-center">Quantité</th>
                            <th className="px-4 py-2 text-right">Prix Unitaire</th>
                            <th className="px-4 py-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="text-secondary-foreground">
                          {cart.map((product) => (
                            <tr key={product.id} className="border-t">
                              <td className="px-4 py-2">{product.name}</td>
                              <td className="px-4 py-2 text-center">{product.quantity}</td>
                              <td className="px-4 py-2 text-right">
                                {product.price.toFixed(2)} TND
                              </td>
                              <td className="px-4 py-2 text-right">
                                {(product.price * product.quantity).toFixed(2)} TND
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Total */}
                    {/* Total and Handed Amount */}
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between border-t pt-4 text-lg font-bold">
                        <div>Total :</div>
                        <div>{totalAmount.toFixed(2)} TND</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="handedAmount" className="font-medium text-gray-700">
                          Montant Donné :
                        </label>
                        <input
                          id="handedAmount"
                          type="number"
                          value={handedAmount}
                          onChange={(e) => setHandedAmount(parseFloat(e.target.value))}
                          className="w-32 rounded-md border p-2"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="flex items-center justify-between font-bold">
                        <div>Rendu :</div>
                        <div>{(handedAmount - totalAmount).toFixed(2)} TND</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={handleCloseDialog} className="w-32">
                      Annuler
                    </Button>
                    <Button
                      onClick={() => {
                        handleCloseDialog();
                        handleConfirmOrder();
                      }}
                      className="w-32"
                    >
                      Confirmer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
