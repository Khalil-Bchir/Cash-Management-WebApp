'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from '@/services/productSlice';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ProductList() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.product);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0 });
  const [editProduct, setEditProduct] = useState<{
    id: string;
    name: string;
    price: number;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createProduct(newProduct));
    setNewProduct({ name: '', price: 0 });
    setIsDialogOpen(false);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editProduct) {
      dispatch(updateProduct(editProduct));
      setIsEditDialogOpen(false);
      setEditProduct(null);
    }
  };

  const handleDeleteProduct = (id: string) => {
    dispatch(deleteProduct(id));
  };

  const openEditDialog = (product: { id: string; name: string; price: number }) => {
    setEditProduct(product);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des Produits</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un Nouveau Produit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un Nouveau Produit</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du Produit</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Prix</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
                  }
                  required
                />
              </div>
              <Button type="submit">Ajouter le Produit</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardContent className="flex-grow p-4">
                <h2 className="mb-2 text-lg font-semibold">{product.name}</h2>
                <p className="text-muted-foreground mb-4 font-bold">
                  {product.price.toFixed(2)} TND
                </p>
                <div className="mt-auto flex justify-between">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le Produit</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProduct} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nom du Produit</Label>
              <Input
                id="edit-name"
                value={editProduct?.name || ''}
                onChange={(e) =>
                  setEditProduct((prev) => (prev ? { ...prev, name: e.target.value } : null))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Prix</Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                value={editProduct?.price || 0}
                onChange={(e) =>
                  setEditProduct((prev) =>
                    prev ? { ...prev, price: parseFloat(e.target.value) } : null,
                  )
                }
                required
              />
            </div>
            <Button type="submit">Mettre à Jour le Produit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
